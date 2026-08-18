package app.todotxt.ui.draw

import androidx.compose.foundation.Canvas
import androidx.compose.foundation.border
import androidx.compose.foundation.background
import androidx.compose.foundation.gestures.awaitFirstDown
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.fillMaxHeight
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.layout.width
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.material3.Button
import androidx.compose.material3.Icon
import androidx.compose.material3.IconButton
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Slider
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.LaunchedEffect
import androidx.compose.runtime.collectAsState
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateListOf
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.geometry.Offset
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.Path
import androidx.compose.ui.graphics.StrokeCap
import androidx.compose.ui.graphics.drawscope.Stroke
import androidx.compose.ui.graphics.toArgb
import androidx.compose.ui.input.pointer.PointerEventType
import androidx.compose.ui.input.pointer.pointerInput
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Clear
import androidx.compose.material.icons.filled.Edit
import androidx.compose.material.icons.filled.Refresh
import androidx.compose.material.icons.filled.Share
import androidx.compose.material.icons.filled.Star

import app.todotxt.domain.Drawing
import app.todotxt.domain.DrawingPoint
import app.todotxt.domain.DrawingStroke
import app.todotxt.persistence.Storage

/** Tool modes for the Excalidraw-style vector whiteboard. */
enum class DrawTool { PEN, LINE, RECT, CIRCLE, TRIANGLE, ARROW }

/**
 * Drawing workspace — an Excalidraw-like vector whiteboard implemented
 * natively on Compose Canvas (no external dependency; our `DrawingStroke`
 * model persists vector data on both Android and Desktop).
 *
 * Tools: freehand pen, straight line, rectangle, circle, triangle, arrow.
 * Each completed shape is an immutable stroke; undo/redo history and an
 * in-flight preview stroke keep the model pure and restorable.
 */
private data class ToolStroke(
    val tool: DrawTool,
    val points: List<Offset>,
    val color: Color,
    val thickness: Float,
)

@Composable
fun DrawPage() {
    val drawings by Storage.drawings.collectAsState()
    val history = remember { mutableStateListOf<ToolStroke>() }
    val redoStack = remember { mutableStateListOf<ToolStroke>() }
    val pending = remember { mutableStateOf<ToolStroke?>(null) }

    val color = remember { mutableStateOf(Color.Black) }
    val thickness = remember { mutableStateOf(4f) }
    val tool = remember { mutableStateOf(DrawTool.PEN) }

    fun snapshot() {
        val drawing = Drawing(
            id = "default",
            name = "My Sketch",
            strokes = history.map { s ->
                DrawingStroke(
                    points = s.points.map { DrawingPoint(it.x, it.y) },
                    colorHex = "#%08x".format(s.color.toArgb()),
                    thickness = s.thickness,
                )
            },
        )
        Storage.updateDrawings { listOf(drawing) }
    }

    // Restore last saved sketch once
    LaunchedEffect(drawings) {
        if (history.isEmpty() && drawings.isNotEmpty()) {
            val last = drawings.last()
            history.addAll(last.strokes.map { ds ->
                ToolStroke(
                    tool = DrawTool.PEN,
                    points = ds.points.map { Offset(it.x, it.y) },
                    color = Color(ds.colorHex.removePrefix("#").toLong(16) or 0xFF000000),
                    thickness = ds.thickness,
                )
            })
        }
    }

    val palette = listOf(
        Color.Black, Color(0xFF173D35), Color(0xFF2F6F61), Color(0xFFD9784F),
        Color(0xFFB55B33), Color(0xFF1976D2), Color(0xFF7B1FA2), Color(0xFF455A64),
    )

    Column(Modifier.fillMaxSize().padding(16.dp)) {
        Text(
            "Draw",
            style = MaterialTheme.typography.headlineMedium,
            fontWeight = FontWeight.Bold,
            modifier = Modifier.padding(bottom = 8.dp),
        )

        // Tool row
        Row(
            modifier = Modifier.fillMaxWidth().padding(bottom = 6.dp),
            horizontalArrangement = Arrangement.spacedBy(6.dp),
            verticalAlignment = Alignment.CenterVertically,
        ) {
            toolRowButton(tool, DrawTool.PEN, Icons.Filled.Edit, "Pen")
            toolRowButton(tool, DrawTool.LINE, Icons.Filled.Clear, "Line")
            toolRowButton(tool, DrawTool.RECT, Icons.Filled.Share, "Rect")
            toolRowButton(tool, DrawTool.CIRCLE, Icons.Filled.Star, "Circle")
            toolRowButton(tool, DrawTool.TRIANGLE, Icons.Filled.Clear, "Tri")
            toolRowButton(tool, DrawTool.ARROW, Icons.Filled.Clear, "Arrow")
            Spacer(modifier = Modifier.fillMaxWidth().height(30.dp))
            IconButton(onClick = {
                history.removeLastOrNull()?.let { redoStack.add(it) }
                snapshot()
            }, enabled = history.isNotEmpty()) {
                Icon(Icons.Filled.Refresh, contentDescription = "Undo")
            }
            IconButton(onClick = {
                redoStack.removeLastOrNull()?.let { history.add(it) }
                snapshot()
            }, enabled = redoStack.isNotEmpty()) {
                Text("↷", modifier = Modifier.size(20.dp))
            }
            IconButton(onClick = { history.clear(); redoStack.clear(); pending.value = null; snapshot() }) {
                Icon(Icons.Filled.Clear, contentDescription = "Clear")
            }
            Button(onClick = { snapshot() }) {
                Text("Save")
            }
        }

        // Color + width row
        Row(
            modifier = Modifier.fillMaxWidth().padding(bottom = 8.dp),
            verticalAlignment = Alignment.CenterVertically,
            horizontalArrangement = Arrangement.spacedBy(6.dp),
        ) {
            palette.forEach { paletteColor ->
                Box(
                    Modifier
                        .size(30.dp)
                        .clip(CircleShape)
                        .background(paletteColor)
                        .border(
                            2.dp,
                            if (paletteColor == color.value) MaterialTheme.colorScheme.onSurface
                            else Color.Transparent,
                            CircleShape,
                        )
                        .pointerInput(paletteColor) {
                            awaitPointerEventScope {
                                awaitFirstDown(requireUnconsumed = false)
                                color.value = paletteColor
                            }
                        },
                )
            }
            Spacer(modifier = Modifier.fillMaxWidth().height(30.dp))
            Slider(
                value = thickness.value,
                onValueChange = { thickness.value = it },
                valueRange = 2f..24f,
                modifier = Modifier.weight(1f).width(180.dp).padding(horizontal = 8.dp),
            )
            Text("%.0f".format(thickness.value))
        }

        // Whiteboard canvas
        Box(
            Modifier
                .fillMaxWidth()
                .fillMaxHeight()
                .border(1.dp, MaterialTheme.colorScheme.outline)
                .pointerInput(tool.value, color.value, thickness.value) {
                    awaitPointerEventScope {
                        while (true) {
                            val down = awaitFirstDown(requireUnconsumed = false)
                            val stroke = ToolStroke(tool.value, listOf(down.position), color.value, thickness.value)
                            pending.value = stroke
                            while (true) {
                                val event = awaitPointerEvent()
                                if (event.type == PointerEventType.Release ||
                                    event.type == PointerEventType.Exit) {
                                    break
                                }
                                if (event.type == PointerEventType.Move) {
                                    val pos: Offset =
                                        event.changes.firstOrNull()?.position ?: Offset.Zero
                                    pending.value = stroke.copy(
                                        points = if (tool.value == DrawTool.PEN) stroke.points + pos
                                        else listOf(stroke.points.first(), pos),
                                    )
                                }
                            }
                            history.add(stroke.copy(points = pending.value?.points ?: stroke.points))
                            redoStack.clear()
                            pending.value = null
                            snapshot()
                        }
                    }
                },
        ) {
            Canvas(modifier = Modifier.fillMaxSize()) {
                history.forEach { s -> drawToolStroke(s) }
                pending.value?.let { s -> drawToolStroke(s) }
            }
        }
    }
}

@Composable
private fun toolRowButton(
    tool: androidx.compose.runtime.MutableState<DrawTool>,
    target: DrawTool,
    icon: androidx.compose.ui.graphics.vector.ImageVector,
    label: String,
) {
    val active = tool.value == target
    Button(
        onClick = { tool.value = target },
        enabled = !active,
        modifier = Modifier.height(34.dp),
    ) {
        Icon(icon, contentDescription = label, modifier = Modifier.size(16.dp))
        Text(" $label")
    }
}



private fun androidx.compose.ui.graphics.drawscope.DrawScope.drawToolStroke(s: ToolStroke) {
    if (s.points.isEmpty()) return
    when (s.tool) {
        DrawTool.PEN -> {
            if (s.points.size > 1) {
                val path = Path().apply {
                    moveTo(s.points.first().x, s.points.first().y)
                    s.points.drop(1).forEach { pos -> lineTo(pos.x, pos.y) }
                }
                drawPath(path, s.color, style = Stroke(s.thickness, cap = StrokeCap.Round))
            }
        }
        DrawTool.LINE -> {
            if (s.points.size == 2) {
                drawLine(s.color, s.points[0], s.points[1], s.thickness, cap = StrokeCap.Round)
            }
        }
        DrawTool.RECT -> {
            if (s.points.size == 2) {
                val start = s.points[0]; val end = s.points[1]
                val left = minOf(start.x, end.x); val top = minOf(start.y, end.y)
                val w = kotlin.math.abs(end.x - start.x); val h = kotlin.math.abs(end.y - start.y)
                drawRect(
                    color = s.color,
                    topLeft = Offset(left, top),
                    size = androidx.compose.ui.geometry.Size(w, h),
                    style = Stroke(s.thickness, cap = StrokeCap.Round),
                )
            }
        }
        DrawTool.CIRCLE -> {
            if (s.points.size == 2) {
                val start = s.points[0]; val end = s.points[1]
                val cx = (start.x + end.x) / 2f; val cy = (start.y + end.y) / 2f
                val r = kotlin.math.hypot(end.x - start.x, end.y - start.y) / 2f
                drawCircle(s.color, radius = r, center = Offset(cx, cy), style = Stroke(s.thickness, cap = StrokeCap.Round))
            }
        }
        DrawTool.TRIANGLE -> {
            if (s.points.size == 2) {
                val start = s.points[0]; val end = s.points[1]
                val path = Path().apply {
                    moveTo((start.x + end.x) / 2f, start.y)
                    lineTo(start.x, end.y)
                    lineTo(end.x, end.y)
                    close()
                }
                drawPath(path, s.color, style = Stroke(s.thickness, cap = StrokeCap.Round))
            }
        }
        DrawTool.ARROW -> {
            if (s.points.size == 2) {
                val start = s.points[0]; val end = s.points[1]
                drawLine(s.color, start, end, s.thickness, cap = StrokeCap.Round)
                val angle = kotlin.math.atan2(end.y - start.y, end.x - start.x)
                val headLen = s.thickness * 6f
                val arrowPath = Path().apply {
                    moveTo(end.x, end.y)
                    lineTo(
                        end.x - headLen * kotlin.math.cos(angle - 0.5f),
                        end.y - headLen * kotlin.math.sin(angle - 0.5f),
                    )
                    moveTo(end.x, end.y)
                    lineTo(
                        end.x - headLen * kotlin.math.cos(angle + 0.5f),
                        end.y - headLen * kotlin.math.sin(angle + 0.5f),
                    )
                }
                drawPath(arrowPath, s.color, style = Stroke(s.thickness, cap = StrokeCap.Round))
            }
        }
    }
}
