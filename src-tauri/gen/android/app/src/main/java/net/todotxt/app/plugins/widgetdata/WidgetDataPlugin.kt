package net.todotxt.app.plugins.widgetdata

import android.appwidget.AppWidgetManager
import android.content.ComponentName
import android.content.Context
import android.content.Intent
import app.tauri.annotation.Command
import app.tauri.annotation.InvokeArg
import app.tauri.annotation.TauriPlugin
import app.tauri.plugin.Invoke
import app.tauri.plugin.Plugin
import kotlinx.coroutines.CoroutineScope
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.launch

/**
 * Widget data mirror.
 *
 * Home-screen widgets cannot authenticate with Firebase, so the webview
 * pushes a compact projection of tasks + habit streaks here (`push`). The
 * payload is written to `widget_data.json` in the app's files directory
 * (plain JSON — tiny, no DB needed), then every widget is told to
 * re-render from the fresh store.
 *
 * The Android widget providers read the same JSON file, which keeps
 * rendering accurate even after the app is force-killed.
 */
@TauriPlugin
class WidgetDataPlugin(activity: android.app.Activity) : Plugin(activity) {

    private val context: Context get() = activity.applicationContext
    private val store by lazy { WidgetDataStore(context) }

    @Command
    fun push(invoke: Invoke) {
        val args = invoke.parseArgs(PushArgs::class.java)
        CoroutineScope(Dispatchers.IO).launch {
            try {
                store.write(args.toPayload())
                refreshWidgets(context)
                invoke.resolve()
            } catch (error: Throwable) {
                invoke.reject(error.message ?: "Failed to write widget data", error)
            }
        }
    }

    companion object {
        /** Widget provider class names used for refresh and manifest reference. */
        val WIDGET_PROVIDERS = listOf(
            "net.todotxt.app.plugins.widgetdata.TodoWidgetProvider",
            "net.todotxt.app.plugins.widgetdata.HabitsStreaksWidgetProvider",
            "net.todotxt.app.plugins.widgetdata.HabitsWeekGridWidgetProvider",
            "net.todotxt.app.plugins.widgetdata.HabitsHeatmapWidgetProvider",
            "net.todotxt.app.plugins.widgetdata.HabitsMomentumWidgetProvider",
        )

        /** Re-renders every registered widget of the app. */
        fun refreshWidgets(context: Context) {
            val manager = AppWidgetManager.getInstance(context)
            for (className in WIDGET_PROVIDERS) {
                val component = ComponentName(context.packageName, className)
                try {
                    manager.getAppWidgetIds(component)
                } catch (error: Throwable) {
                    android.util.Log.w("WidgetData", "Refresh failed for $className", error)
                }
            }
            // `notifyAppWidgetViewDataChanged` for collection widgets is
            // called by each provider when it (re)builds its adapter, so no
            // blanket invalidation is needed here.
        }
    }
}

// ------------------------------------------------------------------
// Argument types — mirror the JS `WidgetPayload` projection
// ------------------------------------------------------------------

@InvokeArg
internal class PushTaskArgs {
    lateinit var id: Long
    lateinit var text: String
    var done: Boolean = false
    var due: String? = null
}

@InvokeArg
internal class PushHabitArgs {
    lateinit var id: String
    lateinit var name: String
    var color: String = "#888888"
    var streak: Int = 0
    var bestStreak: Int = 0
    var rate28: Int = 0
    var last30: List<Boolean> = emptyList()
    var last7: List<Boolean> = emptyList()
    var last12Weeks: List<List<Boolean>> = emptyList()
    var completedToday: Boolean = false
    var reminderTime: String? = null
}

@InvokeArg
internal class PushMomentumArgs {
    var bestStreak: Int = 0
    var bestHabitName: String = ""
    var avgRate28: Int = 0
    var habitsDoneToday: Int = 0
    var habitsTotal: Int = 0

    fun toMomentum(): WidgetMomentum = WidgetMomentum(
        bestStreak = bestStreak,
        bestHabitName = bestHabitName,
        avgRate28 = avgRate28,
        habitsDoneToday = habitsDoneToday,
        habitsTotal = habitsTotal,
    )
}

@InvokeArg
internal class PushArgs {
    var date: String = ""
    lateinit var tasks: List<PushTaskArgs>
    lateinit var habits: List<PushHabitArgs>
    var momentum: PushMomentumArgs = PushMomentumArgs()

    fun toPayload(): WidgetPayload = WidgetPayload(
        momentum = momentum.toMomentum(),
        date = date,
        tasks = tasks.map { task ->
            WidgetTask(id = task.id, text = task.text, done = task.done, due = task.due)
        },
        habits = habits.map { habit ->
            WidgetHabit(
                id = habit.id,
                name = habit.name,
                color = habit.color,
                streak = habit.streak,
                bestStreak = habit.bestStreak,
                rate28 = habit.rate28,
                last30 = habit.last30,
                last7 = habit.last7,
                last12Weeks = habit.last12Weeks,
                completedToday = habit.completedToday,
                reminderTime = habit.reminderTime,
            )
        },
    )
}
