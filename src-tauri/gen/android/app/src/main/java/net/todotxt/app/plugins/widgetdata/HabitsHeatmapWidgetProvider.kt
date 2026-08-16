package net.todotxt.app.plugins.widgetdata

import android.appwidget.AppWidgetManager
import android.appwidget.AppWidgetProvider
import android.content.Context
import android.content.Intent
import android.graphics.Color
import android.graphics.drawable.GradientDrawable
import android.view.View
import android.widget.RemoteViews
import net.todotxt.app.R
import java.time.DayOfWeek
import java.time.LocalDate

/**
 * Heatmap ("Don't Break the Chain") widget (4x2/4x3).
 *
 * A GitHub-style contribution grid of the last 12 weeks x 7 days for the
 * single habit with the longest active streak — the practice worth not
 * breaking. Each cell is tinted in the habit's palette color with
 * graduated alpha (faint outline → fully opaque); today's column is
 * underlined in intent. Tapping any empty cell of today's column marks
 * the habit done; tapping the grid opens the app.
 *
 * Built as a `RemoteViewsService` collection like the other widgets so
 * it runs on the app's minSdk (API 24).
 */
class HabitsHeatmapWidgetProvider : AppWidgetProvider() {

    override fun onUpdate(
        context: Context,
        manager: AppWidgetManager,
        ids: IntArray,
    ) {
        for (id in ids) {
            manager.updateAppWidget(id, buildRemoteViews(context, id))
        }
        manager.notifyAppWidgetViewDataChanged(ids, R.id.heatmap_list)
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
        val views = RemoteViews(context.packageName, R.layout.widget_heatmap)

        // Feature the habit with the longest active streak (ties: first).
        val featured = payload.habits.maxByOrNull { it.streak }

        views.setTextViewText(
            R.id.widget_subtitle,
            featured?.let { "${it.name} · ${it.streak} day streak" }
                ?: payload.habits.firstOrNull()?.let { "${it.name} · no active streak" }
                ?: "No habits yet",
        )
        views.setViewVisibility(
            R.id.heatmap_empty,
            if (payload.habits.isEmpty()) View.VISIBLE else View.GONE,
        )

        if (featured != null) {
            views.setRemoteAdapter(
                R.id.heatmap_list,
                Intent(context, HabitsHeatmapRemoteViewsService::class.java).apply {
                    putExtra(EXTRA_HABIT_ID, featured.id)
                },
            )
        }
        views.setEmptyView(R.id.heatmap_list, R.id.heatmap_empty)
        views.setOnClickPendingIntent(
            R.id.widget_root,
            WidgetHelpers.launchAppIntent(context),
        )
        return views
    }

    companion object {
        const val EXTRA_HABIT_ID = "habit_id"

        /** Heatmap column labels (Mon / Wed / Fri / Sun). */
        fun dayLabels(): List<String> = listOf("M", "W", "F", "S")

        /** Legend swatch opacities for the graduated cells (0 = outline). */
        fun levels(): List<Int> = listOf(40, 110, 170, 210, 255)
    }
}
