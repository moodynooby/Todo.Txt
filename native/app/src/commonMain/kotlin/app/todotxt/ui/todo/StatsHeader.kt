package app.todotxt.ui.todo

import androidx.compose.foundation.Canvas
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.remember
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.geometry.CornerRadius
import androidx.compose.ui.geometry.Offset
import androidx.compose.ui.geometry.Size
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.drawscope.DrawScope
import androidx.compose.ui.graphics.drawscope.Stroke
import androidx.compose.ui.unit.dp
import app.todotxt.domain.ParsedTodoContent
import kotlinx.datetime.Clock
import kotlinx.datetime.DatePeriod
import kotlinx.datetime.LocalDate
import kotlinx.datetime.TimeZone
import kotlinx.datetime.minus
import kotlinx.datetime.plus
import kotlinx.datetime.toLocalDateTime

/**
 * Pet-side stats strip: a compact "X of Y done today" progress ring next to a
 * 13-week contribution heatmap (GitHub-style). Both are pure Canvas drawing —
 * no chart library required.
 *
 * The heatmap shades days by the number of tasks completed on that day,
 * computed by matching completed todo.txt line completions (`x yyyy-mm-dd`)
 * against the task list's `completedDate` where available.
 */
@Composable
fun StatsHeader(
    parsed: ParsedTodoContent,
    modifier: Modifier = Modifier,
) {
    val today = remember { Clock.System.now().toLocalDateTime(TimeZone.currentSystemDefault()).date }
    val total = parsed.tasks.size
    val done = parsed.tasks.count { it.completed }

    // Completion counts per day for the last 13 weeks (91 days).
    val daily = remember(today, total) { dailyCompletionCounts(parsed, today) }

    val surface = MaterialTheme.colorScheme.surfaceVariant
    val primary = MaterialTheme.colorScheme.primary

    Row(
        modifier = modifier.fillMaxWidth().padding(vertical = 6.dp),
        verticalAlignment = Alignment.CenterVertically,
        horizontalArrangement = Arrangement.spacedBy(12.dp),
    ) {
        // Done-today progress ring.
        Box(contentAlignment = Alignment.Center) {
            Canvas(modifier = Modifier.size(44.dp)) {
                drawArc(
                    color = surface,
                    startAngle = -90f,
                    sweepAngle = 360f,
                    useCenter = false,
                    style = Stroke(width = 4.dp.toPx()),
                )
                if (total > 0) {
                    drawArc(
                        color = primary,
                        startAngle = -90f,
                        sweepAngle = (done.toFloat() / total * 360f),
                        useCenter = false,
                        style = Stroke(width = 4.dp.toPx()),
                    )
                }
            }
            Text(
                "$done/$total",
                style = MaterialTheme.typography.labelSmall,
            )
        }

        // Contribution heatmap — 13 columns (weeks) x 7 rows (days).
        Box(modifier = Modifier.fillMaxWidth().height(84.dp)) {
            Canvas(modifier = Modifier.fillMaxWidth()) {
                val cell = 10.dp.toPx()
                val gap = 3.dp.toPx()
                val cols = 13
                val rows = 7
                val startX = size.width - cols * (cell + gap)
                for (col in 0 until cols) {
                    for (row in 0 until rows) {
                        // Map (col, row) -> day index: day 0 = oldest (top-left),
                        // newest day at bottom-right.
                        val dayIndex = col * rows + row
                        val date = today.minus(DatePeriod(days = 90 - dayIndex))
                        val count = daily[date] ?: 0
                        drawRoundedRect(date, count, primary, col, row, cell, gap, startX)
                    }
                }
            }
        }
    }
}

private fun DrawScope.drawRoundedRect(
    date: LocalDate,
    count: Int,
    accent: Color,
    col: Int,
    row: Int,
    cell: Float,
    gap: Float,
    startX: Float,
) {
    val tints = tintFor(count)
    if (tints == null) return
    val x = startX + col * (cell + gap)
    val y = row * (cell + gap)
    drawRoundRect(
        color = tints,
        topLeft = Offset(x, y),
        size = Size(cell, cell),
        cornerRadius = CornerRadius(cell * 0.22f, cell * 0.22f),
    )
}

/** GitHub-style tint ladder keyed off completion count. */
private fun tintFor(count: Int): Color? {
    return when {
        count <= 0 -> null
        count == 1 -> Color(0xFF0E4429)
        count <= 3 -> Color(0xFF006D32)
        count <= 6 -> Color(0xFF26A641)
        else -> Color(0xFF39D353)
    }
}

/** Count completed tasks per day over the trailing 91 days. */
private fun dailyCompletionCounts(
    parsed: ParsedTodoContent,
    today: LocalDate,
): Map<LocalDate, Int> {
    val start = today.minus(DatePeriod(days = 90))
    val counts = HashMap<LocalDate, Int>()
    parsed.tasks.forEach { task ->
        if (!task.completed) return@forEach
        val date = completedDateOf(task) ?: return@forEach
        if (date < start || date > today) return@forEach
        counts[date] = (counts[date] ?: 0) + 1
    }
    return counts
}

/**
 * Extract the completion date by parsing the todo.txt completion prefix
 * (`x 2026-08-18` or `- [x] 2026-08-18`) off the raw line. The Task model
 * carries no dates, so the raw text is the only authoritative source.
 */
private fun completedDateOf(task: app.todotxt.domain.Task): LocalDate? {
    val raw = task.raw.trim()
    // Standard todo.txt: `x 2026-08-18 2026-08-01 …` — date right after `x `.
    val afterX = raw.substringAfter("x ", raw)
    val dateToken = afterX.take(10)
    if (dateToken.length == 10 && dateToken[4] == '-' && dateToken[7] == '-') {
        return LocalDate.parse(dateToken)
    }
    // Checkbox form: `- [x] 2026-08-18 …` — first date after the marker.
    val afterMarker = raw.substringAfter("] ", raw)
    if (afterMarker.isNotEmpty()) {
        val token = afterMarker.take(10)
        if (token.length == 10 && token[4] == '-' && token[7] == '-') {
            return LocalDate.parse(token)
        }
    }
    return null
}
