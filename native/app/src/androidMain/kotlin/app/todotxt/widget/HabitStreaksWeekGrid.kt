package app.todotxt.widget

import android.content.Context
import androidx.compose.runtime.collectAsState
import androidx.compose.runtime.getValue
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.glance.GlanceId
import androidx.glance.GlanceModifier
import androidx.glance.action.actionStartActivity
import androidx.glance.action.clickable
import androidx.glance.appwidget.GlanceAppWidget
import androidx.glance.appwidget.GlanceAppWidgetReceiver
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

// ─── Habit Streaks Widget (2x1 hero / resizable list) ─────────────────────

class HabitStreaksWidget : GlanceAppWidget() {
    override suspend fun provideGlance(context: Context, id: GlanceId) {
        provideContent {
            val habits by Storage.habits.collectAsState()
            val payload = WidgetData.project(tasks = emptyList(), habits = habits)
            val momentum = payload.momentum

            Column(
                modifier = GlanceModifier
                    .fillMaxSize()
                    .background(WidgetTheme.provider(WidgetTheme.Surface))
                    .padding(10.dp)
                    .clickable(actionStartActivity<MainActivity>())
            ) {
                Text(
                    text = if (momentum.bestStreak > 0) "🔥 ${momentum.bestStreak} day streak" else "No active streak",
                    style = TextStyle(
                        fontWeight = FontWeight.Bold,
                        fontSize = 18.sp,
                        color = ColorProvider(WidgetTheme.White),
                    ),
                    maxLines = 1,
                )
                Spacer(GlanceModifier.height(4.dp))
                Text(
                    text = "${momentum.habitsTotal} habits · ${momentum.habitsDoneToday} done today · ${momentum.avgRate28}% avg",
                    style = TextStyle(color = WidgetTheme.provider(WidgetTheme.TextDim), fontSize = 12.sp),
                    maxLines = 1,
                )
                Spacer(GlanceModifier.height(6.dp))

                payload.habits.take(3).forEach { habit ->
                    Row(
                        modifier = GlanceModifier
                            .fillMaxWidth()
                            .padding(vertical = 2.dp),
                        verticalAlignment = Alignment.CenterVertically,
                    ) {
                        Box(
                            modifier = GlanceModifier
                                .size(8.dp)
                                .background(WidgetTheme.provider(WidgetTheme.habitColor(habit.color))),
                        ) {}
                        Spacer(GlanceModifier.width(6.dp))
                        Text(
                            text = habit.name,
                            modifier = GlanceModifier.defaultWeight(),
                            style = TextStyle(color = WidgetTheme.provider(WidgetTheme.TextPrimary)),
                            maxLines = 1,
                        )
                        Text(
                            text = "${habit.streak}d · best ${habit.bestStreak}d",
                            style = TextStyle(color = WidgetTheme.provider(WidgetTheme.TextDim), fontSize = 12.sp),
                        )
                    }
                }
            }
        }
    }
}

class HabitStreaksWidgetReceiver : GlanceAppWidgetReceiver() {
    override val glanceAppWidget: GlanceAppWidget = HabitStreaksWidget()
}

// ─── Habit Week Grid Widget (4x2): rows x 12 weeks ────────────────────────

class HabitWeekGridWidget : GlanceAppWidget() {
    override suspend fun provideGlance(context: Context, id: GlanceId) {
        provideContent {
            val habits by Storage.habits.collectAsState()
            val payload = WidgetData.project(tasks = emptyList(), habits = habits)
            val rows = payload.habits.take(5)

            Column(
                modifier = GlanceModifier
                    .fillMaxSize()
                    .background(WidgetTheme.provider(WidgetTheme.Surface))
                    .padding(8.dp)
                    .clickable(actionStartActivity<MainActivity>())
            ) {
                Text(text = "Last 12 Weeks", style = TextStyle(fontWeight = FontWeight.Bold, fontSize = 14.sp))
                Spacer(GlanceModifier.height(6.dp))

                if (rows.isEmpty()) {
                    Text(
                        text = "No active habits yet",
                        style = TextStyle(color = WidgetTheme.provider(WidgetTheme.TextDim)),
                    )
                } else {
                    rows.forEach { habit ->
                        Row(
                            modifier = GlanceModifier.fillMaxWidth().padding(vertical = 2.dp),
                            verticalAlignment = Alignment.CenterVertically,
                        ) {
                            Box(
                                modifier = GlanceModifier
                                    .size(10.dp)
                                    .background(WidgetTheme.provider(WidgetTheme.habitColor(habit.color))),
                            ) {}
                            Spacer(GlanceModifier.width(6.dp))
                            Row(modifier = GlanceModifier.defaultWeight()) {
                                habit.last12Weeks.forEach { week ->
                                    Column {
                                        week.forEach { done ->
                                            Box(
                                                modifier = GlanceModifier
                                                    .size(7.dp)
                                                    .padding(0.5.dp)
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
                            }
                        }
                    }
                }
            }
        }
    }
}

class HabitWeekGridWidgetReceiver : GlanceAppWidgetReceiver() {
    override val glanceAppWidget: GlanceAppWidget = HabitWeekGridWidget()
}
