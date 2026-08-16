package net.todotxt.app.plugins.widgetdata

import android.content.Context
import android.content.Intent
import android.graphics.Color
import android.graphics.drawable.GradientDrawable
import android.os.Build
import android.view.View
import android.widget.RemoteViews
import android.widget.RemoteViewsService
import net.todotxt.app.R
import java.util.Calendar
import java.time.LocalDate

/**
 * Collection adapter for the Heatmap widget.
 *
 * One row per weekday (Mon–Sun, oldest week on the left), each row
 * carrying 12 week cells tinted by the featured habit's completion via
 * the `last12Weeks` projection (`WidgetHabit.last12Weeks[week][dayInWeek]`).
 * Today's empty cell is tappable and queues the shared mark-done action.
 */
class HabitsHeatmapRemoteViewsService : RemoteViewsService() {

    override fun onGetViewFactory(intent: Intent): RemoteViewsFactory =
        HeatmapViewsFactory(applicationContext, intent.getStringExtra(HabitsHeatmapWidgetProvider.EXTRA_HABIT_ID) ?: "")
}

internal class HeatmapViewsFactory(
    private val context: Context,
    private val habitId: String,
) : RemoteViewsService.RemoteViewsFactory {

    private var habit: WidgetHabit? = null
    private var todayRow: Int = -1

    override fun onCreate() = reload()

    override fun onDataSetChanged() = reload()

    private fun reload() {
        habit = WidgetDataStore(context).read().habits.find { it.id == habitId }
        val cal = Calendar.getInstance()
        val dayOfWeek = cal.get(Calendar.DAY_OF_WEEK)
        todayRow = (dayOfWeek + 5) % 7 // Mon=0 ... Sun=6
    }

    /** 7 weekday rows (Mon = 0). */
    override fun getCount(): Int = 7

    override fun getViewAt(position: Int): RemoteViews {
        val current = habit ?: return RemoteViews(context.packageName, R.layout.widget_heatmap_row)
        val week = position
        val views = RemoteViews(context.packageName, R.layout.widget_heatmap_row)
        val levels = HabitsHeatmapWidgetProvider.levels()
        val color = WidgetHelpers.parseColor(current.color)

        for (cell in 0 until 12) {
            val cellId = CELL_IDS[cell]
            val completed = current.last12Weeks
                .getOrElse(cell) { emptyList() }
                .getOrElse(week) { false }
            val alpha = if (completed) levels.last() else levels.first()

            runCatching {
                views.setInt(cellId, "setBackgroundColor", withAlpha(color, alpha))
            }

            if (completed && week == todayRow) {
                // Today's column: highlight completed cells slightly.
                runCatching {
                    views.setInt(cellId, "setBackgroundColor", withAlpha(color, 255))
                }
            }

            if (!completed && week == todayRow) {
                val doneIntent = WidgetHelpers.markHabitDoneIntent(context, current.id)
                if (Build.VERSION.SDK_INT >= 31) {
                    views.setOnClickResponse(
                        cellId,
                        RemoteViews.RemoteResponse.fromPendingIntent(doneIntent),
                    )
                } else {
                    views.setOnClickPendingIntent(cellId, doneIntent)
                }
            }
        }
        return views
    }

    private fun withAlpha(color: Int, alpha: Int): Int =
        Color.argb(alpha, Color.red(color), Color.green(color), Color.blue(color))

    override fun getLoadingView(): RemoteViews? = null
    override fun getViewTypeCount(): Int = 1
    override fun getItemId(position: Int): Long = position.toLong()
    override fun hasStableIds(): Boolean = true

    override fun onDestroy() {}

    companion object {
        val CELL_IDS = intArrayOf(
            R.id.cell_0, R.id.cell_1, R.id.cell_2, R.id.cell_3,
            R.id.cell_4, R.id.cell_5, R.id.cell_6, R.id.cell_7,
            R.id.cell_8, R.id.cell_9, R.id.cell_10, R.id.cell_11,
        )
    }
}
