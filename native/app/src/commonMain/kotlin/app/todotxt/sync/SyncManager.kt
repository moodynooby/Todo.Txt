package app.todotxt.sync

/**
 * Compatibility facade for existing callers. FirebaseSyncManager owns the
 * durable anonymous authentication, offline persistence, retry loop, and
 * Firestore transport.
 */
object SyncManager {
    fun configure(groupId: String) {
        FirebaseSyncManager.setSyncGroupId(groupId)
        FirebaseSyncManager.start()
    }

    fun triggerSync() {
        FirebaseSyncManager.start()
    }
}
