package app.todotxt.service

import android.app.AlarmManager
import android.content.Context
import android.content.Intent
import android.net.Uri
import android.os.Build
import android.provider.Settings
import androidx.compose.runtime.Composable
import androidx.compose.runtime.State
import androidx.compose.runtime.derivedStateOf
import androidx.compose.runtime.remember
import app.todotxt.TodoTxtApp

actual object AlarmPermissionManager {
    actual fun canScheduleExactAlarms(): Boolean {
        if (Build.VERSION.SDK_INT < Build.VERSION_CODES.S) return true // Pre-Android 12, always allowed
        val am = getAlarmManager() ?: return false
        return am.canScheduleExactAlarms()
    }

    actual fun requiresExactAlarmGrant(): Boolean {
        return Build.VERSION.SDK_INT >= Build.VERSION_CODES.S && !canScheduleExactAlarms()
    }

    actual fun openExactAlarmSettings() {
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.S) {
            val intent = Intent(Settings.ACTION_REQUEST_SCHEDULE_EXACT_ALARM).apply {
                data = Uri.fromParts("package", TodoTxtApp.instance.packageName, null)
                addFlags(Intent.FLAG_ACTIVITY_NEW_TASK)
            }
            TodoTxtApp.instance.startActivity(intent)
        }
    }

    @Composable
    actual fun rememberPermissionStatus(): State<Boolean> {
        return remember { derivedStateOf { canScheduleExactAlarms() } }
    }

    private fun getAlarmManager(): AlarmManager? =
        TodoTxtApp.instance.getSystemService(Context.ALARM_SERVICE) as? AlarmManager
}
