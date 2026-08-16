package net.todotxt.app.plugins.exactalarms

/**
 * Persisted representation of a pending reminder alarm.
 *
 * Mirrors the payload sent by `src/lib/nativeReminders.ts` so the JS and
 * native sides share one id convention (`habit_<id>`, `todo-due-today`) and
 * survive reboots through reconciliation.
 */
data class AlarmRecord(
    val id: String,
    val epochMs: Long,
    val title: String,
    val body: String,
    val repeatDaily: Boolean,
    val repeatIntervalMs: Long? = null,
    val channelId: String,
)
