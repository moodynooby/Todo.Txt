package app.todotxt.sync

import app.todotxt.domain.GroqSettings
import app.todotxt.persistence.BackupManager
import app.todotxt.persistence.FullSnapshot
import app.todotxt.persistence.PlatformStorage
import app.todotxt.persistence.Storage
import app.todotxt.service.PlatformDeviceId
import io.ktor.client.HttpClient
import io.ktor.client.request.get
import io.ktor.client.request.post
import io.ktor.client.request.setBody
import io.ktor.client.request.patch
import io.ktor.client.statement.bodyAsText
import io.ktor.http.ContentType
import io.ktor.http.HttpStatusCode
import io.ktor.http.contentType
import kotlinx.coroutines.CoroutineScope
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.Job
import kotlinx.coroutines.SupervisorJob
import kotlinx.coroutines.delay
import kotlinx.coroutines.isActive
import kotlinx.coroutines.launch
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.serialization.Serializable
import kotlinx.serialization.encodeToString
import kotlinx.serialization.json.Json
import kotlinx.serialization.json.JsonObject
import kotlinx.serialization.json.JsonPrimitive
import kotlinx.serialization.json.buildJsonObject
import kotlinx.serialization.json.jsonArray
import kotlinx.serialization.json.jsonObject
import kotlinx.serialization.json.jsonPrimitive
import kotlinx.serialization.json.put
import kotlin.random.Random

/**
 * Anonymous, local-first Firebase sync for the native app.
 *
 * There is no user-facing login. The manager signs in anonymously through the
 * Firebase Identity Toolkit REST API and stores the refresh token in the
 * platform-private storage. Firestore is used as a durable relay, while the
 * app's local files remain the immediate source of truth.
 *
 * A sync group ID is intentionally separate from the anonymous Firebase UID.
 * The group ID is the capability that will later be exchanged by the QR pairing
 * flow, allowing two anonymous devices to join the same sync group.
 */
object FirebaseSyncManager {
    private const val SESSION_FILE = "firebase_session.json"
    private const val GROUP_FILE = "firebase_sync_group.txt"
    private const val LOCAL_UPDATED_FILE = "firebase_local_updated_at.txt"
    private const val POLL_INTERVAL_MS = 5_000L
    private const val RETRY_INTERVAL_MS = 15_000L

    private val json = Json {
        ignoreUnknownKeys = true
        encodeDefaults = true
        explicitNulls = false
    }
    private val scope = CoroutineScope(SupervisorJob() + Dispatchers.Default)
    private var syncJob: Job? = null
    private val client = HttpClient()

    private val _status = MutableStateFlow<FirebaseSyncStatus>(FirebaseSyncStatus.Disabled)
    val status: StateFlow<FirebaseSyncStatus> = _status.asStateFlow()

    private var session: FirebaseSession? = null
    private var lastFingerprint: String? = null
    private var applyingRemote = false

    fun start() {
        if (syncJob?.isActive == true) return
        if (FirebaseProjectConfig.apiKey.isBlank() || FirebaseProjectConfig.projectId.isBlank()) {
            _status.value = FirebaseSyncStatus.Disabled
            return
        }

        syncJob = scope.launch {
            Storage.awaitLoaded()
            val groupId = getOrCreateSyncGroupId()
            _status.value = FirebaseSyncStatus.PairingRequired(groupId)

            while (isActive) {
                try {
                    _status.value = FirebaseSyncStatus.Connecting
                    val authSession = getOrCreateSession()
                    session = authSession
                    syncOnce(groupId, authSession.idToken)
                    _status.value = FirebaseSyncStatus.Synced(groupId)
                    delay(POLL_INTERVAL_MS)
                } catch (error: Throwable) {
                    _status.value = FirebaseSyncStatus.WaitingForNetwork(
                        error.message ?: "Firebase sync is waiting for a connection",
                    )
                    delay(RETRY_INTERVAL_MS)
                }
            }
        }
    }

    fun stop() {
        syncJob?.cancel()
        syncJob = null
        session = null
        _status.value = FirebaseSyncStatus.Disabled
    }

    /**
     * Stores a group ID obtained from the one-time QR/P2P pairing flow.
     * Calling this method causes the running worker to use the new group on its
     * next pass; no login screen is required.
     */
    fun setSyncGroupId(groupId: String) {
        val normalized = groupId.trim()
        require(normalized.length >= 16) { "Sync group ID is too short" }
        PlatformStorage.writeString(GROUP_FILE, normalized)
        lastFingerprint = null
    }

    fun currentSyncGroupId(): String? =
        PlatformStorage.readString(GROUP_FILE)?.trim()?.takeIf { it.isNotEmpty() }

    fun ensureSyncGroupId(): String = getOrCreateSyncGroupId()

    private suspend fun syncOnce(groupId: String, idToken: String) {
        val localUpdatedAt = readLocalUpdatedAt()
        val localSnapshot = snapshot(localUpdatedAt)
        val localFingerprint = json.encodeToString(localSnapshot)

        if (!applyingRemote && localFingerprint != lastFingerprint) {
            val nextUpdatedAt = if (localUpdatedAt > 0L) localUpdatedAt else now()
            writeLocalUpdatedAt(nextUpdatedAt)
            uploadSnapshot(groupId, idToken, snapshot(nextUpdatedAt))
            lastFingerprint = json.encodeToString(snapshot(nextUpdatedAt))
        }

        val remote = downloadLatestSnapshot(groupId, idToken)
        if (remote != null && remote.updatedAt > readLocalUpdatedAt()) {
            applyingRemote = true
            try {
                BackupManager.createNow("before_remote_apply")
                applySnapshot(remote)
                writeLocalUpdatedAt(remote.updatedAt)
                lastFingerprint = json.encodeToString(snapshot(remote.updatedAt))
            } finally {
                applyingRemote = false
            }
        } else if (remote == null && readLocalUpdatedAt() == 0L) {
            val firstUpdatedAt = now()
            writeLocalUpdatedAt(firstUpdatedAt)
            uploadSnapshot(groupId, idToken, snapshot(firstUpdatedAt))
            lastFingerprint = json.encodeToString(snapshot(firstUpdatedAt))
        }
    }

    private suspend fun getOrCreateSession(): FirebaseSession {
        val saved = PlatformStorage.readString(SESSION_FILE)?.let {
            runCatching { json.decodeFromString<FirebaseSession>(it) }.getOrNull()
        }
        val currentTime = now()
        if (saved != null && saved.expiresAt > currentTime + 60_000L) return saved

        if (saved != null) {
            val refreshed = refreshSession(saved.refreshToken)
            PlatformStorage.writeString(SESSION_FILE, json.encodeToString(refreshed))
            return refreshed
        }

        val created = signInAnonymously()
        PlatformStorage.writeString(SESSION_FILE, json.encodeToString(created))
        return created
    }

    private suspend fun signInAnonymously(): FirebaseSession {
        val response = client.post(
            "https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=${FirebaseProjectConfig.apiKey}",
        ) {
            contentType(ContentType.Application.Json)
            setBody("{\"returnSecureToken\":true}")
        }
        if (response.status != HttpStatusCode.OK) {
            error("Anonymous Firebase sign-in failed: ${response.bodyAsText()}")
        }
        val body = json.parseToJsonElement(response.bodyAsText()).jsonObject
        return FirebaseSession(
            localId = body.requiredString("localId"),
            idToken = body.requiredString("idToken"),
            refreshToken = body.requiredString("refreshToken"),
            expiresAt = now() + body.requiredLong("expiresIn") * 1_000L,
        )
    }

    private suspend fun refreshSession(refreshToken: String): FirebaseSession {
        val response = client.post(
            "https://securetoken.googleapis.com/v1/token?key=${FirebaseProjectConfig.apiKey}",
        ) {
            contentType(ContentType.Application.FormUrlEncoded)
            setBody("grant_type=refresh_token&refresh_token=$refreshToken")
        }
        if (response.status != HttpStatusCode.OK) {
            PlatformStorage.writeString(SESSION_FILE, "")
            return signInAnonymously()
        }
        val body = json.parseToJsonElement(response.bodyAsText()).jsonObject
        return FirebaseSession(
            localId = body.requiredString("user_id"),
            idToken = body.requiredString("id_token"),
            refreshToken = body.requiredString("refresh_token"),
            expiresAt = now() + body.requiredLong("expires_in") * 1_000L,
        )
    }

    private suspend fun uploadSnapshot(
        groupId: String,
        idToken: String,
        snapshot: FullSnapshot,
    ) {
        val path = documentPath(groupId, safeId(PlatformDeviceId.deviceId))
        val body = buildJsonObject {
            put("fields", buildJsonObject {
                put("payload", buildJsonObject { put("stringValue", json.encodeToString(snapshot)) })
                put("updatedAt", buildJsonObject { put("integerValue", snapshot.updatedAt) })
                put("deviceId", buildJsonObject { put("stringValue", PlatformDeviceId.deviceId) })
            })
        }
        val response = client.patch("$path?updateMask.fieldPaths=payload&updateMask.fieldPaths=updatedAt&updateMask.fieldPaths=deviceId") {
            contentType(ContentType.Application.Json)
            headers.append("Authorization", "Bearer $idToken")
            setBody(body.toString())
        }
        if (response.status.value !in 200..299) {
            error("Firebase upload failed: ${response.status.value}")
        }
    }

    private suspend fun downloadLatestSnapshot(
        groupId: String,
        idToken: String,
    ): FullSnapshot? {
        val response = client.get(collectionPath(groupId)) {
            headers.append("Authorization", "Bearer $idToken")
        }
        if (response.status == HttpStatusCode.NotFound) return null
        if (response.status.value !in 200..299) {
            error("Firebase download failed: ${response.status.value}")
        }

        val root = json.parseToJsonElement(response.bodyAsText()).jsonObject
        return root["documents"]?.jsonArray
            ?.mapNotNull { element ->
                val fields = element.jsonObject["fields"]?.jsonObject ?: return@mapNotNull null
                val payload = fields["payload"]?.jsonObject?.get("stringValue")
                    ?.jsonPrimitive?.content ?: return@mapNotNull null
                runCatching { json.decodeFromString<FullSnapshot>(payload) }.getOrNull()
            }
            ?.maxByOrNull { it.updatedAt }
    }

    private fun snapshot(updatedAt: Long): FullSnapshot =
        BackupManager.capture(updatedAt = updatedAt)

    private fun applySnapshot(remote: FullSnapshot) {
        Storage.setContent(remote.content)
        Storage.replaceNotes(remote.notes)
        Storage.replaceHabits(remote.habits)
        Storage.replaceTimers(remote.timers)
        Storage.replaceSettings(remote.settings)
        Storage.replaceDrawings(remote.drawings)
    }

    private fun getOrCreateSyncGroupId(): String {
        currentSyncGroupId()?.let { return it }
        val generated = buildString {
            repeat(24) { append("0123456789abcdef"[Random.nextInt(16)]) }
        }
        setSyncGroupId(generated)
        return generated
    }

    private fun collectionPath(groupId: String): String =
        "https://firestore.googleapis.com/v1/projects/${FirebaseProjectConfig.projectId}/databases/(default)/documents/syncGroups/${safeId(groupId)}/snapshots"

    private fun documentPath(groupId: String, deviceId: String): String =
        "${collectionPath(groupId)}/$deviceId"

    private fun safeId(value: String): String =
        value.replace(Regex("[^A-Za-z0-9_-]"), "_").take(128)

    private fun readLocalUpdatedAt(): Long =
        PlatformStorage.readString(LOCAL_UPDATED_FILE)?.toLongOrNull() ?: 0L

    private fun writeLocalUpdatedAt(value: Long) =
        PlatformStorage.writeString(LOCAL_UPDATED_FILE, value.toString())

    private fun now(): Long = app.todotxt.platform.nowMillis()

    private fun JsonObject.requiredString(name: String): String =
        this[name]?.jsonPrimitive?.content ?: error("Firebase response missing $name")

    private fun JsonObject.requiredLong(name: String): Long =
        requiredString(name).toLongOrNull() ?: error("Firebase response field $name is not numeric")
}

sealed interface FirebaseSyncStatus {
    data object Disabled : FirebaseSyncStatus
    data object Connecting : FirebaseSyncStatus
    data class PairingRequired(val groupId: String) : FirebaseSyncStatus
    data class Synced(val groupId: String) : FirebaseSyncStatus
    data class WaitingForNetwork(val message: String) : FirebaseSyncStatus
}

@Serializable
private data class FirebaseSession(
    val localId: String,
    val idToken: String,
    val refreshToken: String,
    val expiresAt: Long,
)
