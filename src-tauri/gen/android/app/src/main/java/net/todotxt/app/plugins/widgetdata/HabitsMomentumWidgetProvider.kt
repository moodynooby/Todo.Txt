package net.todotxt.app.plugins.widgetdata

import android.appwidget.AppWidgetManager
import android.appwidget.AppWidgetProvider
import android.content.Context
import android.content.SharedPreferences
import android.view.View
import android.widget.RemoteViews

/**
 * Momentum widget (2x1 hero).
 *
 * A single oversized metric that captures where the user's practice
 * currently stands. The metric rotates between three views, persisted in
 * preferences per-widget:
 *  - best streak (e.g. "12 day streak" — longest active habit)
 *  - average consistency (e.g. "84% · 28 days")
 *  - today's progress (e.g. "3/5 done today")
 */
class HabitsMomentumWidgetProvider : AppWidgetProvider() {

    override fun onUpdate(
        context: Context,
        manager: AppWidgetManager,
        ids: IntArray,
    ) {
        for (id in ids) manager.updateAppWidget(id, buildRemoteViews(context, id))
    }

    private fun buildRemoteViews(context: Context, widgetId: Int): RemoteViews {
        val store = WidgetDataStore(context)
        val payload = store.read()
        val momentum = payload.momentum
        val prefs = context.getSharedPreferences(
            "widget_momentum", Context.MODE_PRIVATE,
        )
        val metric = prefs.getInt("metric_$widgetId", 0)
        val next = (metric + 1) % 3
        prefs.edit().putInt("metric_$widgetId", next).apply()

        val views = RemoteViews(context.packageName, R.layout.widget_momentum)

        val (headline, caption) = when (metric) {
            1 -> momentum.avgRate28.toString().plus("% · 28 days") to "average consistency"
            2 -> "${momentum.habitsDoneToday}/${momentum.habitsTotal} done" to "habits today"
            else -> buildString {
                append(momentum.bestStreak)
                append(if (momentum.bestStreak == 1) " day streak" else " day streak")
            } to if (momentum.bestStreak > 0) "longest current streak" else "start your first streak"
        }

        views.setTextViewText(R.id.momentum_headline, headline)
        views.setTextViewText(R.id.momentum_caption, caption)
        views.setViewVisibility(
            R.id.momentum_empty,
            if (payload.habits.isEmpty()) View.VISIBLE else View.GONE,
        )
        views.setViewVisibility(
            R.id.momentum_main,
            if (payload.habits.isEmpty()) View.GONE else View.VISIBLE,
        )
        views.setOnClickPendingIntent(
            R.id.widget_root,
            WidgetHelpers.launchAppIntent(context),
        )
        return views
    }
}
