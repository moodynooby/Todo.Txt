package app.todotxt.service

import com.google.zxing.BarcodeFormat
import com.google.zxing.EncodeHintType
import com.google.zxing.qrcode.QRCodeWriter
import io.ktor.client.HttpClient
import io.ktor.client.engine.cio.CIO
import io.ktor.client.plugins.contentnegotiation.ContentNegotiation as ClientContentNegotiation
import io.ktor.client.plugins.websocket.WebSockets
import io.ktor.client.plugins.websocket.webSocket
import io.ktor.client.request.get
import io.ktor.client.statement.bodyAsText
import io.ktor.http.ContentType
import io.ktor.serialization.kotlinx.json.json
import io.ktor.server.application.install
import io.ktor.server.engine.EmbeddedServer
import io.ktor.server.engine.embeddedServer
import io.ktor.server.netty.Netty
import io.ktor.server.netty.NettyApplicationEngine
import io.ktor.server.plugins.contentnegotiation.ContentNegotiation
import io.ktor.server.response.respondText
import io.ktor.server.routing.get
import io.ktor.server.routing.routing
import io.ktor.server.websocket.WebSockets as ServerWebSockets
import io.ktor.server.websocket.webSocket as serverWebSocket
import io.ktor.websocket.Frame
import io.ktor.websocket.readText
import kotlinx.coroutines.CoroutineScope
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.Job
import kotlinx.coroutines.SupervisorJob
import kotlinx.coroutines.delay
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.launch
import kotlinx.serialization.Serializable
import kotlinx.serialization.encodeToString
import kotlinx.serialization.json.Json
import app.todotxt.core.Habit
import app.todotxt.core.HabitColor
import app.todotxt.persistence.Storage

/**
 * QR-based P2P Sync with continuous WebSocket sync.
 *
 * Uses the shared core LwwMap CRDT for merge operations.
 *
 * Protocol:
 * 1. Device A starts server → generates QR with http://<IP>:8899/sync?device=<ID>
 * 2. Device B scans QR → pulls A's state via REST → merges via LWW → opens WebSocket
 * 3. Both devices push local changes over WebSocket for continuous sync
 */
object P2pSyncManager {
    private const val SYNC_PORT = 8899

    private var server: EmbeddedServer<NettyApplicationEngine, NettyApplicationEngine.Configuration>? = null
    private var syncJob: Job? = null
    private val scope = CoroutineScope(SupervisorJob() + Dispatchers.IO)
    private val json = Json { ignoreUnknownKeys = true; encodeDefaults = true }

    sealed class SyncState {
        data object Idle : SyncState()
        data class Listening(val qrData: String) : SyncState()
        data class Syncing(val peerId: String) : SyncState()
        data class Connected(val peerId: String) : SyncState()
        data class Error(val message: String) : SyncState()
    }

    private val _state = MutableStateFlow<SyncState>(SyncState.Idle)
    val state = _state

    private val _scanRequested = MutableStateFlow(false)
    val scanRequested = _scanRequested

    fun setScanRequested(value: Boolean) {
        _scanRequested.value = value
    }

    /** Start sync server, return QR URL */
    fun startServer(): String {
        stopServer()
        val deviceId = PlatformDeviceId.deviceId
        val ipAddress = getLocalIpAddress()
        val qrData = "http://$ipAddress:$SYNC_PORT/sync?device=$deviceId"

        server = embeddedServer(Netty, port = SYNC_PORT) {
            install(ContentNegotiation) { json(json) }
            install(ServerWebSockets) {}
            routing {
                get("/sync") {
                    val peerId = call.request.queryParameters["device"] ?: "unknown"
                    val payload = json.encodeToString(
                        SyncPayload(deviceId = deviceId, habits = Storage.habits.value)
                    )
                    println("[P2pSync] Peer $peerId pulled full state")
                    call.respondText(payload, ContentType.Application.Json)
                }

                serverWebSocket("/ws") {
                    println("[P2pSync] WebSocket peer connected")
                    // Push our state immediately
                    val payload = json.encodeToString(
                        SyncPayload(deviceId = deviceId, habits = Storage.habits.value)
                    )
                    send(Frame.Text(payload))

                    // Bidirectional: receive + push
                    val receiveJob = launch {
                        for (frame in incoming) {
                            if (frame is Frame.Text) {
                                try {
                                    val remote = json.decodeFromString<SyncPayload>(frame.readText())
                                    mergeHabits(remote)
                                } catch (e: Throwable) {
                                    println("[P2pSync] Merge error: ${e.message}")
                                }
                            }
                        }
                    }

                    val pushJob = launch {
                        var lastHash = Storage.habits.value.hashCode()
                        while (true) {
                            delay(2000)
                            val currentHash = Storage.habits.value.hashCode()
                            if (currentHash != lastHash) {
                                lastHash = currentHash
                                val localPayload = json.encodeToString(
                                    SyncPayload(deviceId = deviceId, habits = Storage.habits.value)
                                )
                                send(Frame.Text(localPayload))
                                println("[P2pSync] Pushed local changes")
                            }
                        }
                    }

                    try {
                        for (frame in incoming) {
                            if (frame is Frame.Close) break
                        }
                    } finally {
                        receiveJob.cancel()
                        pushJob.cancel()
                    }
                }
            }
        }
        server?.start(wait = false)
        _state.value = SyncState.Listening(qrData)
        println("[P2pSync] Server started: $qrData")
        return qrData
    }

    fun stopServer() {
        syncJob?.cancel()
        server?.stop(500, 1000)
        server = null
    }

    /** Connect to a peer via their QR URL — bidirectional sync */
    fun connectToPeer(qrUrl: String) {
        syncJob?.cancel()
        syncJob = scope.launch {
            try {
                _state.value = SyncState.Syncing("remote")

                val client = HttpClient(CIO) {
                    install(ClientContentNegotiation) { json(json) }
                    install(WebSockets)
                }

                // Pull remote state
                val response = client.get(qrUrl)
                val remotePayload = json.decodeFromString<SyncPayload>(response.bodyAsText())
                mergeHabits(remotePayload)
                println("[P2pSync] Pulled ${remotePayload.habits.size} habits")

                // Open WebSocket for continuous sync
                val wsUrl = qrUrl.replace("http://", "ws://").replace("/sync", "/ws")
                client.webSocket(wsUrl) {
                    // Push our state
                    val ourPayload = json.encodeToString(
                        SyncPayload(deviceId = PlatformDeviceId.deviceId, habits = Storage.habits.value)
                    )
                    send(Frame.Text(ourPayload))
                    _state.value = SyncState.Connected("remote")

                    val receiveJob = launch {
                        for (frame in incoming) {
                            if (frame is Frame.Text) {
                                try {
                                    val remote = json.decodeFromString<SyncPayload>(frame.readText())
                                    mergeHabits(remote)
                                } catch (e: Throwable) {
                                    println("[P2pSync] WS merge error: ${e.message}")
                                }
                            }
                        }
                    }

                    val pushJob = launch {
                        var lastHash = Storage.habits.value.hashCode()
                        while (true) {
                            delay(2000)
                            val currentHash = Storage.habits.value.hashCode()
                            if (currentHash != lastHash) {
                                lastHash = currentHash
                                val localPayload = json.encodeToString(
                                    SyncPayload(deviceId = PlatformDeviceId.deviceId, habits = Storage.habits.value)
                                )
                                send(Frame.Text(localPayload))
                            }
                        }
                    }

                    try {
                        for (frame in incoming) {
                            if (frame is Frame.Close) break
                        }
                    } finally {
                        receiveJob.cancel()
                        pushJob.cancel()
                    }
                }
                client.close()
            } catch (e: Throwable) {
                _state.value = SyncState.Error(e.message ?: "Connection failed")
                println("[P2pSync] Failed: ${e.message}")
            }
        }
    }

    /** Generate QR code as pixel array */
    fun generateQrPixels(data: String, size: Int = 256): IntArray? {
        return try {
            val writer = QRCodeWriter()
            val hints = mapOf(
                EncodeHintType.MARGIN to 2,
                EncodeHintType.ERROR_CORRECTION to com.google.zxing.qrcode.decoder.ErrorCorrectionLevel.M
            )
            val bitMatrix = writer.encode(data, BarcodeFormat.QR_CODE, size, size, hints)
            val pixels = IntArray(size * size)
            for (y in 0 until size) {
                for (x in 0 until size) {
                    pixels[y * size + x] = if (bitMatrix.get(x, y)) 0xFF1B4332.toInt() else 0xFFFFFFFF.toInt()
                }
            }
            pixels
        } catch (e: Exception) {
            println("[P2pSync] QR gen failed: ${e.message}")
            null
        }
    }

    /** Merge remote habits into local storage using LWW + date union */
    private fun mergeHabits(remote: SyncPayload) {
        val local = Storage.habits.value
        val merged = local.associateBy { it.id }.toMutableMap()

        remote.habits.forEach { remoteHabit ->
            val localHabit = merged[remoteHabit.id]
            if (localHabit == null) {
                merged[remoteHabit.id] = remoteHabit
            } else {
                // Union completed dates, use newer updatedAt as base
                val mergedDates = (localHabit.completedDates + remoteHabit.completedDates).distinct()
                val base = if (remoteHabit.updatedAt >= localHabit.updatedAt) remoteHabit else localHabit
                merged[remoteHabit.id] = base.copy(
                    completedDates = mergedDates,
                    updatedAt = maxOf(localHabit.updatedAt, remoteHabit.updatedAt)
                )
            }
        }

        Storage.updateHabits { _ -> merged.values.toList() }
    }
}

@Serializable
data class SyncPayload(
    val deviceId: String,
    val timestamp: Long = System.currentTimeMillis(),
    val habits: List<Habit> = emptyList(),
)

/** Platform-specific device identifier. */
expect object PlatformDeviceId {
    val deviceId: String
}

/** Platform-specific local IP detection. */
expect fun getLocalIpAddress(): String
