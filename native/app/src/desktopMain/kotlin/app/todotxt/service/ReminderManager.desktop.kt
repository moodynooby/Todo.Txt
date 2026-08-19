package app.todotxt.service

import app.todotxt.domain.Habit
import java.awt.*
import java.time.LocalTime
import java.util.concurrent.Executors
import java.util.concurrent.TimeUnit

actual object ReminderManager {
    private val scheduler = Executors.newSingleThreadScheduledExecutor()

    actual fun scheduleReminders(habits: List<Habit>) {
        // In a real desktop app, we'd use a system-level cron or background agent.
        // For this experiment, we'll run a simple in-process scheduler.
        scheduler.shutdownNow()
        val newScheduler = Executors.newSingleThreadScheduledExecutor()
        
        habits.filter { it.reminderEnabled && !it.archived }.forEach { habit ->
            val now = LocalTime.now()
            val target = runCatching { LocalTime.parse(habit.reminderTime) }.getOrDefault(LocalTime.of(9, 0))
            
            var delayMinutes = (target.toSecondOfDay() - now.toSecondOfDay()) / 60
            if (delayMinutes < 0) delayMinutes += 24 * 60
            
            newScheduler.schedule({
                showImmediateNotification("Habit Reminder", "Time for your habit: ${habit.name}")
            }, delayMinutes.toLong(), TimeUnit.MINUTES)
        }
    }

    actual fun showImmediateNotification(title: String, message: String) {
        if (!SystemTray.isSupported()) return
        
        val tray = SystemTray.getSystemTray()
        val image = Toolkit.getDefaultToolkit().createImage("") // Placeholder
        val trayIcon = TrayIcon(image, "Todo.Txt")
        trayIcon.isImageAutoSize = true
        
        try {
            tray.add(trayIcon)
            trayIcon.displayMessage(title, message, TrayIcon.MessageType.INFO)
            // Remove after showing to avoid cluttering the tray
            scheduler.schedule({ tray.remove(trayIcon) }, 10, TimeUnit.SECONDS)
        } catch (e: Exception) {
            e.printStackTrace()
        }
    }
}
