@file:OptIn(kotlin.js.ExperimentalWasmJsInterop::class)

package app.todotxt.service

import androidx.compose.runtime.Composable
import androidx.compose.runtime.State
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import app.todotxt.core.Habit
import app.todotxt.core.ParsedTodoContent
import kotlinx.datetime.LocalDate
import kotlin.js.js

private fun browserNotificationsAvailable(): Boolean =
    js("typeof Notification !== 'undefined'")

private fun browserNotificationPermission(): String =
    js("typeof Notification !== 'undefined' ? Notification.permission : 'denied'")

private fun notificationsAllowed(): Boolean = browserNotificationPermission() == "granted"

private fun requestBrowserNotificationPermission(): Unit = js(
    """{
        if (typeof Notification !== 'undefined' && Notification.permission === 'default') {
            Notification.requestPermission();
        }
    }""",
)

private fun notifyBrowser(title: String, message: String): Unit = js(
    """{
        if (typeof Notification !== 'undefined' && Notification.permission === 'granted') {
            new Notification(title, { body: message });
        }
    }""",
)

actual object AlarmPermissionManager {
    actual fun canScheduleExactAlarms(): Boolean = notificationsAllowed()
    actual fun requiresExactAlarmGrant(): Boolean = browserNotificationsAvailable()
    actual fun openExactAlarmSettings() = requestBrowserNotificationPermission()

    @Composable
    actual fun rememberPermissionStatus(): State<Boolean> =
        remember { mutableStateOf(notificationsAllowed()) }
}

actual object DueReminderManager {
    private var lastReminderKey: String? = null

    actual fun scheduleDueReminders(parsed: ParsedTodoContent) {
        val today = runCatching { LocalDate.parse(app.todotxt.core.HabitUtils.today()) }.getOrNull() ?: return
        val dueTasks = parsed.tasks.filter { task ->
            !task.completed && task.due != null && runCatching { LocalDate.parse(task.due!!) <= today }.getOrDefault(false)
        }
        if (dueTasks.isEmpty()) {
            lastReminderKey = null
            return
        }
        val key = dueTasks.joinToString("|") { "${it.raw}:${it.due}" }
        if (key != lastReminderKey) {
            lastReminderKey = key
            notifyBrowser("Tasks due", "${dueTasks.size} task(s) are due today or overdue")
        }
    }
}

actual object ReminderManager {
    actual fun scheduleReminders(habits: List<Habit>) = Unit
    actual fun showImmediateNotification(title: String, message: String) = notifyBrowser(title, message)
}

actual object PlatformDeviceId {
    actual val deviceId: String = "web"
}

actual fun getLocalIpAddress(): String = ""
