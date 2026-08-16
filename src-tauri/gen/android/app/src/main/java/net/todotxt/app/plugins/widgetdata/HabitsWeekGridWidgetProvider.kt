package net.todotxt.app.plugins.widgetdata

import android.appwidget.AppWidgetManager
import android.appwidget.AppWidgetProvider
import android.content.Context
import android.content.Intent
import android.os.Build
import android.view.View
import android.widget.RemoteViews
import net.todotxt.app.R
import java.time.DayOfWeek

/**
 * Week Grid widget (4x2/4x3).
 *
 * Renders the trailing 7 days as columns (Mon–Sun, oldest first) with one
 * row per active habit: filled day-squares for completed days and a
 * trailing "n/7 this week" counter per habit. Tapping an unfilled square
 * on today's column marks the habit done via the same pending-action
 * queue the streak widget and notifications use.
 *
 * Implemented as a `RemoteViewsService` collection (like the streak
 * widget) so it works on the app's minSdk (API 24); `RemoteViews.addView`
 * (API 31) is intentionally avoided.
 */
class HabitsWeekGridWidgetProvider : AppWidgetProvider() {

    override fun onUpdate(
        context: Context,
        manager: AppWidgetManager,
        ids: IntArray,
    ) {
        for (id in ids) {
            manager.updateAppWidget(id, buildRemoteViews(context, id))
        }
        manager.notifyAppWidgetViewDataChanged(ids, R.id.week_grid_list)
    }

    override fun onAppWidgetOptionsChanged(
        context: Context,
        manager: AppWidgetManager,
        id: Int,
        newOptions: android.os.Bundle,
    ) {
        onUpdate(context, manager, intArrayOf(id))
    }

    private fun buildRemoteViews(context: Context, widgetId: Int): RemoteViews {
        val store = WidgetDataStore(context)
        val payload = store.read()
        val views = RemoteViews(context.packageName, R.layout.widget_week_grid)

        views.setRemoteAdapter(
            R.id.week_grid_list,
            Intent(context, HabitsWeekGridRemoteViewsService::class.java),
        )
        views.setEmptyView(R.id.week_grid_list, R.id.week_grid_empty)
        views.setViewVisibility(
            R.id.week_grid_empty,
            if (payload.habits.isEmpty()) View.VISIBLE else View.GONE,
        )
        views.setOnClickPendingIntent(
            R.id.widget_root,
            WidgetHelpers.launchAppIntent(context),
        )
        return views
    }

    companion object {
        fun weekDays(): List<String> {
            return listOf("M", "T", "W", "T", "F", "S", "S")
        }
    }
}
