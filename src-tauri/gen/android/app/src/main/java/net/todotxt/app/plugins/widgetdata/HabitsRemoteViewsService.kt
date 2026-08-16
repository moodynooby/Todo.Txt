package net.todotxt.app.plugins.widgetdata

import android.content.Context
import android.content.Intent
import android.graphics.Color
import android.graphics.drawable.GradientDrawable
import android.os.Build
import android.widget.RemoteViews
import android.widget.RemoteViewsService
import net.todotxt.app.R

/**
 * Collection adapter for the Habit Streaks widget.
 *
 * Each row binds one active habit: color dot (tinted from the habit's
 * palette color), name, current streak, best streak, and an Android 12+
 * responsive today-done checkbox.
 */
class HabitsRemoteViewsService : RemoteViewsService() {

    override fun onGetViewFactory(intent: Intent): RemoteViewsFactory =
        HabitsViewsFactory(applicationContext)
}

internal class HabitsViewsFactory(
    private val context: Context,
) : RemoteViewsService.RemoteViewsFactory {

    private var habits: List<WidgetHabit> = emptyList()

    override fun onCreate() = reload()

    override fun onDataSetChanged() = reload()

    private fun reload() {
        habits = WidgetDataStore(context).read().habits
    }

    override fun getCount(): Int = habits.size

    override fun getViewAt(position: Int): RemoteViews {
        val habit = habits.getOrElse(position) {
            return RemoteViews(context.packageName, R.layout.widget_streak_row)
        }
        val views = RemoteViews(context.packageName, R.layout.widget_streak_row)

        views.setTextViewText(R.id.habit_name, habit.name.take(40))
        views.setTextViewText(
            R.id.habit_streak,
            buildString {
                append(habit.streak)
                append(if (habit.streak == 1) " day" else " days")
            },
        )
        views.setTextViewText(
            R.id.habit_best,
            "best ${habit.bestStreak}",
        )

        // Tint the color dot from the habit's palette color.
        views.setInt(
            R.id.habit_dot,
            "setBackgroundColor",
            WidgetHelpers.parseColor(habit.color),
        )

        if (habit.completedToday) {
            views.setViewVisibility(R.id.habit_done, android.view.View.GONE)
        } else {
            val doneIntent = WidgetHelpers.markHabitDoneIntent(context, habit.id)
            if (Build.VERSION.SDK_INT >= 31) {
                views.setOnCheckedChangeResponse(
                    R.id.habit_done,
                    RemoteViews.RemoteResponse.fromPendingIntent(doneIntent),
                )
            } else {
                views.setOnClickFillInIntent(R.id.habit_done, WidgetHelpers.markHabitDoneFillInIntent(habit.id))
            }
        }
        return views
    }

    override fun getLoadingView(): RemoteViews? = null

    override fun getViewTypeCount(): Int = 1

    override fun getItemId(position: Int): Long =
        habits.getOrNull(position)?.id?.hashCode()?.toLong() ?: position.toLong()

    override fun hasStableIds(): Boolean = true

    override fun onDestroy() {}
}
