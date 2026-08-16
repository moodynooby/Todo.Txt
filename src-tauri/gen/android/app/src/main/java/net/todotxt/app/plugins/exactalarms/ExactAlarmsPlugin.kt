package net.todotxt.app.plugins.exactalarms

import android.app.AlarmManager
import android.app.PendingIntent
import android.content.Context
import android.content.Intent
import android.os.Build
import app.tauri.annotation.Command
import app.tauri.annotation.InvokeArg
import app.tauri.annotation.TauriPlugin
import app.tauri.plugin.Invoke
import app.tauri.plugin.JSObject
import app.tauri.plugin.Plugin
import kotlinx.coroutines.CoroutineScope
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.launch

/**
 * Todo.Txt exact-alarm plugin.
 *
 * Bridges `src/lib/nativeReminders.ts` to Android's exact scheduling API so
 * habit reminders fire at the precise configured minute on Android 12+.
 *
 * Permission strategy (per the month-2 handoff doc):
 *  - The manifest requests USE_EXACT_ALARM, which Android grants at install
 *    time only to eligible apps. Habit reminders qualify as health/fitness
 *    habit tracking, but OEMs differ, so we still check.
 *  - If the device refuses USE_EXACT_ALARM, we degrade to inexact scheduling
 *    (`canSchedule` reports false) and JS falls back to the notification
 *    plugin's `Schedule.at(..., allowWhileIdle)` path.
 *  - SCHEDULE_EXACT_ALARM is available on demand via
 *    ACTION_REQUEST_SCHEDULE_EXACT_ALARM if the JS side wants to prompt.
 *
 * Alarms survive reboots through PendingAlarmStore + BootReceiver.
 */
@TauriPlugin
class ExactAlarmsPlugin(private val activity: android.app.Activity) : Plugin(activity) {

    private val context: Context get() = activity.applicationContext

    private val alarmManager: AlarmManager
        get() = context.getSystemService(Context.ALARM_SERVICE) as AlarmManager

    private val store by lazy { PendingAlarmStore(context) }

    // ------------------------------------------------------------------
    // Commands
    // ------------------------------------------------------------------

    /** Schedule an exact alarm. Idempotent: rescheduling replaces the old one. */
    @Command
    fun schedule(invoke: Invoke) {
        val args = invoke.parseArgs(ScheduleArgs::class.java)
        CoroutineScope(Dispatchers.IO).launch {
            try {
                val alarm = AlarmRecord(
                    id = args.id,
                    epochMs = args.epochMs,
                    title = args.title,
                    body = args.body,
                    repeatDaily = args.repeatDaily,
                    repeatIntervalMs = args.repeatIntervalMs,
                    channelId = args.channelId,
                )
                store.upsert(alarm)
                if (canScheduleExact()) {
                    postExact(alarm)
                } else {
                    postInexact(alarm)
                }
                invoke.resolve()
            } catch (error: Throwable) {
                invoke.reject(error.message ?: "Failed to schedule alarm", error as? Exception ?: Exception(error))
            }
        }
    }

    /** Cancel a pending alarm by id. */
    @Command
    fun cancel(invoke: Invoke) {
        val args = invoke.parseArgs(CancelArgs::class.java)
        try {
            store.delete(args.id)
            cancelPendingIntent(args.id)
            invoke.resolve()
        } catch (error: Throwable) {
            invoke.reject(error.message ?: "Failed to cancel alarm", error as? Exception ?: Exception(error))
        }
    }

    /** Whether exact alarms can be scheduled right now. */
    @Command
    fun canSchedule(invoke: Invoke) {
        val allowed = canScheduleExact()
        val requested = Build.VERSION.SDK_INT >= 31 &&
            alarmManager.canScheduleExactAlarms()
        val res = JSObject()
        res.put("allowed", allowed)
        res.put("requested", requested)
        res.put("requiresRuntimeGrant", Build.VERSION.SDK_INT >= 31)
        res.put("openSettingsIntent", Build.VERSION.SDK_INT >= 31 && !requested)
        invoke.resolve(res)
    }

    /** Open the OS screen where the user can grant exact-alarm permission. */
    @Command
    fun openExactAlarmSettings(invoke: Invoke) {
        try {
            val intent = Intent(android.provider.Settings.ACTION_REQUEST_SCHEDULE_EXACT_ALARM)
            intent.flags = Intent.FLAG_ACTIVITY_NEW_TASK
            context.startActivity(intent)
            invoke.resolve()
        } catch (error: Throwable) {
            invoke.reject("Could not open settings: ${error.message}", error as? Exception ?: Exception(error))
        }
    }

    /**
     * Full reconciliation from JS at app launch. Clears alarms not in the
     * list and re-posts the rest, guaranteeing native and JS state agree.
     */
    @Command
    fun sync(invoke: Invoke) {
        val args = invoke.parseArgs(SyncArgs::class.java)
        CoroutineScope(Dispatchers.IO).launch {
            try {
                val wanted = args.reminders.map { it.toAlarmRecord() }.toSet()
                val existing = store.all().toSet()
                (existing - wanted).forEach {
                    store.delete(it.id)
                    cancelPendingIntent(it.id)
                }
                if (canScheduleExact()) {
                    wanted.forEach { if (!existing.contains(it)) postExact(it) }
                } else {
                    wanted.forEach { if (!existing.contains(it)) postInexact(it) }
                }
                invoke.resolve()
            } catch (error: Throwable) {
                invoke.reject(error.message ?: "Failed to sync alarms", error as? Exception ?: Exception(error))
            }
        }
    }

    // ------------------------------------------------------------------
    // Scheduling helpers
    // ------------------------------------------------------------------

    private fun canScheduleExact(): Boolean =
        Build.VERSION.SDK_INT < 31 || alarmManager.canScheduleExactAlarms()

    private fun buildPendingIntent(alarm: AlarmRecord): PendingIntent {
        val intent = Intent(context, AlarmAlarmReceiver::class.java).apply {
            action = AlarmAlarmReceiver.ACTION_FIRE
            putExtra(AlarmAlarmReceiver.EXTRA_ALARM_ID, alarm.id)
        }
        val flags =
            PendingIntent.FLAG_UPDATE_CURRENT or
                (if (Build.VERSION.SDK_INT >= 23) PendingIntent.FLAG_IMMUTABLE else 0)
        return PendingIntent.getBroadcast(context, alarm.id.hashCode(), intent, flags)
    }

    private fun cancelPendingIntent(id: String) {
        val intent = Intent(context, AlarmAlarmReceiver::class.java).apply {
            action = AlarmAlarmReceiver.ACTION_FIRE
            putExtra(AlarmAlarmReceiver.EXTRA_ALARM_ID, id)
        }
        val flags =
            PendingIntent.FLAG_NO_CREATE or
                (if (Build.VERSION.SDK_INT >= 23) PendingIntent.FLAG_IMMUTABLE else 0)
        val pending = PendingIntent.getBroadcast(context, id.hashCode(), intent, flags)
        if (pending != null) {
            alarmManager.cancel(pending)
            pending.cancel()
        }
    }

    private fun postExact(alarm: AlarmRecord) {
        val pending = buildPendingIntent(alarm)
        when {
            Build.VERSION.SDK_INT >= 28 && alarm.repeatDaily -> {
                // Daily exact alarms: chain tomorrow's alarm from the receiver
                // via setAlarmClock, which reliably wakes the device.
                alarmManager.setAlarmClock(
                    AlarmManager.AlarmClockInfo(
                        alarm.epochMs,
                        pending,
                    ),
                    pending,
                )
            }
            Build.VERSION.SDK_INT >= 23 -> {
                alarmManager.setExactAndAllowWhileIdle(
                    AlarmManager.RTC_WAKEUP,
                    alarm.epochMs,
                    pending,
                )
            }
            alarm.repeatDaily || (alarm.repeatIntervalMs != null && alarm.repeatIntervalMs > 0) -> {
                alarmManager.setRepeating(
                    AlarmManager.RTC_WAKEUP,
                    alarm.epochMs,
                    alarm.repeatIntervalMs ?: AlarmManager.INTERVAL_DAY,
                    pending,
                )
            }
            else -> {
                alarmManager.setExact(AlarmManager.RTC_WAKEUP, alarm.epochMs, pending)
            }
        }
    }

    /** Fallback used when exact scheduling is unavailable. */
    private fun postInexact(alarm: AlarmRecord) {
        alarmManager.setAndAllowWhileIdle(
            AlarmManager.RTC_WAKEUP,
            alarm.epochMs,
            buildPendingIntent(alarm),
        )
    }

    /** Called by BootReceiver and internally; re-posts every persisted alarm. */
    internal fun bootReapply() {
        CoroutineScope(Dispatchers.IO).launch {
            try {
                val now = System.currentTimeMillis()
                store.all().forEach { alarm ->
                    cancelPendingIntent(alarm.id)
                    val future = if (alarm.epochMs <= now && alarm.repeatDaily) {
                        alarm.epochMs + AlarmManager.INTERVAL_DAY
                    } else if (alarm.epochMs <= now) {
                        return@forEach // one-shot that already fired; drop it
                    } else {
                        alarm.epochMs
                    }
                    val refreshed = alarm.copy(epochMs = future)
                    store.upsert(refreshed)
                    if (canScheduleExact()) postExact(refreshed) else postInexact(refreshed)
                }
            } catch (error: Throwable) {
                android.util.Log.e("ExactAlarms", "Boot reapply failed", error)
            }
        }
    }

    /** Snooze an alarm `minutes` from now and clear the old pending one. */
    internal fun snooze(id: String, minutes: Int) {
        CoroutineScope(Dispatchers.IO).launch {
            try {
                val existing = store.find(id) ?: return@launch
                cancelPendingIntent(id)
                val snoozed = existing.copy(epochMs = System.currentTimeMillis() + minutes * 60_000L)
                store.upsert(snoozed)
                if (canScheduleExact()) postExact(snoozed) else postInexact(snoozed)
            } catch (error: Throwable) {
                android.util.Log.e("ExactAlarms", "Snooze failed", error)
            }
        }
    }
}

// ------------------------------------------------------------------
// Argument types
// ------------------------------------------------------------------

@InvokeArg
internal class ScheduleArgs {
    lateinit var id: String
    var epochMs: Long = 0L
    var title: String = ""
    var body: String = ""
    var repeatDaily: Boolean = false
    var repeatIntervalMs: Long? = null
    var channelId: String = "habits"
}

@InvokeArg
internal class CancelArgs {
    lateinit var id: String
}

@InvokeArg
internal class SyncReminderArgs {
    lateinit var id: String
    var epochMs: Long = 0L
    var title: String = ""
    var body: String = ""
    var repeatDaily: Boolean = false
    var repeatIntervalMs: Long? = null
    var channelId: String = "habits"

    fun toAlarmRecord(): AlarmRecord =
        AlarmRecord(
            id = id,
            epochMs = epochMs,
            title = title,
            body = body,
            repeatDaily = repeatDaily,
            repeatIntervalMs = repeatIntervalMs,
            channelId = channelId,
        )
}

@InvokeArg
internal class SyncArgs {
    lateinit var reminders: List<SyncReminderArgs>
}
