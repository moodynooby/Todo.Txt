package net.todotxt.app.plugins.widgetdata

import android.content.BroadcastReceiver
import android.content.Context
import android.content.Intent
import net.todotxt.app.MainActivity

/**
 * Receives interactive widget actions (tap a todo checkbox, tap a habit's
 * today mark) and bridges them into the app's existing action pipeline:
 *
 *  1. Serializes the action into the same `native_pending_actions`
 *     SharedPreferences queue the exact-alarm `ActionReceiver` writes, so
 *     `nativeReminders.ts` consumes widget taps with the identical reducer
 *     logic it uses for notification buttons.
 *  2. Brings the MainActivity forward (`singleTask`) so a cold-starting
 *     webview reads and drains the queued action.
 *  3. Refreshes every widget so the tapped state reflects immediately.
 */
class WidgetActionsReceiver : BroadcastReceiver() {

    override fun onReceive(context: Context, intent: Intent) {
        Thread {
            val prefs = context.getSharedPreferences(
                "native_pending_actions", Context.MODE_PRIVATE,
            )
            val taskId = intent.getLongExtra(EXTRA_TASK_ID, -1L)
            val habitId = intent.getStringExtra(EXTRA_HABIT_ID)

            val payload = when (intent.action) {
                ACTION_MARK_DONE_TODO -> if (taskId != -1L) """{"kind":"mark-done-todo","line":$taskId}""" else return@Thread
                ACTION_MARK_DONE_HABIT -> if (habitId != null) """{"kind":"mark-done-habit","id":"$habitId"}""" else return@Thread
                ACTION_MARK_UNDONE_TODO -> if (taskId != -1L) """{"kind":"undo-todo","line":$taskId}""" else return@Thread
                else -> return@Thread
            }

            prefs.edit().putString(KEY_PAYLOAD, payload).apply()

            // Surface the action to a live webview via MainActivity.
            val liveIntent = Intent(context, MainActivity::class.java).apply {
                addFlags(Intent.FLAG_ACTIVITY_NEW_TASK or Intent.FLAG_ACTIVITY_SINGLE_TOP)
                putExtra("payload", payload)
                putExtra("actionId", "widget-${intent.action}")
            }
            context.startActivity(liveIntent)

            // Re-render widgets so the new state shows without waiting for
            // the next JS push.
            WidgetDataPlugin.refreshWidgets(context)
        }.start()
    }

    companion object {
        const val ACTION_MARK_DONE_TODO = "net.todotxt.app.widget.MARK_DONE"
        const val ACTION_MARK_DONE_HABIT = "net.todotxt.app.widget.MARK_HABIT_DONE"
        const val ACTION_MARK_UNDONE_TODO = "net.todotxt.app.widget.MARK_UNDONE"
        const val EXTRA_TASK_ID = "task_id"
        const val EXTRA_HABIT_ID = "habit_id"
        private const val KEY_PAYLOAD = "payload"
    }
}
