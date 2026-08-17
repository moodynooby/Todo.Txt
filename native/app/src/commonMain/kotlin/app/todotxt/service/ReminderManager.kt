package app.todotxt.service

import app.todotxt.domain.Habit

/**
 * Native reminder service — schedules OS-level notifications for habits.
 * Mirrors the web Service Worker / Push API behavior but with native reliability.
 */
expect object ReminderManager {
    fun scheduleReminders(habits: List<Habit>)
    fun showImmediateNotification(title: String, message: String)
}
