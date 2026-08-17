package app.todotxt.service

import android.app.NotificationChannel
import android.app.NotificationManager
import android.content.Context
import android.os.Build
import androidx.core.app.NotificationCompat
import androidx.work.*
import app.todotxt.TodoTxtApp
import app.todotxt.domain.Habit
import java.time.Duration
import java.time.LocalTime
import java.util.concurrent.TimeUnit

actual object ReminderManager {
    private const val CHANNEL_ID = "habit_reminders"
    private val context: Context get() = TodoTxtApp.instance

    actual fun scheduleReminders(habits: List<Habit>) {
        val workManager = WorkManager.getInstance(context)
        workManager.cancelAllWorkByTag("habit_reminder")

        habits.filter { it.reminderEnabled && !it.archived }.forEach { habit ->
            val now = LocalTime.now()
            val target = runCatching { LocalTime.parse(habit.reminderTime) }.getOrDefault(LocalTime.of(9, 0))
            
            var delay = Duration.between(now, target)
            if (delay.isNegative) delay = delay.plusDays(1)

            val workRequest = OneTimeWorkRequestBuilder<HabitReminderWorker>()
                .setInitialDelay(delay.toMinutes(), TimeUnit.MINUTES)
                .addTag("habit_reminder")
                .setInputData(workDataOf("habit_name" to habit.name))
                .build()

            workManager.enqueue(workRequest)
        }
    }

    actual fun showImmediateNotification(title: String, message: String) {
        val notificationManager = context.getSystemService(Context.NOTIFICATION_SERVICE) as NotificationManager
        
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            val channel = NotificationChannel(CHANNEL_ID, "Habit Reminders", NotificationManager.IMPORTANCE_DEFAULT)
            notificationManager.createNotificationChannel(channel)
        }

        val notification = NotificationCompat.Builder(context, CHANNEL_ID)
            .setSmallIcon(android.R.drawable.ic_dialog_info)
            .setContentTitle(title)
            .setContentText(message)
            .setPriority(NotificationCompat.PRIORITY_DEFAULT)
            .setAutoCancel(true)
            .build()

        notificationManager.notify(System.currentTimeMillis().toInt(), notification)
    }
}

class HabitReminderWorker(context: Context, params: WorkerParameters) : Worker(context, params) {
    override fun doWork(): Result {
        val habitName = inputData.getString("habit_name") ?: "Habit"
        ReminderManager.showImmediateNotification("Habit Reminder", "Time for your habit: $habitName")
        return Result.success()
    }
}
