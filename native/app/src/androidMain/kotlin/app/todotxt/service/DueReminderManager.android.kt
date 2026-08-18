package app.todotxt.service

import android.app.AlarmManager
import android.app.PendingIntent
import android.content.BroadcastReceiver
import android.content.Context
import android.content.Intent
import android.os.Build
import app.todotxt.TodoTxtApp
import app.todotxt.domain.ParsedTodoContent
import java.time.LocalDate
import java.time.LocalDateTime
import java.time.LocalTime
import java.time.ZoneId

/**
 * Android actual of [DueReminderManager]. Incomplete tasks with a `due:` date
 * are grouped by due date; one wake-up alarm per date fires a single
 * "tasks due today" notification, mirroring the web's
 * `useDueRemindersNative` dedupe behavior (per-content snapshot key).
 */
actual object DueReminderManager {
    private const val DUE_ALARM_TAG = "due_"

    actual fun scheduleDueReminders(parsed: ParsedTodoContent) {
        val context = TodoTxtApp.instance
        val alarmManager = context.getSystemService(Context.ALARM_SERVICE) as AlarmManager
        // Dedupe by the pending-task snapshot so reparses don't restack.
        val dueEntries = parsed.dueDates.entries.filter { (due, tasks) ->
            due.isNotEmpty() && tasks.any { !it.completed }
        }
        for ((due, tasks) in dueEntries) {
            val target = parseDueDate(due) ?: continue
            val trigger = if (target.isBefore(LocalDate.now())) {
                // Overdue — nudge immediately once.
                LocalDateTime.now().plusSeconds(2)
            } else if (target.isEqual(LocalDate.now())) {
                // Due today (still morning) — nudge immediately once; the
                // web app nudges as soon as the app opens with due tasks.
                LocalDateTime.now().plusSeconds(2)
            } else {
                LocalDateTime.of(target, LocalTime.of(9, 0))
            }
            val snapshot = tasks
                .filter { !it.completed }
                .sortedBy { it.id }
                .joinToString(",") { "${it.id}:${it.text}" }
            if (snapshot.isEmpty()) continue
            val requestId = snapshot.hashCode()
            val intent = Intent(context, DueAlarmReceiver::class.java).apply {
                putExtra("snapshot", snapshot)
                putExtra("due", due)
            }
            val pendingIntent = PendingIntent.getBroadcast(
                context,
                requestId,
                intent,
                PendingIntent.FLAG_UPDATE_CURRENT or PendingIntent.FLAG_IMMUTABLE,
            )
            val triggerMillis = trigger.atZone(ZoneId.systemDefault()).toInstant().toEpochMilli()
            if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.S) {
                if (alarmManager.canScheduleExactAlarms()) {
                    alarmManager.setExactAndAllowWhileIdle(
                        AlarmManager.RTC_WAKEUP, triggerMillis, pendingIntent,
                    )
                } else {
                    alarmManager.setAndAllowWhileIdle(
                        AlarmManager.RTC_WAKEUP, triggerMillis, pendingIntent,
                    )
                }
            } else {
                alarmManager.setExactAndAllowWhileIdle(
                    AlarmManager.RTC_WAKEUP, triggerMillis, pendingIntent,
                )
            }
        }
    }

    /** Returns the due date as a [LocalDate] (the T-time part is ignored). */
    private fun parseDueDate(due: String): LocalDate? {
        // The parser normalizes `due:` to YYYY-MM-DD (with optional T-time we
        // ignore for the 9:00 alarm). Anything unparseable is skipped.
        val datePart = due.substringBefore("T")
        return runCatching { LocalDate.parse(datePart) }.getOrNull()
    }
}

/** Wakes up, collects the due tasks, and shows the native nudge. */
class DueAlarmReceiver : BroadcastReceiver() {
    override fun onReceive(context: Context, intent: Intent) {
        val due = intent.getStringExtra("due") ?: "today"
        val snapshot = intent.getStringExtra("snapshot").orEmpty()
        val tasks = snapshot.split(",").filter { it.contains(":") }
        val count = tasks.size
        ReminderManager.showImmediateNotification(
            "Due $due",
            if (count == 1) "You have a task due: ${tasks.first().substringAfter(":")}"
            else "You have $count tasks due — open Todo.Txt to tackle them",
        )
    }
}
