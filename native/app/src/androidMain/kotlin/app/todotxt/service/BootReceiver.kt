package app.todotxt.service

import android.content.BroadcastReceiver
import android.content.Context
import android.content.Intent
import app.todotxt.core.TodoParser
import app.todotxt.persistence.Storage

/**
 * Re-arms habit + due-date alarms after a reboot. Alarms do not survive
 * restarts; without this receiver reminders silently die until the app is
 * opened again.
 */
class BootReceiver : BroadcastReceiver() {
    override fun onReceive(context: Context, intent: Intent) {
        if (intent.action != Intent.ACTION_BOOT_COMPLETED) return
        runCatching {
            ReminderManager.scheduleReminders(Storage.habits.value)
            DueReminderManager.scheduleDueReminders(
                TodoParser.parseTodoContent(Storage.content.value),
            )
        }
    }
}
