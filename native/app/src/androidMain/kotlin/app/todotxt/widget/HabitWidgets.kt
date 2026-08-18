package app.todotxt.widget

import android.content.Context
import androidx.compose.runtime.collectAsState
import androidx.compose.runtime.getValue
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.glance.GlanceId
import androidx.glance.GlanceModifier
import androidx.glance.action.actionStartActivity
import androidx.glance.action.clickable
import androidx.glance.appwidget.action.actionRunCallback
import androidx.glance.appwidget.GlanceAppWidget
import androidx.glance.appwidget.GlanceAppWidgetReceiver
import androidx.glance.appwidget.provideContent
import androidx.glance.background
import androidx.glance.color.ColorProvider
import androidx.glance.layout.Alignment
import androidx.glance.layout.Box
import androidx.glance.layout.Column
import androidx.glance.layout.ContentScale
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
import app.todotxt.core.HabitUtils
import app.todotxt.persistence.Storage

// ─── Shared helpers ───────────────────────────────────────────────────────

private fun Color.toGlance() = ColorProvider(this)

private fun habitColorFromHex(hex: String): Color {
    return try {
        val r = hex.substring(1, 3).toInt(16)
        val g = hex.substring(3, 5).toInt(16)
        val b = hex.substring(5, 7).toInt(16)
        Color(r, g, b, 255)
    } catch (_: Exception) {
        Color(47, 111, 97, 255) // evergreen fallback
    }
}

// ─── Habit Momentum Widget (4x1 or 4x2) ───────────────────────────────────

class HabitMomentumWidget : GlanceAppWidget() {
    override suspend fun provideGlance(context: Context, id: GlanceId) {
        provideContent {
            val habits by Storage.habits.collectAsState()
            val activeHabits = habits.filter { !it.archived }.take(4)
            val today = HabitUtils.today()

            Column(
                modifier = GlanceModifier
                    .fillMaxSize()
                    .background(ColorProvider(Color(0xFF1A1A2E)))
                    .padding(12.dp)
                    .clickable(actionStartActivity<MainActivity>())
            ) {
                Row(
                    modifier = GlanceModifier.fillMaxWidth(),
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    Text(
                        text = "Habit Momentum",
                        style = TextStyle(
                            fontWeight = FontWeight.Bold,
                            fontSize = 14.sp
                        )
                    )
                }
                Spacer(GlanceModifier.height(8.dp))

                activeHabits.forEach { habit ->
                    val streak = HabitUtils.getHabitStreak(habit)
                    val isDoneToday = habit.completedDates.contains(today)
                    val color = habitColorFromHex(habit.color.hex)

                    Row(
                        modifier = GlanceModifier
                            .fillMaxWidth()
                            .padding(vertical = 4.dp),
                        verticalAlignment = Alignment.CenterVertically
                    ) {
                        // Checkbox circle
                        Box(
                            modifier = GlanceModifier
                                .size(24.dp)
                                .background(
                                    if (isDoneToday) color.toGlance()
                                    else ColorProvider(Color(0xFF333355))
                                ),
                            contentAlignment = Alignment.Center
                        ) {
                            if (isDoneToday) {
                                Text(text = "✓", style = TextStyle(color = ColorProvider(Color.White)))
                            }
                        }
                        Spacer(GlanceModifier.width(8.dp))
                        Text(
                            text = habit.name,
                            modifier = GlanceModifier.defaultWeight(),
                            style = TextStyle(color = ColorProvider(Color(0xFFE0E0E0)))
                        )
                        Text(
                            text = "🔥$streak",
                            style = TextStyle(
                                fontWeight = FontWeight.Bold,
                                fontSize = 14.sp
                            )
                        )
                    }
                }

                if (activeHabits.isEmpty()) {
                    Text(
                        text = "No active habits — start building routines!",
                        style = TextStyle(color = ColorProvider(Color(0xFF888899)))
                    )
                }
            }
        }
    }
}

class HabitMomentumWidgetReceiver : GlanceAppWidgetReceiver() {
    override val glanceAppWidget: GlanceAppWidget = HabitMomentumWidget()
}

// ─── Habit Heatmap Widget (4x2) ───────────────────────────────────────────

class HabitHeatmapWidget : GlanceAppWidget() {
    override suspend fun provideGlance(context: Context, id: GlanceId) {
        provideContent {
            val habits by Storage.habits.collectAsState()
            val activeHabits = habits.filter { !it.archived }

            Column(
                modifier = GlanceModifier
                    .fillMaxSize()
                    .background(ColorProvider(Color(0xFF1A1A2E)))
                    .padding(8.dp)
                    .clickable(actionStartActivity<MainActivity>())
            ) {
                Text(
                    text = "Habit Heatmap (30d)",
                    style = TextStyle(
                        fontWeight = FontWeight.Bold,
                        fontSize = 14.sp
                    )
                )
                Spacer(GlanceModifier.height(8.dp))

                // Show the first habit's heatmap as a mini grid
                if (activeHabits.isNotEmpty()) {
                    val habit = activeHabits.first()
                    val heatmap = HabitUtils.getHeatmap(habit, weeks = 4) // 4 weeks x 7 days
                    
                    heatmap.forEach { week ->
                        Row(modifier = GlanceModifier.fillMaxWidth()) {
                            week.forEach { date ->
                                val isCompleted = date != null && habit.completedDates.contains(date)
                                Box(
                                    modifier = GlanceModifier
                                        .size(10.dp)
                                        .background(
                                            if (date == null) ColorProvider(Color.Transparent)
                                            else if (isCompleted) ColorProvider(Color(0xFF2F6F61))
                                            else ColorProvider(Color(0xFF2A2A3E))
                                        )
                                        .padding(1.dp),
                                    contentAlignment = Alignment.Center
                                ) {
                                    Text(text = "", style = TextStyle(fontSize = 1.sp))
                                }
                            }
                        }
                    }
                    Spacer(GlanceModifier.height(4.dp))
                    Text(
                        text = "${habit.name}: ${HabitUtils.getCompletionRate(habit)}% complete",
                        style = TextStyle(
                            color = ColorProvider(Color(0xFF888899)),
                            fontSize = 14.sp
                        )
                    )
                } else {
                    Text(
                        text = "Add habits to see your heatmap",
                        style = TextStyle(color = ColorProvider(Color(0xFF888899)))
                    )
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
            val activeHabits = habits.filter { !it.archived }
            val today = HabitUtils.today()

            Column(
                modifier = GlanceModifier
                    .fillMaxSize()
                    .background(ColorProvider(Color(0xFF1A1A2E)))
                    .padding(12.dp)
                    .clickable(actionStartActivity<MainActivity>())
            ) {
                Text(
                    text = "Quick Check",
                    style = TextStyle(
                        fontWeight = FontWeight.Bold,
                        fontSize = 14.sp
                    )
                )
                Spacer(GlanceModifier.height(6.dp))

                activeHabits.take(3).forEach { habit ->
                    val isDoneToday = habit.completedDates.contains(today)
                    if (!isDoneToday) {
                        Row(
                            modifier = GlanceModifier
                                .fillMaxWidth()
                                .padding(vertical = 3.dp)
                                .clickable(actionRunCallback<HabitToggleCallback>()),
                            verticalAlignment = Alignment.CenterVertically
                        ) {
                        Box(
                            modifier = GlanceModifier
                                .size(20.dp)
                                .background(ColorProvider(Color(0xFF333355))),
                            contentAlignment = Alignment.Center
                        ) {
                            Text(text = "○", style = TextStyle(fontSize = 12.sp))
                        }
                            Spacer(GlanceModifier.width(8.dp))
                            Text(
                                text = habit.name,
                                style = TextStyle(color = ColorProvider(Color(0xFFE0E0E0))),
                                maxLines = 1
                            )
                        }
                    }
                }

                val allDone = activeHabits.take(3).all { it.completedDates.contains(today) }
                if (allDone) {
                    Text(
                        text = "All done for today! 🎉",
                        style = TextStyle(color = ColorProvider(Color(0xFF2F6F61)))
                    )
                }
            }
        }
    }
}

class HabitQuickCheckWidgetReceiver : GlanceAppWidgetReceiver() {
    override val glanceAppWidget: GlanceAppWidget = HabitQuickCheckWidget()
}

// ─── Action Callback for toggling habits ──────────────────────────────────
// See HabitToggleCallback.kt
