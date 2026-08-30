package app.todotxt.sync

import app.todotxt.core.Habit
import app.todotxt.core.HabitColor
import app.todotxt.core.Note
import app.todotxt.core.NoteColor
import app.todotxt.core.TimerState
import app.todotxt.persistence.BackupManager
import app.todotxt.persistence.PlatformStorage
import app.todotxt.persistence.Storage
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
import kotlinx.serialization.json.JsonNull
import kotlinx.serialization.json.JsonObject
import kotlinx.serialization.json.JsonPrimitive
import kotlinx.serialization.json.buildJsonArray
import kotlinx.serialization.json.buildJsonObject
import kotlinx.serialization.json.decodeFromJsonElement
import kotlinx.serialization.json.encodeToJsonElement
import kotlinx.serialization.json.jsonArray
import kotlinx.serialization.json.jsonObject
import kotlinx.serialization.json.jsonPrimitive
import kotlinx.serialization.json.put
import kotlinx.datetime.Instant
import io.ktor.client.HttpClient
import io.ktor.client.request.get
import io.ktor.client.request.post
import io.ktor.client.request.patch
import io.ktor.client.request.setBody
import io.ktor.client.request.header
import io.ktor.client.statement.bodyAsText
import io.ktor.http.ContentType
import io.ktor.http.HttpStatusCode
import io.ktor.http.contentType

/**
 * Account-based Firebase sync that speaks the WEB app's wire protocol, so
 * native and web converge through the same cloud documents.
 *
 * Differences from the legacy [FirebaseSyncManager] relay:
 *  - real account (email/password via the Identity Toolkit REST API) instead
 *    of anonymous devices grouped by a QR-exchanged capability;
 *  - per-document LWW against `users/{uid}/{collection}/{id}` — the exact
 *    paths and field shapes the web's syncAdapters.ts codecs produce —
 *    instead of whole-device snapshot documents under `syncGroups/`;
 *  - `updatedAt` is written as an epoch-millis integer, which the web's
 *    reader accepts alongside its own server timestamps.
 *
 * Per-document rule (single pass per doc, converges in ≤2 polls):
 *  1. remote updatedAt newer than the last value we have seen → apply remote
 *     (after a safety backup) — the cloud wins on genuinely unseen state;
 *  2. otherwise, local payload differs from the last-synced payload → push.
 *
 * Drawings are intentionally not synced: the native stroke format and the
 * web's Excalidraw scene JSON are incompatible, and a lossy translation
 * would corrupt both. Preferences/theme stay per-device by design.
 */
object AccountSyncManager {
    private const val SESSION_FILE = "web_account_session.json"
    private const val STATE_FILE = "web_account_sync_state.json"
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

    private val _status = MutableStateFlow<AccountSyncStatus>(AccountSyncStatus.Disabled)
    val status: StateFlow<AccountSyncStatus> = _status.asStateFlow()
    private val _authMessage = MutableStateFlow<String?>(null)
    val authMessage: StateFlow<String?> = _authMessage.asStateFlow()

    private var session: Session? = null
    private var applyingRemote = false

    // ------------------------------------------------------------------
    // Public API
    // ------------------------------------------------------------------

    fun start() {
        if (syncJob?.isActive == true) return
        if (FirebaseProjectConfig.apiKey.isBlank() || FirebaseProjectConfig.projectId.isBlank()) {
            _status.value = AccountSyncStatus.Disabled
            return
        }
        syncJob = scope.launch {
            Storage.awaitLoaded()
            while (isActive) {
                try {
                    val s = ensureSession()
                    session = s
                    _status.value = AccountSyncStatus.Synced(s.email)
                    for (doc in docs) syncDoc(doc, s)
                    delay(POLL_INTERVAL_MS)
                } catch (e: Throwable) {
                    session = null
                    _status.value = when (e) {
                        is SignedOutException -> AccountSyncStatus.SignedOut
                        else -> AccountSyncStatus.WaitingForNetwork(
                            e.message ?: "Cloud sync is waiting for a connection",
                        )
                    }
                    delay(RETRY_INTERVAL_MS)
                }
            }
        }
    }

    fun stop() {
        syncJob?.cancel()
        syncJob = null
        session = null
        _status.value = AccountSyncStatus.Disabled
    }

    fun hasAccountSession(): Boolean =
        PlatformStorage.readString(SESSION_FILE)?.isNotBlank() == true

    fun signIn(email: String, password: String) {
        scope.launch {
            try {
                _authMessage.value = null
                _status.value = AccountSyncStatus.Connecting
                val created = postIdentity(
                    "accounts:signInWithPassword",
                    buildJsonObject {
                        put("email", email.trim())
                        put("password", password)
                        put("returnSecureToken", true)
                    },
                )
                storeSession(created, email.trim())
                start()
            } catch (e: Throwable) {
                _status.value = AccountSyncStatus.Error(e.message ?: "Sign-in failed")
            }
        }
    }

    fun createAccount(email: String, password: String) {
        scope.launch {
            try {
                _authMessage.value = null
                _status.value = AccountSyncStatus.Connecting
                val created = postIdentity(
                    "accounts:signUp",
                    buildJsonObject {
                        put("email", email.trim())
                        put("password", password)
                        put("returnSecureToken", true)
                    },
                )
                storeSession(created, email.trim())
                start()
            } catch (e: Throwable) {
                _status.value = AccountSyncStatus.Error(e.message ?: "Account creation failed")
            }
        }
    }

    fun sendPasswordReset(email: String) {
        scope.launch {
            try {
                _status.value = AccountSyncStatus.Connecting
                postIdentity(
                    "accounts:sendOobCode",
                    buildJsonObject {
                        put("requestType", "PASSWORD_RESET")
                        put("email", email.trim())
                    },
                )
                _authMessage.value = "Password reset email sent."
                _status.value = AccountSyncStatus.SignedOut
            } catch (e: Throwable) {
                _status.value = AccountSyncStatus.Error(e.message ?: "Password reset failed")
            }
        }
    }

    fun clearAuthMessage() {
        _authMessage.value = null
    }

    fun signOut() {
        PlatformStorage.writeString(SESSION_FILE, "")
        PlatformStorage.writeString(STATE_FILE, "")
        session = null
        _status.value = AccountSyncStatus.SignedOut
    }

    // ------------------------------------------------------------------
    // Auth plumbing (Identity Toolkit REST — same project as the web app)
    // ------------------------------------------------------------------

    private suspend fun postIdentity(operation: String, body: JsonObject): JsonObject {
        val response = client.post(
            "https://identitytoolkit.googleapis.com/v1/$operation?key=${FirebaseProjectConfig.apiKey}",
        ) {
            contentType(ContentType.Application.Json)
            setBody(body.toString())
        }
        val text = response.bodyAsText()
        if (response.status != HttpStatusCode.OK) {
            val message = runCatching {
                json.parseToJsonElement(text).jsonObject["error"]!!
                    .jsonObject["message"]!!.jsonPrimitive.content
            }.getOrNull() ?: "Auth failed (${response.status.value})"
            error(message)
        }
        return json.parseToJsonElement(text).jsonObject
    }

    private suspend fun ensureSession(): Session {
        val saved = PlatformStorage.readString(SESSION_FILE)
            ?.takeIf { it.isNotBlank() }
            ?.let { runCatching { json.decodeFromString<Session>(it) }.getOrNull() }
            ?: throw SignedOutException()

        val currentTime = now()
        if (saved.expiresAt > currentTime + 60_000L) return saved

        val refreshed = refreshSession(saved)
        PlatformStorage.writeString(SESSION_FILE, json.encodeToString(refreshed))
        return refreshed
    }

    private suspend fun refreshSession(saved: Session): Session {
        val response = client.post(
            "https://securetoken.googleapis.com/v1/token?key=${FirebaseProjectConfig.apiKey}",
        ) {
            contentType(ContentType.Application.FormUrlEncoded)
            setBody("grant_type=refresh_token&refresh_token=${saved.refreshToken}")
        }
        if (response.status != HttpStatusCode.OK) throw SignedOutException()
        val body = json.parseToJsonElement(response.bodyAsText()).jsonObject
        return Session(
            localId = body.requiredString("user_id"),
            idToken = body.requiredString("id_token"),
            refreshToken = body.requiredString("refresh_token"),
            expiresAt = now() + (body.requiredString("expires_in").toLongOrNull() ?: 0L) * 1_000L,
            email = saved.email,
        )
    }

    private fun storeSession(body: JsonObject, email: String) {
        val created = Session(
            localId = body.requiredString("localId"),
            idToken = body.requiredString("idToken"),
            refreshToken = body.requiredString("refreshToken"),
            expiresAt = now() + (body.requiredString("expiresIn").toLongOrNull() ?: 0L) * 1_000L,
            email = email,
        )
        PlatformStorage.writeString(SESSION_FILE, json.encodeToString(created))
    }

    private class SignedOutException : Exception("Signed out")

    // ------------------------------------------------------------------
    // Per-document sync
    // ------------------------------------------------------------------

    private class SyncDoc(
        val key: String,
        val collection: String,
        val id: String,
        val fieldNames: List<String>,
        val encode: () -> JsonObject?,
        val decodeAndApply: (JsonObject) -> Boolean,
    )

    private val docs = listOf(
        SyncDoc(
            key = "todos/main",
            collection = "todos",
            id = "main",
            fieldNames = listOf("content", "updatedAt"),
            encode = {
                buildJsonObject { put("content", Storage.content.value) }
            },
            decodeAndApply = { fields ->
                if ("content" !in fields) return@SyncDoc false
                Storage.setContent(fields.stringValueOrNull("content"))
                true
            },
        ),
        SyncDoc(
            key = "notes/main",
            collection = "notes",
            id = "main",
            fieldNames = listOf("value", "updatedAt"),
            encode = {
                buildJsonObject {
                    put("value", noteArrayJson(Storage.notes.value))
                }
            },
            decodeAndApply = { fields ->
                val notes = fields.arrayOrNull("value")?.mapNotNull { element ->
                    val noteJson = element as? JsonObject ?: return@mapNotNull null
                    runCatching {
                        json.decodeFromJsonElement(
                            Note.serializer(),
                            toEnumColor(noteJson, "color") { hex -> noteColorName(hex) },
                        )
                    }.getOrNull()
                } ?: return@SyncDoc false
                Storage.replaceNotes(notes)
                true
            },
        ),
        SyncDoc(
            key = "habits/main",
            collection = "habits",
            id = "main",
            fieldNames = listOf("habits", "updatedAt"),
            encode = {
                buildJsonObject {
                    put("habits", habitArrayJson(Storage.habits.value))
                }
            },
            decodeAndApply = { fields ->
                val habits = fields.arrayOrNull("habits")?.mapNotNull { element ->
                    val habitJson = element as? JsonObject ?: return@mapNotNull null
                    runCatching {
                        json.decodeFromJsonElement(
                            Habit.serializer(),
                            toEnumColor(habitJson, "color") { hex -> habitColorName(hex) },
                        )
                    }.getOrNull()
                } ?: return@SyncDoc false
                Storage.replaceHabits(habits)
                true
            },
        ),
        SyncDoc(
            key = "timers/main",
            collection = "timers",
            id = "main",
            fieldNames = listOf("value", "updatedAt"),
            // Running timers are per-device runtime state — exactly like the
            // web's beforeWrite, only idle snapshots ever leave the device.
            encode = {
                buildJsonObject {
                    put(
                        "value",
                        buildJsonArray {
                            Storage.timers.value
                                .filter { !it.isActive && it.startedAt == null }
                                .forEach { timer ->
                                    add(toWebTimerJson(timer))
                                }
                        },
                    )
                }
            },
            decodeAndApply = { fields ->
                val timers = fields.arrayOrNull("value")?.mapNotNull { element ->
                    val timerJson = element as? JsonObject ?: return@mapNotNull null
                    runCatching {
                        // Mirror the web's afterRead: remote timers land idle.
                        json.decodeFromJsonElement(
                            TimerState.serializer(),
                            fromWebTimerJson(timerJson),
                        ).copy(isActive = false, startedAt = null)
                    }.getOrNull()
                } ?: return@SyncDoc false
                Storage.replaceTimers(timers)
                true
            },
        ),
        SyncDoc(
            key = "excalidraw/main",
            collection = "excalidraw",
            id = "main",
            fieldNames = listOf("data", "updatedAt"),
            encode = {
                val scene = Storage.excalidrawScene.value
                    ?.takeIf { it.isNotBlank() } ?: return@SyncDoc null
                buildJsonObject {
                    // The scene IS the web's ExcalidrawData — passed through
                    // verbatim so nothing the web drew is lost.
                    put("data", json.parseToJsonElement(scene))
                }
            },
            decodeAndApply = { fields ->
                val data = fields["data"] as? JsonObject ?: return@SyncDoc false
                Storage.replaceExcalidrawScene(data.toString())
                true
            },
        ),
    )

    private suspend fun syncDoc(doc: SyncDoc, s: Session) {
        val localPayload = doc.encode() ?: return
        val localFingerprint = localPayload.toString()
        val state = readState().docs[doc.key] ?: DocState()

        val remote = fetchDoc(doc, s)
        when {
            remote != null && remote.second > state.updatedAt -> {
                applyingRemote = true
                try {
                    BackupManager.createNow("before_account_sync_${doc.collection}")
                    if (doc.decodeAndApply(remote.first)) {
                        // Fingerprint from OUR encoder post-apply so the next
                        // pass sees local == synced regardless of how the web
                        // ordered the JSON fields.
                        writeDocState(
                            doc.key,
                            DocState(
                                updatedAt = remote.second,
                                payload = doc.encode()?.toString() ?: localFingerprint,
                            ),
                        )
                    }
                } finally {
                    applyingRemote = false
                }
            }

            localFingerprint != state.payload -> {
                val stamp = now()
                pushDoc(doc, localPayload, stamp, s)
                writeDocState(doc.key, DocState(updatedAt = stamp, payload = localFingerprint))
            }
        }
    }

    /** Returns (PLAIN fields, updatedAtMillis) or null when the doc is absent.
     *  Firestore REST returns typed leaves (`{"stringValue": "x"}`); every
     *  decoder here works on plain JSON, so convert on the way in. */
    private suspend fun fetchDoc(doc: SyncDoc, s: Session): Pair<JsonObject, Long>? {
        val response = client.get(documentPath(s.localId, doc.collection, doc.id)) {
            header("Authorization", "Bearer ${s.idToken}")
        }
        if (response.status == HttpStatusCode.NotFound) return null
        if (response.status.value !in 200..299) {
            error("Cloud fetch failed for ${doc.key}: ${response.status.value}")
        }
        val raw = json.parseToJsonElement(response.bodyAsText())
            .jsonObject["fields"]?.jsonObject ?: return null
        val updated = typedUpdatedAtMillis(raw) ?: return null
        return firestoreToPlain(raw).jsonObject to updated
    }

    private suspend fun pushDoc(
        doc: SyncDoc,
        payload: JsonObject,
        stamp: Long,
        s: Session,
    ) {
        val fields = buildJsonObject {
            payload.forEach { (name, value) -> put(name, plainToFirestore(value)) }
            put("updatedAt", buildJsonObject { put("integerValue", stamp.toString()) })
        }
        val mask = doc.fieldNames.joinToString("&") { "updateMask.fieldPaths=$it" }
        val response = client.patch(
            "${documentPath(s.localId, doc.collection, doc.id)}?$mask",
        ) {
            contentType(ContentType.Application.Json)
            header("Authorization", "Bearer ${s.idToken}")
            setBody(buildJsonObject { put("fields", fields) }.toString())
        }
        if (response.status.value !in 200..299) {
            error("Cloud push failed for ${doc.key}: ${response.status.value}")
        }
    }

    // ------------------------------------------------------------------
    // Firestore REST value <-> plain JSON conversion
    // ------------------------------------------------------------------
    private fun firestoreToPlain(element: kotlinx.serialization.json.JsonElement): kotlinx.serialization.json.JsonElement {
        if (element !is JsonObject || element.size != 1) {
            return element
        }
        val (key, value) = element.entries.first()
        return when (key) {
            "stringValue" -> value
            "booleanValue" -> value
            "integerValue" -> JsonPrimitive(
                value.jsonPrimitive.content.toLongOrNull()
                    ?: value.jsonPrimitive.content.toDouble(),
            )
            "doubleValue" -> JsonPrimitive(
                value.jsonPrimitive.content.toDoubleOrNull() ?: 0.0,
            )
            "nullValue" -> JsonNull
            "timestampValue" -> value
            "mapValue" -> firestoreToPlain(
                value.jsonObject["fields"] ?: buildJsonObject { },
            )
            "arrayValue" -> buildJsonArray {
                (value.jsonObject["values"] as? kotlinx.serialization.json.JsonArray)
                    ?.forEach { add(firestoreToPlain(it)) }
            }
            else -> element
        }
    }


    private fun plainToFirestore(element: kotlinx.serialization.json.JsonElement): kotlinx.serialization.json.JsonElement = when (element) {
        is JsonObject -> buildJsonObject {
            put("mapValue", buildJsonObject {
                put("fields", buildJsonObject {
                    element.forEach { (k, v) -> put(k, plainToFirestore(v)) }
                })
            })
        }
        is kotlinx.serialization.json.JsonArray -> buildJsonObject {
            put("arrayValue", buildJsonObject {
                put("values", buildJsonArray {
                    element.forEach { add(plainToFirestore(it)) }
                })
            })
        }
        is JsonNull -> buildJsonObject { put("nullValue", JsonNull) }
        is JsonPrimitive -> when {
            element.isString -> buildJsonObject { put("stringValue", element) }
            element.content == "true" || element.content == "false" ->
                buildJsonObject { put("booleanValue", element) }
            element.content.contains('.') || element.content.contains('e') ||
                element.content.toLongOrNull() == null ->
                buildJsonObject { put("doubleValue", JsonPrimitive(element.content.toDouble())) }
            else -> buildJsonObject { put("integerValue", element) }
        }
    }

    // ------------------------------------------------------------------
    // Wire-shape helpers (native models <-> web codec JSON)
    // ------------------------------------------------------------------

    private fun noteArrayJson(notes: List<Note>) = buildJsonArray {
        notes.forEach { note ->
            val element = json.encodeToJsonElement(Note.serializer(), note).jsonObject
            add(fromEnumColor(element, "color") { name -> noteColorHex(name) })
        }
    }

    private fun habitArrayJson(habits: List<Habit>) = buildJsonArray {
        habits.forEach { habit ->
            val element = json.encodeToJsonElement(Habit.serializer(), habit).jsonObject
            add(fromEnumColor(element, "color") { name -> habitColorHex(name) })
        }
    }

    /** Web TimerState uses `startTime`; running timers never leave the device. */
    private fun toWebTimerJson(timer: TimerState): JsonObject {
        val element = json.encodeToJsonElement(TimerState.serializer(), timer).jsonObject
        val mutable = element.jsonObject.toMutableMap()
        mutable.remove("startedAt")
        if (timer.startedAt != null) mutable["startTime"] = JsonPrimitive(timer.startedAt)
        return JsonObject(mutable)
    }

    private fun fromWebTimerJson(fields: JsonObject): JsonObject {
        val mutable = fields.toMutableMap()
        val startTime = mutable.remove("startTime")
        if (startTime != null) mutable["startedAt"] = startTime
        mutable["isActive"] = JsonPrimitive(false)
        mutable.remove("startTime")
        return JsonObject(mutable)
    }

    /** Enum-valued color field -> hex string for the web wire format. */
    private fun fromEnumColor(
        element: JsonObject,
        field: String,
        toHex: (String) -> String?,
    ): JsonObject {
        val mutable = element.toMutableMap()
        val color = mutable[field]?.jsonPrimitive?.content
        val hex = color?.let(toHex)
        if (hex != null) mutable[field] = JsonPrimitive(hex)
        return JsonObject(mutable)
    }

    /** Hex string color field -> enum name for native decoding. */
    private fun toEnumColor(
        element: JsonObject,
        field: String,
        toName: (String) -> String?,
    ): JsonObject {
        val mutable = element.toMutableMap()
        val hex = mutable[field]?.jsonPrimitive?.content
        val name = hex?.let(toName)
        if (name != null) mutable[field] = JsonPrimitive(name)
        return JsonObject(mutable)
    }

    private fun habitColorHex(name: String): String? =
        runCatching { HabitColor.valueOf(name).hex }.getOrNull()

    private fun habitColorName(hex: String): String? =
        HabitColor.entries.firstOrNull { it.hex.equals(hex, ignoreCase = true) }?.name

    private fun noteColorHex(name: String): String? =
        runCatching { NoteColor.valueOf(name).hex }.getOrNull()

    private fun noteColorName(hex: String): String? =
        NoteColor.entries.firstOrNull { it.hex.equals(hex, ignoreCase = true) }?.name

    // ------------------------------------------------------------------
    // Firestore REST plumbing
    // ------------------------------------------------------------------

    private fun documentPath(uid: String, collection: String, id: String): String =
        "https://firestore.googleapis.com/v1/projects/${FirebaseProjectConfig.projectId}" +
            "/databases/(default)/documents/users/$uid/$collection/$id"

    private fun JsonObject.stringValueOrNull(name: String): String =
        (this[name] as? kotlinx.serialization.json.JsonPrimitive)?.content ?: ""

    private fun JsonObject.arrayOrNull(name: String): kotlinx.serialization.json.JsonArray? =
        this[name] as? kotlinx.serialization.json.JsonArray

    /** Accepts both the web's server timestamps (ISO) and our integers.
     *  Runs against the RAW typed fields, before plain conversion. */
    private fun typedUpdatedAtMillis(raw: JsonObject): Long? {
        val field = raw["updatedAt"]?.jsonObject ?: return null
        field["integerValue"]?.jsonPrimitive?.content?.toLongOrNull()?.let { return it }
        val iso = field["timestampValue"]?.jsonPrimitive?.content ?: return null
        return runCatching { Instant.parse(iso).toEpochMilliseconds() }.getOrNull()
    }

    // ------------------------------------------------------------------
    // Per-doc sync state (what we last saw on each side)
    // ------------------------------------------------------------------

    @Serializable
    private data class DocState(val updatedAt: Long = 0L, val payload: String = "")

    @Serializable
    private data class SyncState(val docs: Map<String, DocState> = emptyMap())

    private fun readState(): SyncState =
        PlatformStorage.readString(STATE_FILE)
            ?.takeIf { it.isNotBlank() }
            ?.let { runCatching { json.decodeFromString<SyncState>(it) }.getOrNull() }
            ?: SyncState()

    private fun writeDocState(key: String, docState: DocState) {
        val updated = readState().docs + (key to docState)
        PlatformStorage.writeString(STATE_FILE, json.encodeToString(SyncState(updated)))
    }

    private fun now(): Long = app.todotxt.platform.nowMillis()

    private fun JsonObject.requiredString(name: String): String =
        this[name]?.jsonPrimitive?.content ?: error("Firebase response missing $name")
}

sealed interface AccountSyncStatus {
    data object Disabled : AccountSyncStatus
    data object SignedOut : AccountSyncStatus
    data object Connecting : AccountSyncStatus
    data class Synced(val email: String) : AccountSyncStatus
    data class WaitingForNetwork(val message: String) : AccountSyncStatus
    data class Error(val message: String) : AccountSyncStatus
}

@Serializable
private data class Session(
    val localId: String,
    val idToken: String,
    val refreshToken: String,
    val expiresAt: Long,
    val email: String = "",
)
