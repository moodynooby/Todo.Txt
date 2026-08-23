package app.todotxt.widget

import android.content.Context
import androidx.glance.appwidget.updateAll
import app.todotxt.persistence.Storage
import kotlinx.coroutines.CoroutineScope
import kotlinx.coroutines.FlowPreview
import kotlinx.coroutines.Job
import kotlinx.coroutines.flow.combine
import kotlinx.coroutines.flow.debounce
import kotlinx.coroutines.flow.distinctUntilChanged
import kotlinx.coroutines.launch

/**
 * Single refresh path for every widget. Feature code should call
 * [refreshAll] (or let the flow observer handle it) instead of poking
 * individual receivers — mirrors the Tauri shell's `refreshWidgets`.
 */
object WidgetRefresher {

    private fun widgets() = listOf(
        TodoWidget(),
        HabitsWidget(),
        HabitMomentumWidget(),
        HabitHeatmapWidget(),
        HabitQuickCheckWidget(),
        HabitStreaksWidget(),
        HabitWeekGridWidget(),
    )

    suspend fun refreshAll(context: Context) {
        widgets().forEach { widget ->
            runCatching { widget.updateAll(context) }
        }
    }

    /**
     * Live-updates every widget whenever habits or the todo document change.
     * Started once from [app.todotxt.TodoTxtApp].
     */
    @OptIn(FlowPreview::class)
    fun observe(context: Context, scope: CoroutineScope): Job = scope.launch {
        combine(Storage.habits, Storage.content) { habits, content -> habits to content }
            .distinctUntilChanged()
            .debounce(500)
            .collect { refreshAll(context) }
    }
}
