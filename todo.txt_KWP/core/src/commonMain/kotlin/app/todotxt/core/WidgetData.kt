package app.todotxt.core

import kotlinx.serialization.Serializable

/**
 * Shared home-screen-widget projection.
 *
 * Mirrors the JSON contract of the Tauri shell's `widget_data.json`
 * (`src-tauri/gen/android/.../widgetdata/Models.kt`) so both the Glance
 * widgets (native app) and the RemoteViews providers (Tauri shell) render
 * from one identical data shape computed by this module.
 */

@Serializable
data class WidgetTaskProjection(
    val id: Int,
    val text: String,
    val done: Boolean,
    val due: String? = null,
)

@Serializable
data class WidgetHabitProjection(
    val id: String,
    val name: String,
    val color: String,
    val streak: Int,
    val bestStreak: Int,
    val rate28: Int,
    val last30: List<Boolean> = emptyList(),
    val last7: List<Boolean> = emptyList(),
    /** Rolling 12-week grid (weeks x 7 days), oldest column first; future days are false. */
    val last12Weeks: List<List<Boolean>> = emptyList(),
    val completedToday: Boolean,
    val reminderTime: String? = null,
)

@Serializable
data class WidgetMomentumProjection(
    val bestStreak: Int = 0,
    val bestHabitName: String = "",
    val avgRate28: Int = 0,
    val habitsDoneToday: Int = 0,
    val habitsTotal: Int = 0,
)

@Serializable
data class WidgetPayloadProjection(
    val date: String,
    val tasks: List<WidgetTaskProjection> = emptyList(),
    val habits: List<WidgetHabitProjection> = emptyList(),
    val momentum: WidgetMomentumProjection = WidgetMomentumProjection(),
)

/**
 * Pure data-prep for every widget variant. No platform dependencies —
 * consumed by Android Glance widgets, JVM tests, and exportable to JS.
 */
object WidgetData {

    const val DEFAULT_MAX_TASKS = 50
    const val WEEKS_IN_GRID = 12

    fun project(
        tasks: List<Task>,
        habits: List<Habit>,
        today: String = HabitUtils.today(),
        maxTasks: Int = DEFAULT_MAX_TASKS,
    ): WidgetPayloadProjection {
        val activeHabits = habits.filter { !it.archived }
        val projectedHabits = activeHabits.map { projectHabit(it, today) }

        return WidgetPayloadProjection(
            date = today,
            tasks = tasks.take(maxTasks).map { task ->
                WidgetTaskProjection(
                    id = task.id,
                    text = task.text,
                    done = task.completed,
                    due = task.due,
                )
            },
            habits = projectedHabits,
            momentum = projectMomentum(projectedHabits),
        )
    }

    fun projectHabit(habit: Habit, today: String = HabitUtils.today()): WidgetHabitProjection {
        val heatmap = HabitUtils.getHeatmap(habit, WEEKS_IN_GRID)
        val completed = habit.completedDates.toSet()
        return WidgetHabitProjection(
            id = habit.id,
            name = habit.name,
            color = habit.color.hex,
            streak = HabitUtils.getHabitStreak(habit),
            bestStreak = HabitUtils.getBestStreak(habit),
            rate28 = HabitUtils.getCompletionRate(habit),
            last30 = HabitUtils.getLastDays(30).map { completed.contains(it) },
            last7 = HabitUtils.getLastDays(7).map { completed.contains(it) },
            last12Weeks = heatmap.map { week -> week.map { date -> date != null && completed.contains(date) } },
            completedToday = completed.contains(today),
            reminderTime = if (habit.reminderEnabled) habit.reminderTime else null,
        )
    }

    fun projectMomentum(habits: List<WidgetHabitProjection>): WidgetMomentumProjection {
        if (habits.isEmpty()) return WidgetMomentumProjection()
        val best = habits.maxBy { it.streak }
        val avgRate = habits.map { it.rate28 }.average().toInt()
        return WidgetMomentumProjection(
            bestStreak = best.streak,
            bestHabitName = best.name,
            avgRate28 = avgRate,
            habitsDoneToday = habits.count { it.completedToday },
            habitsTotal = habits.size,
        )
    }

    /** Open (not done) tasks in document order, optionally capped for small widgets. */
    fun openTasks(payload: WidgetPayloadProjection, limit: Int = Int.MAX_VALUE): List<WidgetTaskProjection> =
        payload.tasks.filter { !it.done }.take(limit)
}
