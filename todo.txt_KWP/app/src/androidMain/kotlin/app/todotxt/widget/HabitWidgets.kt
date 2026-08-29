package app.todotxt.widget

import android.content.Context
import androidx.compose.runtime.collectAsState
import androidx.compose.runtime.getValue
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.glance.GlanceId
import androidx.glance.GlanceModifier
import androidx.glance.action.actionStartActivity
import androidx.glance.action.actionParametersOf
import androidx.glance.action.clickable
import androidx.glance.appwidget.GlanceAppWidget
import androidx.glance.appwidget.GlanceAppWidgetReceiver
import androidx.glance.appwidget.action.actionRunCallback
import androidx.glance.appwidget.provideContent
import androidx.glance.background
import androidx.glance.layout.Alignment
import androidx.glance.layout.Box
import androidx.glance.layout.Column
import androidx.glance.layout.Row
import androidx.glance.layout.Spacer
import androidx.glance.layout.fillMaxSize
import androidx.glance.layout.fillMaxWidth
import androidx.glance.layout.height
import androidx.glance.layout.padding
import androidx.glance.layout.size
import androidx.glance.layout.width
import androidx.glance.text.FontWeight
import androidx.glance.text.Text
import androidx.glance.text.TextStyle
import androidx.glance.unit.ColorProvider
import app.todotxt.MainActivity
import app.todotxt.core.WidgetData
import app.todotxt.persistence.Storage

private fun titleStyle() = TextStyle(fontWeight = FontWeight.Bold, fontSize = 14.sp)
private fun dimStyle() = TextStyle(color = WidgetTheme.provider(WidgetTheme.TextDim))

// ─── Habit Momentum Widget (4x1 / 4x2) ────────────────────────────────────

class HabitMomentumWidget : GlanceAppWidget() {
    override suspend fun provideGlance(context: Context, id: GlanceId) {
        provideContent {
            val habits by Storage.habits.collectAsState()
            val payload = WidgetData.project(tasks = emptyList(), habits = habits)
            val momentum = payload.momentum

            Column(
                modifier = GlanceModifier
                    .fillMaxSize()
                    .background(WidgetTheme.provider(WidgetTheme.Surface))
                    .padding(12.dp)
                    .clickable(actionStartActivity<MainActivity>())
            ) {
                Row(
                    modifier = GlanceModifier.fillMaxWidth(),
                    verticalAlignment = Alignment.CenterVertically,
                ) {
                    Text(text = "Habit Momentum", style = titleStyle(), modifier = GlanceModifier.defaultWeight())
                    Text(
                        text = "${momentum.habitsDoneToday}/${momentum.habitsTotal} today",
                        style = dimStyle(),
                    )
                }
                Spacer(GlanceModifier.height(8.dp))

                payload.habits.take(4).forEach { habit ->
                    Row(
                        modifier = GlanceModifier
                            .fillMaxWidth()
                            .padding(vertical = 4.dp),
                        verticalAlignment = Alignment.CenterVertically,
                    ) {
                        Box(
                            modifier = GlanceModifier
                                .size(24.dp)
                                .background(
                                    if (habit.completedToday) {
                                        WidgetTheme.provider(WidgetTheme.habitColor(habit.color))
                                    } else {
                                        WidgetTheme.provider(WidgetTheme.CellChecked)
                                    }
                                ),
                            contentAlignment = Alignment.Center,
                        ) {
                            if (habit.completedToday) {
                                Text(
                                    text = "✓",
                                    style = TextStyle(color = WidgetTheme.provider(WidgetTheme.White)),
                                )
                            }
                        }
                        Spacer(GlanceModifier.width(8.dp))
                        Text(
                            text = habit.name,
                            modifier = GlanceModifier.defaultWeight(),
                            style = TextStyle(color = WidgetTheme.provider(WidgetTheme.TextPrimary)),
                            maxLines = 1,
                        )
                        Text(
                            text = "🔥${habit.streak}",
                            style = TextStyle(fontWeight = FontWeight.Bold, fontSize = 14.sp),
                        )
                    }
                }

                if (payload.habits.isEmpty()) {
                    Text(
                        text = "No active habits — start building routines!",
                        style = dimStyle(),
                    )
                }
            }
        }
    }
}

class HabitMomentumWidgetReceiver : GlanceAppWidgetReceiver() {
    override val glanceAppWidget: GlanceAppWidget = HabitMomentumWidget()
}

// ─── Habit Heatmap Widget (4x2): 30-day completion strip ──────────────────

class HabitHeatmapWidget : GlanceAppWidget() {
    override suspend fun provideGlance(context: Context, id: GlanceId) {
        provideContent {
            val habits by Storage.habits.collectAsState()
            val payload = WidgetData.project(tasks = emptyList(), habits = habits)
            val habit = payload.habits.firstOrNull()

            Column(
                modifier = GlanceModifier
                    .fillMaxSize()
                    .background(WidgetTheme.provider(WidgetTheme.Surface))
                    .padding(8.dp)
                    .clickable(actionStartActivity<MainActivity>())
            ) {
                Text(text = "Habit Heatmap (30d)", style = titleStyle())
                Spacer(GlanceModifier.height(8.dp))

                if (habit != null) {
                    // 30 days in 3 rows x 10 columns, oldest first.
                    habit.last30.chunked(10).forEach { weekRow ->
                        Row(modifier = GlanceModifier.fillMaxWidth()) {
                            weekRow.forEach { done ->
                                Box(
                                    modifier = GlanceModifier
                                        .size(12.dp)
                                        .padding(1.dp)
                                        .background(
                                            if (done) {
                                                WidgetTheme.provider(WidgetTheme.habitColor(habit.color))
                                            } else {
                                                WidgetTheme.provider(WidgetTheme.CellIdle)
                                            }
                                        ),
                                ) {}
                            }
                        }
                    }
                    Spacer(GlanceModifier.height(4.dp))
                    Text(
                        text = "${habit.name}: ${habit.rate28}% this month · 🔥${habit.streak}",
                        style = dimStyle(),
                        maxLines = 1,
                    )
                } else {
                    Text(text = "Add habits to see your heatmap", style = dimStyle())
                }
            }
        }
    }
}

class HabitHeatmapWidgetReceiver : GlanceAppWidgetReceiver() {
    override val glanceAppWidget: GlanceAppWidget = HabitHeatmapWidget()
}

// ─── Habit Quick-Check Widget (2x1) ───────────────────────────────────────

class HabitQuickCheckWidget : GlanceAppWidget() {
    override suspend fun provideGlance(context: Context, id: GlanceId) {
        provideContent {
            val habits by Storage.habits.collectAsState()
            val payload = WidgetData.project(tasks = emptyList(), habits = habits)
            val pending = payload.habits.filter { !it.completedToday }.take(3)

            Column(
                modifier = GlanceModifier
                    .fillMaxSize()
                    .background(WidgetTheme.provider(WidgetTheme.Surface))
                    .padding(12.dp)
                    .clickable(actionStartActivity<MainActivity>())
            ) {
                Text(text = "Quick Check", style = titleStyle())
                Spacer(GlanceModifier.height(6.dp))

                pending.forEach { habit ->
                    Row(
                        modifier = GlanceModifier
                            .fillMaxWidth()
                            .padding(vertical = 3.dp)
                            .clickable(
                                actionRunCallback<HabitToggleCallback>(
                                    parameters = actionParametersOf(HabitToggleCallback.HABIT_ID to habit.id),
                                )
                            ),
                        verticalAlignment = Alignment.CenterVertically,
                    ) {
                        Box(
                            modifier = GlanceModifier
                                .size(20.dp)
                                .background(WidgetTheme.provider(WidgetTheme.CellChecked)),
                            contentAlignment = Alignment.Center,
                        ) {
                            Text(text = "○", style = TextStyle(fontSize = 12.sp))
                        }
                        Spacer(GlanceModifier.width(8.dp))
                        Text(
                            text = habit.name,
                            style = TextStyle(color = WidgetTheme.provider(WidgetTheme.TextPrimary)),
                            maxLines = 1,
                        )
                    }
                }

                if (pending.isEmpty()) {
                    Text(
                        text = if (payload.habits.isEmpty()) "No active habits" else "All done for today! 🎉",
                        style = TextStyle(color = WidgetTheme.provider(WidgetTheme.Accent)),
                    )
                }
            }
        }
    }
}

class HabitQuickCheckWidgetReceiver : GlanceAppWidgetReceiver() {
    override val glanceAppWidget: GlanceAppWidget = HabitQuickCheckWidget()
}

