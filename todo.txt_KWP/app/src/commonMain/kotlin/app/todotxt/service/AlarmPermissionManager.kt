package app.todotxt.service

import androidx.compose.runtime.Composable
import androidx.compose.runtime.State

/**
 * Common interface for exact-alarm permission management. On Android 13+,
 * apps need an explicit grant to schedule exact alarms (for habit/due
 * reminders). This manager provides checks and an intent to open OS settings.
 */
expect object AlarmPermissionManager {
    /** Returns true if exact alarms are allowed on this platform. */
    fun canScheduleExactAlarms(): Boolean

    /** Returns true if the platform requires a runtime grant for exact alarms. */
    fun requiresExactAlarmGrant(): Boolean

    /** Opens the OS settings screen where the user can grant the permission. */
    fun openExactAlarmSettings()

    /** Returns a reactive state of the current permission status. */
    @Composable
    fun rememberPermissionStatus(): State<Boolean>
}
