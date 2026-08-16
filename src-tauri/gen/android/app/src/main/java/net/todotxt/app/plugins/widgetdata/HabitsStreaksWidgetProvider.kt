package net.todotxt.app.plugins.widgetdata

import android.appwidget.AppWidgetManager
import android.appwidget.AppWidgetProvider
import android.content.Context
import android.content.Intent
import android.os.Build
import android.view.View
import android.widget.RemoteViews
import net.todotxt.app.R

/**
 * Habit Streaks widget (collection).
 *
 * Compact 2x1: renders a single hero metric (longest active habit
 * streak). Larger sizes: one row per active habit showing the habit's
 * color dot, current streak, best streak, and an Android 12+ responsive
 * today-done checkbox that queues the same mark-done pipeline the
 * notification buttons use.
 */
class HabitsStreaksWidgetProvider : AppWidgetProvider() {

    override fun onUpdate(
        context: Context,
        manager: AppWidgetManager,
        ids: IntArray,
    ) {
        for (id in ids) {
            val options = manager.getAppWidgetOptions(id)
            val width = options.getInt(
                AppWidgetManager.OPTION_APPWIDGET_MIN_WIDTH, 0,
            )
            manager.updateAppWidget(id, buildRemoteViews(context, id, width))
        }
        manager.notifyAppWidgetViewDataChanged(ids, R.id.habit_list)
    }

    override fun onAppWidgetOptionsChanged(
        context: Context,
        manager: AppWidgetManager,
        id: Int,
        newOptions: android.os.Bundle,
    ) {
        onUpdate(context, manager, intArrayOf(id))
    }

    private fun buildRemoteViews(
        context: Context,
        widgetId: Int,
        minWidthDp: Int,
    ): RemoteViews {
        val store = WidgetDataStore(context)
        val payload = store.read()
        val activeHabits = payload.habits.filter { !it.completedToday }
        val completedToday = payload.habits.count { it.completedToday }

        if (minWidthDp <= 140) {
            // Compact hero mode: longest active streak.
            val best = payload.habits.maxOfOrNull { it.streak } ?: 0
            val views = RemoteViews(context.packageName, R.layout.widget_streaks)
            views.setTextViewText(
                R.id.widget_title,
                if (best > 0) "$best day streak" else "No active streak",
            )
            views.setTextViewText(
                R.id.widget_subtitle,
                "${payload.habits.size} habits · $completedToday done today",
            )
            views.setViewVisibility(R.id.habit_list, View.GONE)
            views.setViewVisibility(R.id.widget_empty, View.GONE)
            views.setOnClickPendingIntent(
                R.id.widget_root,
                WidgetHelpers.launchAppIntent(context),
            )
            return views
        }

        // Full list mode.
        val views = RemoteViews(context.packageName, R.layout.widget_streaks)
        views.setTextViewText(
            R.id.widget_subtitle,
            "${payload.habits.size} habits · $completedToday done today",
        )
        views.setViewVisibility(
            R.id.widget_empty,
            if (payload.habits.isEmpty()) View.VISIBLE else View.GONE,
        )

        views.setRemoteAdapter(
            R.id.habit_list,
            Intent(context, HabitsRemoteViewsService::class.java),
        )
        views.setEmptyView(R.id.habit_list, R.id.widget_empty)
        views.setOnClickPendingIntent(
            R.id.widget_root,
            WidgetHelpers.launchAppIntent(context),
        )
        return views
    }
}
