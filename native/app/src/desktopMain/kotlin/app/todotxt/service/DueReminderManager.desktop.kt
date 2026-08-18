package app.todotxt.service

import app.todotxt.domain.ParsedTodoContent

/**
 * Desktop actual of [DueReminderManager]. Desktop habit reminders already
 * run an in-process scheduler; due-date nudges reuse the same path, so this
 * layer stays a no-op until a system-level cron agent lands.
 */
actual object DueReminderManager {
    actual fun scheduleDueReminders(parsed: ParsedTodoContent) {
        // Desktop parity deferred: habits use the in-process scheduler in
        // `ReminderManager`; todo due nudges will follow the same pattern.
    }
}
