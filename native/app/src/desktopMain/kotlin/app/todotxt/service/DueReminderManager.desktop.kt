package app.todotxt.service

import app.todotxt.domain.ParsedTodoContent
import kotlinx.datetime.LocalDate
import kotlinx.datetime.LocalTime
import kotlinx.datetime.toLocalDateTime
import java.time.LocalTime as JavaLocalTime
import java.util.concurrent.Executors
import java.util.concurrent.TimeUnit

/**
 * Desktop actual of [DueReminderManager]. Mirrors the Android path: incomplete
 * tasks with a `due:` date are grouped by due date (only today or past dates
 * count — the nudge is "tasks due today / overdue"), and one in-process
 * scheduled task fires a single tray notification at 09:00 local.
 *
 * Because desktop reminders are in-process, they only fire while the app is
 * running — for a fully persistent desktop solution this would later be
 * replaced by a system cron / launchd / systemd timer agent.
 */
actual object DueReminderManager {
    private val scheduler = Executors.newSingleThreadScheduledExecutor()

    actual fun scheduleDueReminders(parsed: ParsedTodoContent) {
        scheduler.shutdownNow()
        val newScheduler = Executors.newSingleThreadScheduledExecutor()

        val tz = kotlinx.datetime.TimeZone.currentSystemDefault()
        val today = kotlin.time.Clock.System.now().toLocalDateTime(tz).date

        // Incomplete tasks with a due date on-or-before today (deduped by date).
        val dueDates = parsed.tasks
            .filter { !it.completed && it.due != null }
            .mapNotNull { runCatching { LocalDate.parse(it.due!!) }.getOrNull() }
            .filter { it <= today }
            .toSet()

        if (dueDates.isEmpty()) return

        val count = dueDates.fold(0) { acc, d ->
            acc + parsed.tasks.count { !it.completed && it.due == d.toString() }
        }
        val label = if (dueDates.size == 1 && dueDates.first() == today) "tasks due today" else "overdue / due-today tasks"

        val now = JavaLocalTime.now()
        val target = JavaLocalTime.of(9, 0)
        var delayMinutes = (target.toSecondOfDay() - now.toSecondOfDay()) / 60
        if (delayMinutes < 0) delayMinutes += 24 * 60

        newScheduler.schedule({
            ReminderManager.showImmediateNotification(
                "Tasks Due",
                "You have $count $label in your todo.txt."
            )
        }, delayMinutes.toLong(), TimeUnit.MINUTES)
    }
}
