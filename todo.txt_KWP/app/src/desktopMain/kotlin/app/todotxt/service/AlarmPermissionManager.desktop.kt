package app.todotxt.service

import androidx.compose.runtime.Composable
import androidx.compose.runtime.State
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember

actual object AlarmPermissionManager {
    actual fun canScheduleExactAlarms(): Boolean = false // Desktop doesn't use alarms
    actual fun requiresExactAlarmGrant(): Boolean = false
    actual fun openExactAlarmSettings() {}

    @Composable
    actual fun rememberPermissionStatus(): State<Boolean> {
        return remember { mutableStateOf(false) }
    }
}
