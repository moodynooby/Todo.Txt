package app.todotxt.widget

import android.content.Context
import androidx.glance.GlanceId
import androidx.glance.appwidget.action.ActionCallback
import androidx.glance.appwidget.updateAll
import app.todotxt.core.HabitUtils
import app.todotxt.persistence.Storage
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.withContext

/**
 * Action callback that toggles the first unchecked habit for today
 * when the user taps a habit row in the Quick-Check widget.
 */
class HabitToggleCallback : ActionCallback {
    override suspend fun onAction(
        context: Context,
        glanceId: GlanceId,
        parameters: androidx.glance.action.ActionParameters
    ) {
        withContext(Dispatchers.IO) {
            val today = HabitUtils.today()
            Storage.updateHabits { habits ->
                habits.map { habit ->
                    if (!habit.archived && !habit.completedDates.contains(today)) {
                        HabitUtils.toggleDate(habit, today)
                    } else {
                        habit
                    }
                }
            }
        }
        HabitQuickCheckWidget().updateAll(context)
        HabitMomentumWidget().updateAll(context)
    }
}
