package app.todotxt.widget

import android.content.Context
import androidx.glance.GlanceId
import androidx.glance.action.ActionParameters
import androidx.glance.appwidget.action.ActionCallback
import app.todotxt.core.HabitUtils
import app.todotxt.persistence.Storage
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.withContext

/**
 * Toggles a habit's today-completion from widget taps. The tapped row
 * passes its habit id via [HABIT_ID]; without a parameter it falls back to
 * the first unchecked active habit (legacy behavior).
 */
class HabitToggleCallback : ActionCallback {
    companion object {
        val HABIT_ID: ActionParameters.Key<String> = ActionParameters.Key("habit.id")
    }

    override suspend fun onAction(
        context: Context,
        glanceId: GlanceId,
        parameters: ActionParameters,
    ) {
        val habitId = parameters[HABIT_ID]
        withContext(Dispatchers.IO) {
            val today = HabitUtils.today()
            Storage.updateHabits { habits ->
                habits.map { habit ->
                    when {
                        habit.archived -> habit
                        habitId != null && habit.id == habitId ->
                            HabitUtils.toggleDate(habit, today)
                        habitId == null && !habit.completedDates.contains(today) ->
                            HabitUtils.toggleDate(habit, today)
                        else -> habit
                    }
                }
            }
        }
        WidgetRefresher.refreshAll(context)
    }
}
