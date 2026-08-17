package app.todotxt.widget

import android.content.Context
import androidx.compose.runtime.collectAsState
import androidx.compose.runtime.getValue
import androidx.glance.GlanceId
import androidx.glance.GlanceModifier
import androidx.glance.appwidget.GlanceAppWidget
import androidx.glance.appwidget.GlanceAppWidgetReceiver
import androidx.glance.appwidget.provideContent
import androidx.glance.layout.Column
import androidx.glance.layout.fillMaxSize
import androidx.glance.layout.padding
import androidx.glance.text.Text
import androidx.glance.text.TextStyle
import androidx.glance.unit.ColorProvider
import androidx.glance.text.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.glance.action.actionStartActivity
import androidx.glance.action.clickable
import androidx.glance.appwidget.lazy.LazyColumn
import androidx.glance.appwidget.lazy.items
import androidx.glance.background
import androidx.glance.layout.Row
import androidx.glance.layout.Spacer
import androidx.glance.layout.fillMaxWidth
import androidx.glance.layout.height
import app.todotxt.MainActivity
import app.todotxt.domain.HabitUtils
import app.todotxt.persistence.Storage

class HabitsWidget : GlanceAppWidget() {
    override suspend fun provideGlance(context: Context, id: GlanceId) {
        provideContent {
            val habits by Storage.habits.collectAsState()
            val activeHabits = habits.filter { !it.archived }

            Column(
                modifier = GlanceModifier
                    .fillMaxSize()
                    .background(ColorProvider(androidx.compose.ui.graphics.Color.White))
                    .padding(8.dp)
                    .clickable(actionStartActivity<MainActivity>())
            ) {
                Text(
                    text = "Habits",
                    style = TextStyle(
                        fontWeight = FontWeight.Bold,
                        fontSize = 16.sp
                    )
                )
                Spacer(GlanceModifier.height(4.dp))
                if (activeHabits.isEmpty()) {
                    Text(text = "No active habits")
                } else {
                    LazyColumn {
                        items(activeHabits) { habit ->
                            val streak = HabitUtils.getHabitStreak(habit)
                            Row(modifier = GlanceModifier.fillMaxWidth().padding(vertical = 2.dp)) {
                                Text(text = habit.name, modifier = GlanceModifier.defaultWeight())
                                Text(
                                    text = "${streak}d",
                                    style = TextStyle(fontWeight = FontWeight.Bold)
                                )
                            }
                        }
                    }
                }
            }
        }
    }
}

class HabitsWidgetReceiver : GlanceAppWidgetReceiver() {
    override val glanceAppWidget: GlanceAppWidget = HabitsWidget()
}
