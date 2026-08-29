package app.todotxt.service

import android.app.AlarmManager
import android.app.NotificationChannel
import android.app.NotificationManager
import android.app.PendingIntent
import android.content.BroadcastReceiver
import android.content.Context
import android.content.Intent
import android.os.Build
import androidx.core.app.NotificationCompat
import android.appwidget.AppWidgetManager
import android.content.ComponentName
import kotlinx.coroutines.CoroutineScope
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.launch
import app.todotxt.TodoTxtApp
import app.todotxt.domain.Habit
import app.todotxt.domain.Task
import app.todotxt.domain.TodoParser
import app.todotxt.persistence.Storage
import java.time.LocalDate
import java.time.LocalDateTime
import java.time.LocalTime
import java.time.ZoneId

actual object ReminderManager {
    private const val CHANNEL_ID = "habit_reminders"
    private val context: Context get() = TodoTxtApp.instance

    actual fun scheduleReminders(habits: List<Habit>) {
        val alarmManager = context.getSystemService(Context.ALARM_SERVICE) as AlarmManager
        
        habits.filter { it.reminderEnabled && !it.archived }.forEach { habit ->
            val intent = Intent(context, HabitAlarmReceiver::class.java).apply {
                putExtra("habit_name", habit.name)
                putExtra("habit_id", habit.id)
            }
            val pendingIntent = PendingIntent.getBroadcast(
                context,
                habit.id.hashCode(),
                intent,
                PendingIntent.FLAG_UPDATE_CURRENT or PendingIntent.FLAG_IMMUTABLE
            )

            val targetTime = runCatching { LocalTime.parse(habit.reminderTime) }.getOrDefault(LocalTime.of(9, 0))
            var targetDateTime = LocalDateTime.of(LocalDate.now(), targetTime)
            if (targetDateTime.isBefore(LocalDateTime.now())) {
                targetDateTime = targetDateTime.plusDays(1)
            }

            val triggerAtMillis = targetDateTime.atZone(ZoneId.systemDefault()).toInstant().toEpochMilli()

            if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.S) {
                if (alarmManager.canScheduleExactAlarms()) {
                    alarmManager.setExactAndAllowWhileIdle(
                        AlarmManager.RTC_WAKEUP,
                        triggerAtMillis,
                        pendingIntent
                    )
                } else {
                    alarmManager.setAndAllowWhileIdle(
                        AlarmManager.RTC_WAKEUP,
                        triggerAtMillis,
                        pendingIntent
                    )
                }
            } else {
                alarmManager.setExactAndAllowWhileIdle(
                    AlarmManager.RTC_WAKEUP,
                    triggerAtMillis,
                    pendingIntent
                )
            }
        }
    }

    actual fun showImmediateNotification(title: String, message: String) {
        val notificationManager = context.getSystemService(Context.NOTIFICATION_SERVICE) as NotificationManager
        
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            val channel = NotificationChannel(CHANNEL_ID, "Habit Reminders", NotificationManager.IMPORTANCE_HIGH)
            notificationManager.createNotificationChannel(channel)
        }

        // Notification actions mirror the web's registerActionTypeS:
        // habit-action {mark-done, snooze-30m, snooze-1h},
        // todo-action  {mark-done, snooze-1h}.
        val requestId = (title + message).hashCode()
        val builder = NotificationCompat.Builder(context, CHANNEL_ID)
            .setSmallIcon(android.R.drawable.ic_lock_idle_alarm)
            .setContentTitle(title)
            .setContentText(message)
            .setPriority(NotificationCompat.PRIORITY_HIGH)
            .setAutoCancel(true)
        val habits = intentExtras.get()
        if (habits != null && habits.startsWith("habit:") && habits.contains("id=")) {
            val habitId = habits.substringAfter("id=").substringBefore(",")
            builder.addAction(markDoneAction(context, habitId, requestId))
            builder.addAction(snoozeAction(context, habitId, requestId, 30))
            builder.addAction(snoozeAction(context, habitId, requestId, 60))
        } else if (habits != null && habits.startsWith("todo:") && habits.contains("id=")) {
            val taskIds = habits.substringAfter("id=").substringBefore(",")
            builder.addAction(markDoneTodoAction(context, taskIds, requestId))
            builder.addAction(snoozeTodoAction(context, taskIds, requestId, 60))
        }
        notificationManager.notify(System.currentTimeMillis().toInt(), builder.build())
    }

    private fun actionIntent(
        context: Context,
        action: String,
        requestCode: Int,
        extras: Map<String, Any?> = emptyMap(),
    ): PendingIntent {
        val intent = Intent(context, NotificationActionReceiver::class.java).apply {
            this.action = action
            for ((key, value) in extras) {
                when (value) {
                    is String -> putExtra(key, value)
                    is Int -> putExtra(key, value)
                }
            }
        }
        return PendingIntent.getBroadcast(
            context,
            requestCode,
            intent,
            PendingIntent.FLAG_UPDATE_CURRENT or PendingIntent.FLAG_IMMUTABLE,
        )
    }

    private fun markDoneAction(context: Context, habitId: String, requestId: Int) =
        NotificationCompat.Action.Builder(
            android.R.drawable.ic_menu_edit,
            "Mark done",
            actionIntent(context, NotificationActions.ACTION_HABIT_MARK_DONE, requestId,
                mapOf("habit_id" to habitId)),
        ).build()

    private fun snoozeAction(context: Context, habitId: String, requestId: Int, minutes: Int) =
        NotificationCompat.Action.Builder(
            android.R.drawable.ic_menu_recent_history,
            if (minutes >= 60) "Snooze 1h" else "Snooze 30m",
            actionIntent(context, NotificationActions.ACTION_HABIT_SNOOZE, requestId + 100_000,
                mapOf("habit_id" to habitId, "snooze_minutes" to minutes)),
        ).build()

    private fun markDoneTodoAction(context: Context, taskIds: String, requestId: Int) =
        NotificationCompat.Action.Builder(
            android.R.drawable.ic_menu_edit,
            "Mark done",
            actionIntent(context, NotificationActions.ACTION_TODO_MARK_DONE, requestId + 200_000,
                mapOf("task_ids" to taskIds)),
        ).build()

    private fun snoozeTodoAction(context: Context, taskIds: String, requestId: Int, minutes: Int) =
        NotificationCompat.Action.Builder(
            android.R.drawable.ic_menu_recent_history,
            "Snooze 1h",
            actionIntent(context, NotificationActions.ACTION_TODO_SNOOZE, requestId + 300_000,
                mapOf("task_ids" to taskIds, "snooze_minutes" to minutes)),
        ).build()
}

object NotificationActions {
    const val ACTION_HABIT_MARK_DONE = "app.todotxt.NOTIFICATION_HABIT_MARK_DONE"
    const val ACTION_HABIT_SNOOZE = "app.todotxt.NOTIFICATION_HABIT_SNOOZE"
    const val ACTION_TODO_MARK_DONE = "app.todotxt.NOTIFICATION_TODO_MARK_DONE"
    const val ACTION_TODO_SNOOZE = "app.todotxt.NOTIFICATION_TODO_SNOOZE"
}

/** Mutable extras bridge: set before showImmediateNotification from a receiver. */
var intentExtras: ThreadLocal<String?> = ThreadLocal.withInitial { null }

/**
 * Handles notification action buttons while the app is closed. "Mark done"
 * logs today's habit completion / completes the todo line and re-arms the
 * next alarm; snooze re-arms the alarm after the chosen minutes.
 */
class NotificationActionReceiver : BroadcastReceiver() {
    private var receiverContext: Context? = null

    override fun onReceive(context: Context, intent: Intent) {
        receiverContext = context.applicationContext
        when (intent.action) {
            NotificationActions.ACTION_HABIT_MARK_DONE -> markHabitDone(intent)
            NotificationActions.ACTION_HABIT_SNOOZE -> snoozeHabit(intent)
            NotificationActions.ACTION_TODO_MARK_DONE -> markTodoDone(intent)
            NotificationActions.ACTION_TODO_SNOOZE -> snoozeTodo(intent)
        }
        refreshWidgets(context)
    }

    private val context: Context
        get() = receiverContext ?: TodoTxtApp.instance

    private fun markHabitDone(intent: Intent) {
        val habitId = intent.getStringExtra("habit_id").orEmpty()
        if (habitId.isEmpty()) return
        val today = LocalDate.now().toString()
        Storage.updateHabits { habits ->
            habits.map { habit ->
                if (habit.id == habitId) {
                    val alreadyDone = habit.completedDates.any { it == today }
                    if (alreadyDone) habit else {
                        habit.copy(completedDates = habit.completedDates + today)
                    }
                } else habit
            }
        }
    }

    private fun snoozeHabit(intent: Intent) {
        val habitId = intent.getStringExtra("habit_id").orEmpty()
        val minutes = intent.getIntExtra("snooze_minutes", 30)
        if (habitId.isEmpty()) return
        val snoozedAt = LocalDateTime.now().plusMinutes(minutes.toLong())
        val snoozedTime = "${snoozedAt.hour}:${snoozedAt.minute.toString().padStart(2, '0')}"
        Storage.updateHabits { habits ->
            habits.map { habit ->
                if (habit.id == habitId) habit.copy(reminderTime = snoozedTime) else habit
            }
        }
    }

    private fun markTodoDone(intent: Intent) {
        val taskIds = intent.getStringExtra("task_ids").orEmpty().split(",").filter { it.isNotBlank() }
        if (taskIds.isEmpty()) return
        val parser = TodoParser
        val content = Storage.content.value
        var updated = content
        val snapshot = parser.parseTodoContent(content)
        for (taskId in taskIds) {
            val numeric = taskId.toIntOrNull() ?: continue
            val task = snapshot.tasks.firstOrNull { it.id == numeric } ?: continue
            updated = parser.setTaskCompleted(updated, task, true)
        }
        if (updated != content) Storage.setContent(updated)
    }

    private fun snoozeTodo(intent: Intent) {
        val taskIds = intent.getStringExtra("task_ids").orEmpty().split(",").filter { it.isNotBlank() }
        val minutes = intent.getIntExtra("snooze_minutes", 60)
        if (taskIds.isEmpty()) return
        val ctx = context
        val alarmManager = ctx.getSystemService(Context.ALARM_SERVICE) as AlarmManager
        val trigger = LocalDateTime.now().plusMinutes(minutes.toLong())
        val triggerMillis = trigger.atZone(ZoneId.systemDefault()).toInstant().toEpochMilli()
        // Re-arm the same DueAlarmReceiver snapshot intent so the reminder
        // fires once more after the snooze window.
        val now = intent.getStringExtra("snapshot").orEmpty()
        val due = intent.getStringExtra("due").orEmpty()
        val receiverIntent = Intent(ctx, DueAlarmReceiver::class.java).apply {
            putExtra("snapshot", now)
            putExtra("due", due)
            putExtra("snoozed", true)
        }
        val pi = PendingIntent.getBroadcast(
            ctx,
            (now + due).hashCode(),
            receiverIntent,
            PendingIntent.FLAG_UPDATE_CURRENT or PendingIntent.FLAG_IMMUTABLE,
        )
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.S) {
            if (alarmManager.canScheduleExactAlarms()) {
                alarmManager.setExactAndAllowWhileIdle(AlarmManager.RTC_WAKEUP, triggerMillis, pi)
            } else {
                alarmManager.setAndAllowWhileIdle(AlarmManager.RTC_WAKEUP, triggerMillis, pi)
            }
        } else {
            alarmManager.setExactAndAllowWhileIdle(AlarmManager.RTC_WAKEUP, triggerMillis, pi)
        }
    }

    private fun refreshWidgets(context: Context) {
        // Delegate to the single widget refresh path.
        CoroutineScope(Dispatchers.Default).launch {
            app.todotxt.widget.WidgetRefresher.refreshAll(context)
        }
    }
}

class HabitAlarmReceiver : BroadcastReceiver() {
    override fun onReceive(context: Context, intent: Intent) {
        val habitName = intent.getStringExtra("habit_name") ?: "Habit"
        val habitId = intent.getStringExtra("habit_id").orEmpty()
        intentExtras.set(if (habitId.isNotEmpty()) "habit:id=$habitId,name=$habitName" else null)
        ReminderManager.showImmediateNotification("Habit Reminder", "Time for your habit: $habitName")
    }
}
