package net.todotxt.app.plugins.exactalarms

import android.content.BroadcastReceiver
import android.content.Context
import android.content.Intent
import net.todotxt.app.MainActivity

/**
 * Receives notification action button presses (Mark done / Snooze) from
 * exact-alarm reminders.
 *
 * Mirrors the notification plugin's action handling so both scheduling
 * paths feed the same JS reducer logic:
 *  1. Persists the action payload to `native_pending_actions` in the app's
 *     SharedPreferences — the same queue `nativeReminders.ts` drains at
 *     startup — so cold-starting webviews still consume the action.
 *  2. If the webview is live, dispatches the `native-reminder-action`
 *     CustomEvent exactly as the notification plugin would.
 *  3. Snooze actions re-schedule the alarm for the snoozed time.
 */
class ActionReceiver : BroadcastReceiver() {

    override fun onReceive(context: Context, intent: Intent) {
        val payload = intent.getStringExtra(EXTRA_PAYLOAD) ?: return
        val actionId = intent.getStringExtra(EXTRA_ACTION_ID) ?: return
        val prefs = context.getSharedPreferences(PENDING_ACTIONS_KEY, Context.MODE_PRIVATE)

        if (actionId == "mark-done" || actionId.startsWith("snooze-")) {
            // Snooze must also re-schedule; mark-done lets the JS side clear
            // the reminder schedule on its own (same as notification actions).
            if (actionId.startsWith("snooze-")) {
                val minutes = actionId.removePrefix("snooze-").toIntOrNull() ?: 30
                val id = extractId(payload)
                if (id != null) {
                    // ExactAlarmsPlugin access happens through the plugin
                    // runtime; schedule via a direct PendingIntent-based
                    // fallback here to avoid coupling receivers to the plugin.
                    rescheduleSnooze(context, id, minutes)
                }
            }
            // Queue the payload exactly like the notification plugin does.
            prefs.edit().putString(KEY_PAYLOAD, payload).apply()
        }

        // Surface the action to a live webview via MainActivity's listener.
        val liveIntent = Intent(context, MainActivity::class.java).apply {
            addFlags(
                Intent.FLAG_ACTIVITY_NEW_TASK or
                    Intent.FLAG_ACTIVITY_SINGLE_TOP,
            )
            putExtra(EXTRA_PAYLOAD, payload)
            putExtra(EXTRA_ACTION_ID, actionId)
        }
        context.startActivity(liveIntent)
    }

    private fun extractId(payload: String): String? {
        // Minimal extraction; payloads are {"kind":"...","id":"<id>",...}
        val start = payload.indexOf("\"id\":\"") + 6
        if (start < 6) return null
        val end = payload.indexOf('"', start)
        if (end < 0) return null
        return payload.substring(start, end)
    }

    private fun rescheduleSnooze(context: Context, id: String, minutes: Int) {
        Thread {
            try {
                val store = PendingAlarmStore(context.applicationContext)
                val alarm = store.find(id) ?: return@Thread
                store.delete(id)
                val alarmManager =
                    context.getSystemService(Context.ALARM_SERVICE) as android.app.AlarmManager
                val intent = Intent(context, AlarmAlarmReceiver::class.java).apply {
                    action = AlarmAlarmReceiver.ACTION_FIRE
                    putExtra(AlarmAlarmReceiver.EXTRA_ALARM_ID, id)
                }
                val flags =
                    android.app.PendingIntent.FLAG_UPDATE_CURRENT or
                        android.app.PendingIntent.FLAG_IMMUTABLE
                val pending = android.app.PendingIntent.getBroadcast(
                    context.applicationContext, id.hashCode(), intent, flags,
                )
                alarmManager.cancel(pending)
                val snoozed = alarm.copy(epochMs = System.currentTimeMillis() + minutes * 60_000L)
                store.upsert(snoozed)
                val exactAvailable =
                    android.os.Build.VERSION.SDK_INT < 31 ||
                        alarmManager.canScheduleExactAlarms()
                if (exactAvailable) {
                    alarmManager.setExactAndAllowWhileIdle(
                        android.app.AlarmManager.RTC_WAKEUP, snoozed.epochMs, pending,
                    )
                } else {
                    alarmManager.setAndAllowWhileIdle(
                        android.app.AlarmManager.RTC_WAKEUP, snoozed.epochMs, pending,
                    )
                }
            } catch (error: Throwable) {
                android.util.Log.e("ExactAlarms", "Snooze reschedule failed", error)
            }
        }.start()
    }

    companion object {
        const val EXTRA_PAYLOAD = "payload"
        const val EXTRA_ACTION_ID = "actionId"
        internal const val PENDING_ACTIONS_KEY = "native_pending_actions"
        private const val KEY_PAYLOAD = "payload"
    }
}
