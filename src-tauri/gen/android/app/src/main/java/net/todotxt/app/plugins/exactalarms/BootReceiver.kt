package net.todotxt.app.plugins.exactalarms

import android.content.BroadcastReceiver
import android.content.Context
import android.content.Intent

/**
 * Re-applies every persisted alarm after the device finishes booting,
 * because Android clears all `AlarmManager` alarms on reboot.
 *
 * The plugin runtime may not be live at BOOT_COMPLETED (no webview, no app
 * process), so this receiver re-posts alarms directly through the
 * `PendingAlarmStore` + `AlarmManager` without requiring the Tauri plugin
 * to be loaded.
 */
class BootReceiver : BroadcastReceiver() {

    override fun onReceive(context: Context, intent: Intent) {
        if (intent.action != Intent.ACTION_BOOT_COMPLETED) return
        Thread {
            try {
                val store = PendingAlarmStore(context.applicationContext)
                val alarmManager =
                    context.getSystemService(Context.ALARM_SERVICE) as android.app.AlarmManager
                val now = System.currentTimeMillis()
                store.all().forEach { alarm ->
                    val trigger = if (alarm.epochMs <= now && alarm.repeatDaily) {
                        alarm.epochMs + android.app.AlarmManager.INTERVAL_DAY
                    } else if (alarm.epochMs <= now) {
                        return@forEach
                    } else {
                        alarm.epochMs
                    }
                    val updated = alarm.copy(epochMs = trigger)
                    store.upsert(updated)
                    val broadcast = Intent(context, AlarmAlarmReceiver::class.java).apply {
                        action = AlarmAlarmReceiver.ACTION_FIRE
                        putExtra(AlarmAlarmReceiver.EXTRA_ALARM_ID, updated.id)
                    }
                    val flags =
                        android.app.PendingIntent.FLAG_UPDATE_CURRENT or
                            android.app.PendingIntent.FLAG_IMMUTABLE
                    val pending = android.app.PendingIntent.getBroadcast(
                        context.applicationContext, updated.id.hashCode(), broadcast, flags,
                    )
                    alarmManager.cancel(pending)
                    val exactAvailable =
                        android.os.Build.VERSION.SDK_INT < 31 ||
                            alarmManager.canScheduleExactAlarms()
                    if (exactAvailable) {
                        alarmManager.setExactAndAllowWhileIdle(
                            android.app.AlarmManager.RTC_WAKEUP, trigger, pending,
                        )
                    } else {
                        alarmManager.setAndAllowWhileIdle(
                            android.app.AlarmManager.RTC_WAKEUP, trigger, pending,
                        )
                    }
                }
            } catch (error: Throwable) {
                android.util.Log.e("ExactAlarms", "Boot re-apply failed", error)
            }
        }.start()
    }
}
