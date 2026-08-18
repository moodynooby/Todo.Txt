package app.todotxt.service

import app.todotxt.domain.ParsedTodoContent

/**
 * Due-date reminder service — Compose-native port of the web app's
 * `useDueReminders` / `useDueRemindersNative`. Web only nags while the app is
 * open; the native side pushes an OS notification for tasks due today (or
 * overdue) so the nudge survives a closed app. Android schedules a wake-up
 * alarm per unique due date at 9:00 local; desktop runs a simple
 * in-process scheduler mirroring the habit reminder desktop path.
 */
expect object DueReminderManager {
    /**
     * Re-schedules reminders from the currently parsed document. Incomplete
     * tasks with a `due:` date are grouped by due date and one alarm per date
     * fires a single "tasks due today" notification (deduped, like the web
     * snapshot key).
     */
    fun scheduleDueReminders(parsed: ParsedTodoContent)
}
