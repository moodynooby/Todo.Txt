package app.todotxt.persistence

import app.todotxt.domain.Drawing
import app.todotxt.domain.Habit
import app.todotxt.domain.Note
import app.todotxt.domain.TimerState
import kotlinx.coroutines.CoroutineScope
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.Job
import kotlinx.coroutines.SupervisorJob
import kotlinx.coroutines.delay
import kotlinx.coroutines.launch
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.serialization.Serializable
import kotlinx.serialization.encodeToString
import kotlinx.serialization.json.Json

/**
 * Local recovery protection for the native app.
 *
 * Firebase is a relay, not the only copy of the user's data. This manager keeps
 * three rotating, checksummed snapshots in platform-private storage. A failed
 * Firebase request therefore leaves the local state and the last known-good
 * snapshots available for recovery.
 */
object BackupManager {
    private const val SLOT_COUNT = 3
    private const val SLOT_POINTER_FILE = "local_backup_next_slot.txt"
    private const val SLOT_PREFIX = "local_backup_"
    private const val SLOT_SUFFIX = ".json"
    private const val BACKUP_VERSION = 1

    private val json = Json {
        ignoreUnknownKeys = true
        encodeDefaults = true
        explicitNulls = false
    }
    private val scope = CoroutineScope(SupervisorJob() + Dispatchers.Default)
    private var pendingJob: Job? = null

    private val _portableStatus = MutableStateFlow<PortableBackupStatus>(PortableBackupStatus.Idle)
    val portableStatus: StateFlow<PortableBackupStatus> = _portableStatus.asStateFlow()

    /** Debounce bursts of local writes into one durable snapshot. */
    fun schedule(reason: String) {
        pendingJob?.cancel()
        pendingJob = scope.launch {
            delay(300)
            createNow(reason)
        }
    }

    fun createNow(reason: String = "manual") {
        val snapshot = captureLocal()
        val snapshotPayload = json.encodeToString(snapshot)
        val envelope = BackupEnvelope(
            version = BACKUP_VERSION,
            savedAt = snapshot.savedAt,
            reason = reason,
            checksum = checksum(snapshotPayload),
            snapshot = snapshot,
        )

        val slot = (PlatformStorage.readString(SLOT_POINTER_FILE)?.toIntOrNull() ?: 0)
            .mod(SLOT_COUNT)
        PlatformStorage.writeString(slotName(slot), json.encodeToString(envelope))
        PlatformStorage.writeString(SLOT_POINTER_FILE, ((slot + 1) % SLOT_COUNT).toString())
    }

    /**
     * Restores the newest valid snapshot only when startup detected local-file
     * corruption or loss. Normal Firebase failures never overwrite good local
     * state with an older backup.
     */
    fun restoreLatestIfAvailable(): Boolean {
        val envelope = (0 until SLOT_COUNT)
            .mapNotNull { readEnvelope(it) }
            .maxByOrNull { it.savedAt }
            ?: return false

        Storage.restoreFromBackup(envelope.snapshot)
        return true
    }

    fun hasValidBackup(): Boolean = (0 until SLOT_COUNT).any { readEnvelope(it) != null }

    fun exportPortablePayload(): String {
        val snapshot = captureLocal()
        return json.encodeToString(
            PortableBackupDocument(
                version = BACKUP_VERSION,
                exportedAt = snapshot.savedAt,
                snapshot = snapshot,
            ),
        )
    }

    fun restorePortablePayload(payload: String): Boolean = runCatching {
        val document = json.decodeFromString<PortableBackupDocument>(payload)
        require(document.version == BACKUP_VERSION) { "Unsupported backup version" }
        createNow("before_portable_restore")
        Storage.restoreFromBackup(document.snapshot)
        schedule("after_portable_restore")
        true
    }.getOrElse { false }

    internal fun setPortableStatus(status: PortableBackupStatus) {
        _portableStatus.value = status
    }

    /**
     * Capture every persisted workspace into the shared snapshot bag. This is
     * the single construction point for full-app snapshots — cloud sync and
     * local/portable backups stamp their own timestamp field on top.
     */
    fun capture(savedAt: Long = 0L, updatedAt: Long = 0L): FullSnapshot = FullSnapshot(
        savedAt = savedAt,
        updatedAt = updatedAt,
        content = Storage.content.value,
        notes = Storage.notes.value,
        habits = Storage.habits.value,
        timers = Storage.timers.value,
        settings = Storage.settings.value,
        drawings = Storage.drawings.value,
    )

    /** Local-backup flavor: stamps [FullSnapshot.savedAt]. */
    fun captureLocal(): FullSnapshot = capture(savedAt = app.todotxt.platform.nowMillis())

    private fun readEnvelope(slot: Int): BackupEnvelope? = runCatching {
        val raw = PlatformStorage.readString(slotName(slot))?.takeIf { it.isNotBlank() }
            ?: return null
        val envelope = json.decodeFromString<BackupEnvelope>(raw)
        if (envelope.version != BACKUP_VERSION) return null
        val payload = json.encodeToString(envelope.snapshot)
        if (checksum(payload) != envelope.checksum) return null
        envelope
    }.getOrNull()

    private fun slotName(slot: Int): String = "$SLOT_PREFIX$slot$SLOT_SUFFIX"

    /** Small deterministic corruption check that requires no platform crypto API. */
    private fun checksum(value: String): String {
        var hash = -3750763034362895579L
        value.encodeToByteArray().forEach { byte ->
            hash = hash xor (byte.toLong() and 0xffL)
            hash *= 1099511628211L
        }
        return hash.toString(16)
    }
}

/**
 * Every workspace in one serializable bag — the payload of local rotating
 * backups, portable backups, and Firestore cloud snapshots alike (the former
 * `BackupSnapshot` / private `SyncSnapshot` pair merged).
 *
 * Timestamp compat: cloud snapshots historically serialize `updatedAt`,
 * backup files `savedAt`. Both remain — exactly one is meaningful per
 * producer, the other decodes as 0 — so payloads written by older releases
 * keep parsing on either wire.
 */
@Serializable
data class FullSnapshot(
    val savedAt: Long = 0L,
    val updatedAt: Long = 0L,
    val content: String,
    val notes: List<Note> = emptyList(),
    val habits: List<Habit> = emptyList(),
    val timers: List<TimerState> = emptyList(),
    val settings: AppSettings = AppSettings(),
    val drawings: List<Drawing> = emptyList(),
)

@Serializable
data class PortableBackupDocument(
    val version: Int,
    val exportedAt: Long,
    val snapshot: FullSnapshot,
)

sealed interface PortableBackupStatus {
    data object Idle : PortableBackupStatus
    data object Exporting : PortableBackupStatus
    data object Importing : PortableBackupStatus
    data object Completed : PortableBackupStatus
    data class Failed(val message: String) : PortableBackupStatus
}

@Serializable
private data class BackupEnvelope(
    val version: Int,
    val savedAt: Long,
    val reason: String,
    val checksum: String,
    val snapshot: FullSnapshot,
)
