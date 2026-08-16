package net.todotxt.app.plugins.exactalarms

import android.app.AlarmManager
import android.app.PendingIntent
import android.content.BroadcastReceiver
import android.content.Context
import android.content.Intent
import androidx.core.app.NotificationCompat
import androidx.core.app.NotificationManagerCompat

/**
 * Receiver that fires exact-alarm reminders.
 *
 * Responsibilities:
 *  1. Rebuild the reminder notification (reusing the app's channel IDs
 *     `habits` / `todo-due`) and post it via NotificationManager.
 *  2. For daily habits, chain tomorrow's exact alarm before posting, so the
 *     repeat loop survives even if the plugin is never opened again.
 *  3. Run via goAsync() so the OS does not kill the receiver mid-post.
 */
class AlarmAlarmReceiver : BroadcastReceiver() {

    override fun onReceive(context: Context, intent: Intent) {
        val pending = goAsync()
        Thread {
            try {
                val id = intent.getStringExtra(EXTRA_ALARM_ID) ?: return@Thread
                val store = PendingAlarmStore(context.applicationContext)
                val alarm = store.find(id) ?: return@Thread

                postNotification(context, alarm)
                chainNext(context, store, alarm)
            } finally {
                pending.finish()
            }
        }.start()
    }

    private fun postNotification(context: Context, alarm: AlarmRecord) {
        // Notification action intents reuse the app's existing
        // `native-reminder-action` event dispatch: the action receiver below
        // writes the action payload that JS consumes, so notification buttons
        // behave identically to the notification plugin's actions.
        val markDoneIntent = actionIntent(context, alarm, "mark-done")
        val snoozeIntent = actionIntent(context, alarm, "snooze-30")

        val notificationId = Math.abs(alarm.id.hashCode())
        val notification = NotificationCompat.Builder(context, alarm.channelId)
            .setSmallIcon(context.applicationInfo.icon)
            .setContentTitle(alarm.title.ifEmpty { "Todo.Txt" })
            .setContentText(alarm.body)
            .setPriority(NotificationCompat.PRIORITY_HIGH)
            .setAutoCancel(true)
            .apply {
                addAction(
                    NotificationCompat.Action.Builder(
                        0,
                        "Mark done",
                        markDoneIntent,
                    ).build(),
                )
                addAction(
                    NotificationCompat.Action.Builder(
                        0,
                        "Snooze 30m",
                        snoozeIntent,
                    ).build(),
                )
            }
            .build()

        try {
            NotificationManagerCompat.from(context)
                .notify(notificationId, notification)
        } catch (error: SecurityException) {
            // POST_NOTIFICATIONS not granted (Android 13+ runtime perm): the
            // alarm still re-schedules itself, so nothing is silently lost.
            android.util.Log.w("ExactAlarms", "Notification blocked", error)
        }
    }

    private fun actionIntent(
        context: Context,
        alarm: AlarmRecord,
        actionId: String,
    ): PendingIntent {
        val payload = when {
            actionId == "mark-done" -> """{"kind":"mark-done-${kindFor(alarm)}","id":"${escape(alarm.id)}"}"""
            actionId.startsWith("snooze-") -> {
                val minutes = actionId.removePrefix("snooze-").toIntOrNull() ?: 30
                """{"kind":"snooze-${kindFor(alarm)}","id":"${escape(alarm.id)}","minutes":$minutes}"""
            }
            else -> """{"kind":"${kindFor(alarm)}","id":"${escape(alarm.id)}"}"""
        }
        val intent = Intent(context.applicationContext, ActionReceiver::class.java).apply {
            putExtra(ActionReceiver.EXTRA_PAYLOAD, payload)
            putExtra(ActionReceiver.EXTRA_ACTION_ID, actionId)
            addFlags(Intent.FLAG_ACTIVITY_NEW_TASK)
        }
        val flags =
            PendingIntent.FLAG_UPDATE_CURRENT or
                PendingIntent.FLAG_IMMUTABLE
        return PendingIntent.getBroadcast(
            context.applicationContext,
            "${alarm.id}:$actionId".hashCode(),
            intent,
            flags,
        )
    }

    private fun kindFor(alarm: AlarmRecord): String =
        if (alarm.channelId == "todo-due") "todo" else "habit"

    private fun chainNext(context: Context, store: PendingAlarmStore, alarm: AlarmRecord) {
        if (!alarm.repeatDaily) {
            // One-shot: posting consumed it; drop from the store so boot
            // re-apply does not re-fire an already-delivered reminder.
            store.delete(alarm.id)
            return
        }
        val tomorrow = alarm.epochMs + AlarmManager.INTERVAL_DAY
        val next = alarm.copy(epochMs = tomorrow)
        store.upsert(next)
        try {
            val alarmManager =
                context.getSystemService(Context.ALARM_SERVICE) as AlarmManager
            val intent = Intent(context, AlarmAlarmReceiver::class.java).apply {
                action = ACTION_FIRE
                putExtra(EXTRA_ALARM_ID, alarm.id)
            }
            val flags =
                PendingIntent.FLAG_UPDATE_CURRENT or PendingIntent.FLAG_IMMUTABLE
            val pending =
                PendingIntent.getBroadcast(context, alarm.id.hashCode(), intent, flags)
            if (android.os.Build.VERSION.SDK_INT >= 31 &&
                !alarmManager.canScheduleExactAlarms()
            ) {
                alarmManager.setAndAllowWhileIdle(
                    AlarmManager.RTC_WAKEUP, tomorrow, pending,
                )
            } else if (android.os.Build.VERSION.SDK_INT >= 28) {
                alarmManager.setAlarmClock(
                    AlarmManager.AlarmClockInfo(tomorrow, pending),
                    pending,
                )
            } else {
                alarmManager.setExactAndAllowWhileIdle(
                    AlarmManager.RTC_WAKEUP, tomorrow, pending,
                )
            }
        } catch (error: Throwable) {
            android.util.Log.e("ExactAlarms", "Chaining next alarm failed", error)
        }
    }

    private fun escape(raw: String): String =
        raw.replace("\\", "\\\\").replace("\"", "\\\"")

    companion object {
        const val ACTION_FIRE = "net.todotxt.app.plugins.exactalarms.FIRE"
        const val EXTRA_ALARM_ID = "alarm_id"
    }
}
