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
import app.todotxt.domain.TodoParser
import app.todotxt.persistence.Storage

class TodoWidget : GlanceAppWidget() {
    override suspend fun provideGlance(context: Context, id: GlanceId) {
        provideContent {
            val content by Storage.content.collectAsState()
            val parsed = TodoParser.parseTodoContent(content)
            val tasks = parsed.tasks.filter { !it.completed }.take(5)

            Column(
                modifier = GlanceModifier
                    .fillMaxSize()
                    .background(ColorProvider(androidx.compose.ui.graphics.Color.White))
                    .padding(8.dp)
                    .clickable(actionStartActivity<MainActivity>())
            ) {
                Text(
                    text = "Todo.Txt",
                    style = TextStyle(
                        fontWeight = FontWeight.Bold,
                        fontSize = 16.sp
                    )
                )
                Spacer(GlanceModifier.height(4.dp))
                if (tasks.isEmpty()) {
                    Text(text = "All caught up!")
                } else {
                    LazyColumn {
                        items(tasks) { task ->
                            Row(modifier = GlanceModifier.fillMaxWidth().padding(vertical = 2.dp)) {
                                Text(text = "• ", style = TextStyle(fontWeight = FontWeight.Bold))
                                Text(text = task.text, maxLines = 1)
                            }
                        }
                    }
                }
            }
        }
    }
}

class TodoWidgetReceiver : GlanceAppWidgetReceiver() {
    override val glanceAppWidget: GlanceAppWidget = TodoWidget()
}
