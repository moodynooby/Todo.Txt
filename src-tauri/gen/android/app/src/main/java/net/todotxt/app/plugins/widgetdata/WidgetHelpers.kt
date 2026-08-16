package net.todotxt.app.plugins.widgetdata

import android.app.PendingIntent
import android.appwidget.AppWidgetManager
import android.content.Context
import android.content.Intent
import android.graphics.Color
import android.net.Uri
import android.widget.RemoteViews
import androidx.core.graphics.toColorInt

/**
 * Shared widget helpers used by both widget providers:
 *  - `mark-done` / `mark-undone` broadcast intents queued into the same
 *    `native_pending_actions` store the exact-alarm `ActionReceiver` uses,
 *    so a widget tap reaches the exact same JS reducer logic.
 *  - The launcher open intent (`launch-app`) brings the webview forward so
 *    it can consume the queued action on cold start.
 */
internal object WidgetHelpers {

    /** Fill-in intent for a todo row's checkbox (collection widget). */
    fun markDoneIntent(context: Context, taskId: Long): PendingIntent {
        val intent = Intent(context, WidgetActionsReceiver::class.java).apply {
            action = WidgetActionsReceiver.ACTION_MARK_DONE_TODO
            putExtra(WidgetActionsReceiver.EXTRA_TASK_ID, taskId)
            data = Uri.parse("todotxt://widget/mark-done/$taskId")
        }
        val flags = PendingIntent.FLAG_UPDATE_CURRENT or PendingIntent.FLAG_IMMUTABLE
        return PendingIntent.getBroadcast(context, taskId.toInt(), intent, flags)
    }

    /** Fill-in intent for a habit row's today-done checkbox. */
    fun markHabitDoneIntent(context: Context, habitId: String): PendingIntent {
        val intent = Intent(context, WidgetActionsReceiver::class.java).apply {
            action = WidgetActionsReceiver.ACTION_MARK_DONE_HABIT
            putExtra(WidgetActionsReceiver.EXTRA_HABIT_ID, habitId)
            data = Uri.parse("todotxt://widget/mark-habit-done/$habitId")
        }
        val flags = PendingIntent.FLAG_UPDATE_CURRENT or PendingIntent.FLAG_IMMUTABLE
        return PendingIntent.getBroadcast(context, habitId.hashCode(), intent, flags)
    }

    /** Launcher intent reused as the widget's general tap target. */
    fun launchAppIntent(context: Context): PendingIntent {
        val intent = context.packageManager.getLaunchIntentForPackage(context.packageName)
            ?: Intent().setClassName(
                context,
                "${context.packageName}.MainActivity",
            )
        val flags = PendingIntent.FLAG_UPDATE_CURRENT or PendingIntent.FLAG_IMMUTABLE
        return PendingIntent.getActivity(context, 0, intent, flags)
    }

    /** Parse a hex color string with a safe fallback. */
    fun parseColor(color: String): Int =
        runCatching { color.toColorInt() }.getOrDefault(Color.parseColor("#888888"))

}
