package net.todotxt.app.plugins.widgetdata

import android.content.Context
import android.content.Intent
import android.graphics.Color
import android.graphics.drawable.GradientDrawable
import android.os.Build
import android.view.View
import android.widget.RemoteViews
import android.widget.RemoteViewsService
import java.time.LocalDate

/**
 * Collection adapter for the Week Grid widget.
 *
 * Row 0 is a header of weekday initials (SQUARE ids painted transparent
 * with the weekday labels in `widget_title` style — simplified to just
 * the day initials painted as background via `widget_title` reuse would
 * be lossy, so the header uses `widget_week_grid_header`). Every following
 * row binds one habit: 7 day squares tinted from the habit color when
 * completed (faint outline otherwise), the habit name, the trailing-7-day
 * counter (n/7), and a today-done checkbox that queues the same
 * mark-done pipeline as the streak widget.
 */
class HabitsWeekGridRemoteViewsService : RemoteViewsService() {

    override fun onGetViewFactory(intent: Intent): RemoteViewsFactory =
        WeekGridViewsFactory(applicationContext)
}

internal class WeekGridViewsFactory(
    private val context: Context,
) : RemoteViewsService.RemoteViewsFactory {

    private var habits: List<WidgetHabit> = emptyList()
    private var weekLabels: List<String> = emptyList()

    override fun onCreate() = reload()

    override fun onDataSetChanged() = reload()

    private fun reload() {
        habits = WidgetDataStore(context).read().habits
        weekLabels = HabitsWeekGridWidgetProvider.weekDays()
    }

    /** Row 0 = weekday header, rows 1..N = one per habit. */
    override fun getCount(): Int = habits.size + 1

    override fun getViewTypeCount(): Int = 2

    override fun getItemViewType(position: Int): Int =
        if (position == 0) 0 else 1

    override fun getViewAt(position: Int): RemoteViews =
        if (position == 0) headerRow() else habitRow(position - 1)

    private fun headerRow(): RemoteViews {
        val views = RemoteViews(context.packageName, R.layout.widget_week_grid_row)
        // API-24 safe header: weekday initials are rendered as a single
        // centered label above the cells; the header row reuses the
        // habit-row layout with the non-header slots hidden.
        views.setViewVisibility(R.id.habit_done, View.GONE)
        views.setViewVisibility(R.id.habit_week_count, View.GONE)
        views.setTextViewText(
            R.id.habit_name,
            "${weekLabels.joinToString(" ")}",
        )
        return views
    }

    private fun habitRow(index: Int): RemoteViews {
        val habit = habits.getOrElse(index) {
            return RemoteViews(context.packageName, R.layout.widget_week_grid_row)
        }
        val views = RemoteViews(context.packageName, R.layout.widget_week_grid_row)
        val todayIndex = LocalDate.now().dayOfWeek.value - 1
        val weekDone = habit.last7.count { it }

        views.setTextViewText(R.id.habit_name, habit.name.take(22))
        views.setTextViewText(R.id.habit_week_count, "$weekDone/7")

        val baseColor = WidgetHelpers.parseColor(habit.color)
        for (day in 0 until 7) {
            val squareId = DAY_SQUARE_IDS[day]
            val completed = habit.last7.getOrElse(day) { false }
            if (completed) {
                runCatching {
                    val drawable = GradientDrawable(
                        GradientDrawable.OVAL,
                        intArrayOf(withAlpha(baseColor, 210)),
                    )
                    views.setBackground(squareId, drawable)
                }.onFailure {
                    views.setInt(squareId, "setBackgroundColor", withAlpha(baseColor, 210))
                }
            } else {
                runCatching {
                    val drawable = GradientDrawable(
                        GradientDrawable.OVAL,
                        intArrayOf(withAlpha(baseColor, 40)),
                    )
                    views.setBackground(squareId, drawable)
                }.onFailure {
                    views.setInt(squareId, "setBackgroundColor", withAlpha(baseColor, 40))
                }
                // Only today's empty cell is tappable (future-safe: the
                // action still marks done for today).
                if (day == todayIndex) {
                    val doneIntent = WidgetHelpers.markHabitDoneIntent(context, habit.id)
                    if (Build.VERSION.SDK_INT >= 31) {
                        views.setOnClickResponse(
                            squareId,
                            RemoteViews.RemoteResponse.fromPendingIntent(doneIntent),
                        )
                    } else {
                        views.setOnClickPendingIntent(squareId, doneIntent)
                    }
                }
            }
        }

        if (habit.completedToday) {
            views.setViewVisibility(R.id.habit_done, View.GONE)
        } else {
            val doneIntent = WidgetHelpers.markHabitDoneIntent(context, habit.id)
            if (Build.VERSION.SDK_INT >= 31) {
                views.setOnCheckedChangeResponse(
                    R.id.habit_done,
                    RemoteViews.RemoteResponse.fromPendingIntent(doneIntent),
                )
            } else {
                views.setOnClickFillInIntent(R.id.habit_done, doneIntent)
            }
        }
        return views
    }

    private fun withAlpha(color: Int, alpha: Int): Int =
        Color.argb(alpha, Color.red(color), Color.green(color), Color.blue(color))

    override fun getLoadingView(): RemoteViews? = null

    override fun getItemId(position: Int): Long = position.toLong()

    override fun hasStableIds(): Boolean = false

    companion object {
        val DAY_SQUARE_IDS = intArrayOf(
            R.id.day_square_0, R.id.day_square_1, R.id.day_square_2,
            R.id.day_square_3, R.id.day_square_4, R.id.day_square_5,
            R.id.day_square_6,
        )
    }
}
