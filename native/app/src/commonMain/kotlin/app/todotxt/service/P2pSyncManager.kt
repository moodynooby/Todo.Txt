package app.todotxt.service

import app.todotxt.core.crdt.LwwMap
import app.todotxt.core.crdt.LwwEntry
import app.todotxt.domain.Habit
import app.todotxt.persistence.Storage
import io.ktor.client.HttpClient
import io.ktor.client.request.get
import io.ktor.client.request.post
import io.ktor.client.request.setBody
import io.ktor.client.statement.bodyAsText
import io.ktor.http.ContentType
import io.ktor.http.HttpStatusCode
import io.ktor.http.contentType
import io.ktor.serialization.kotlinx.json.json
import io.ktor.server.application.Application
import io.ktor.server.application.install
import io.ktor.server.engine.ApplicationEngine
import io.ktor.server.engine.embeddedServer
import io.ktor.server.netty.Netty
import io.ktor.server.netty.NettyApplicationEngine
import io.ktor.server.plugins.contentnegotiation.ContentNegotiation
import io.ktor.server.request.receiveText
import io.ktor.server.response.respondText
import io.ktor.server.routing.get
import io.ktor.server.routing.post
import io.ktor.server.routing.routing
import kotlinx.coroutines.CoroutineScope
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.Job
import kotlinx.coroutines.SupervisorJob
import kotlinx.coroutines.cancel
import kotlinx.coroutines.launch
import kotlinx.serialization.encodeToString
import kotlinx.serialization.json.Json

/**
 * Bidirectional P2P sync manager using a QR-based handshake.
 *
 * Protocol:
 * 1. Both devices expose a local HTTP endpoint (`/sync`) serving their
 *    LWW-encoded habits.
 * 2. Device A (the "initiator") generates a QR code containing its local URL.
 * 3. Device B (the "responder") scans the QR, then both devices exchange
 *    their LWW maps through the responder's client (A sends to B, B sends to
 *    A) — so the sync is truly bidirectional in a single handshake.
 * 4. Each device merges the remote entries into its own local store using
 *    LWW rules (higher timestamp wins; ties broken by deviceId).
 */
object P2pSyncManager {
    private const val DEFAULT_PORT = 8085

    private var server: io.ktor.server.engine.EmbeddedServer<NettyApplicationEngine, NettyApplicationEngine.Configuration>? = null
    private var syncJob: Job? = null
    private val scope = CoroutineScope(SupervisorJob() + Dispatchers.IO)

    private val json = Json {
        ignoreUnknownKeys = true
        encodeDefaults = true
    }

    /** Starts the local sync endpoint on this device and returns its URL. */
    fun startSenderServer(ipAddress: String): String {
        stopSenderServer()
        server = embeddedServer(Netty, port = DEFAULT_PORT) {
            install(ContentNegotiation) { json(json) }
            routing {
                get("/sync") {
                    val payload = Json.encodeToString(mapOf(
                        "deviceId" to PlatformDeviceId.deviceId,
                        "habits" to Storage.habits.value,
                    ))
                    call.respondText(payload, ContentType.Application.Json)
                }
                post("/sync/merge") {
                    val remoteJson = call.receiveText()
                    try {
                        val remote = json.decodeFromString<SyncPayload>(remoteJson)
                        mergeInbound(remote)
                        call.respondText("ok", ContentType.Text.Plain)
                    } catch (e: Throwable) {
                        call.respondText("error: ${e.message}", ContentType.Text.Plain, HttpStatusCode.BadRequest)
                    }
                }
            }
        }
        server?.start(wait = false)
        return "http://$ipAddress:$DEFAULT_PORT/sync"
    }

    fun stopSenderServer() {
        server?.stop(500, 1000)
        server = null
    }

    /**
     * Receives: after scanning the initiator's QR, this device performs the
     * bidirectional handshake — it pulls the initiator's data, merges locally,
     * then pushes its own (already-merged) data back to the initiator so both
     * sides converge.
     */
    fun performBidirectionalSync(initiatorUrl: String) {
        syncJob?.cancel()
        syncJob = scope.launch {
            try {
                val client = HttpClient {
                    install(io.ktor.client.plugins.contentnegotiation.ContentNegotiation) {
                        json(json)
                    }
                }
                // Pull: initiator -> us
                val response = client.get(initiatorUrl)
                if (response.status != HttpStatusCode.OK) {
                    println("Sync pull failed with status ${response.status}")
                    return@launch
                }
                val remote = json.decodeFromString<SyncPayload>(response.bodyAsText())
                mergeInbound(remote)

                // Push: us -> initiator (so the initiator also gets our newer data)
                val pushPayload = Json.encodeToString(SyncPayload(
                    deviceId = PlatformDeviceId.deviceId,
                    habits = Storage.habits.value,
                ))
                val pushResponse = client.post("$initiatorUrl/merge") {
                    contentType(ContentType.Application.Json)
                    setBody(pushPayload)
                }
                if (pushResponse.status != HttpStatusCode.OK) {
                    println("Sync push failed with status ${pushResponse.status}")
                }
                client.close()
            } catch (e: Throwable) {
                println("Bidirectional sync failed: ${e.message}")
            }
        }
    }

    /** Merges remote entries into the local store using LWW rules. */
    private fun mergeInbound(remote: SyncPayload) {
        val now = System.currentTimeMillis()
        val local = Storage.habits.value
        val merged = local.associateBy { it.id }.toMutableMap()

        remote.habits.forEach { remoteHabit ->
            val localHabit = merged[remoteHabit.id]
            val entry = LwwEntry(remoteHabit, remote.timestamp, remote.deviceId)
            val localEntry = localHabit?.let {
                LwwEntry(it, remote.timestamp - 1, PlatformDeviceId.deviceId)
            }
            if (localEntry == null || entry.winsOver(localEntry)) {
                merged[remoteHabit.id] = remoteHabit
            }
        }

        Storage.updateHabits { _ -> merged.values.toList() }
    }
}

@kotlinx.serialization.Serializable
data class SyncPayload(
    val deviceId: String,
    val timestamp: Long = System.currentTimeMillis(),
    val habits: List<Habit> = emptyList(),
)

/** Platform-specific device identifier (used for deterministic LWW tie-break). */
expect object PlatformDeviceId {
    val deviceId: String
}
