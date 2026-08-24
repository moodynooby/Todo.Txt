package app.todotxt.ui.draw

import androidx.compose.foundation.Canvas
import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.clickable
import androidx.compose.foundation.gestures.awaitFirstDown
import androidx.compose.foundation.horizontalScroll
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.fillMaxHeight
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.layout.width
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Clear
import androidx.compose.material.icons.filled.Delete
import androidx.compose.material.icons.filled.Edit
import androidx.compose.material.icons.filled.Redo
import androidx.compose.material.icons.filled.Undo
import androidx.compose.material3.AlertDialog
import androidx.compose.material3.Button
import androidx.compose.material3.DropdownMenu
import androidx.compose.material3.DropdownMenuItem
import androidx.compose.material3.Icon
import androidx.compose.material3.IconButton
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.OutlinedTextField
import androidx.compose.material3.Slider
import androidx.compose.material3.Text
import androidx.compose.material3.TextButton
import androidx.compose.runtime.Composable
import androidx.compose.runtime.collectAsState
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateListOf
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.geometry.Offset
import androidx.compose.ui.geometry.Size
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.Path
import androidx.compose.ui.graphics.StrokeCap
import androidx.compose.ui.graphics.drawscope.DrawScope
import androidx.compose.ui.graphics.drawscope.Stroke
import androidx.compose.ui.input.pointer.PointerEventType
import androidx.compose.ui.input.pointer.pointerInput
import androidx.compose.ui.text.TextStyle
import androidx.compose.ui.text.drawText
import androidx.compose.ui.text.rememberTextMeasurer
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import app.todotxt.persistence.Storage
import app.todotxt.ui.PageHeader
import kotlinx.serialization.json.JsonObject
import kotlin.math.abs
import kotlin.math.min

/**
 * Drawing workspace over the SHARED `.excalidraw` v2 format — the same
 * scenes the web's Excalidraw editor produces, synced at `excalidraw/main`.
 *
 * Renders the portable subset (rectangle, ellipse, diamond, line, arrow,
 * freedraw, text) with smooth Skia strokes; unmodelled elements and fields
 * are preserved untouched on save, so nothing the web draws is lost.
 * Rendering is hand-drawn-approximate (no rough.js sketchiness) — geometry,
 * colors and stroke weights follow the spec.
 */
enum class ExTool { SELECT, RECTANGLE, ELLIPSE, DIAMOND, LINE, ARROW, PEN, TEXT }

private val EX_PALETTE = listOf(
    "#1e1e1e", "#e03131", "#2f9e44", "#1971c2", "#f08c00", "#9c36b5",
)

@Composable
fun ExcalidrawDrawPage() {
    val sceneJson by Storage.excalidrawScene.collectAsState()
    val scene = ExcalidrawScene.parse(sceneJson)

    val history = remember { mutableStateListOf<ExcalidrawScene>() }
    val redoStack = remember { mutableStateListOf<ExcalidrawScene>() }
    val pending = remember { mutableStateOf<JsonObject?>(null) }
    val selectedId = remember { mutableStateOf<String?>(null) }

    val color = remember { mutableStateOf(EX_PALETTE.first()) }
    val thickness = remember { mutableStateOf(2f) }
    val tool = remember { mutableStateOf(ExTool.PEN) }
    var toolMenuOpen by remember { mutableStateOf(false) }
    val textMeasurer = rememberTextMeasurer()
    var textDialogPoint by remember { mutableStateOf<Pair<Float, Float>?>(null) }
    var textDraft by remember { mutableStateOf("") }

    fun commit(next: ExcalidrawScene) {
        history.add(scene)
        redoStack.clear()
        Storage.updateExcalidrawScene(next.serialize())
    }

    Column(Modifier.fillMaxSize().padding(16.dp)) {
        PageHeader("Draw", modifier = Modifier.padding(bottom = 8.dp))

        Row(
            modifier = Modifier.fillMaxWidth().padding(bottom = 6.dp),
            horizontalArrangement = Arrangement.spacedBy(6.dp),
            verticalAlignment = Alignment.CenterVertically,
        ) {
            Box(modifier = Modifier.weight(1f)) {
                Button(
                    onClick = { toolMenuOpen = true },
                    modifier = Modifier.fillMaxWidth(),
                ) {
                    Icon(Icons.Filled.Edit, contentDescription = null, modifier = Modifier.size(18.dp))
                    Text("  Tool: ${tool.value.name.lowercase().replaceFirstChar { it.uppercase() }}")
                }
                DropdownMenu(expanded = toolMenuOpen, onDismissRequest = { toolMenuOpen = false }) {
                    ExTool.entries.forEach { target ->
                        DropdownMenuItem(
                            text = { Text(target.name.lowercase().replaceFirstChar { it.uppercase() }) },
                            onClick = {
                                tool.value = target
                                selectedId.value = null
                                toolMenuOpen = false
                            },
                        )
                    }
                }
            }
            IconButton(
                onClick = {
                    val previous = history.removeLastOrNull() ?: return@IconButton
                    redoStack.add(scene)
                    Storage.updateExcalidrawScene(previous.serialize())
                },
                enabled = history.isNotEmpty(),
            ) { Icon(Icons.Filled.Undo, contentDescription = "Undo") }
            IconButton(
                onClick = {
                    val next = redoStack.removeLastOrNull() ?: return@IconButton
                    history.add(scene)
                    Storage.updateExcalidrawScene(next.serialize())
                },
                enabled = redoStack.isNotEmpty(),
            ) { Icon(Icons.Filled.Redo, contentDescription = "Redo") }
            IconButton(
                onClick = {
                    val id = selectedId.value ?: return@IconButton
                    val next = scene.withElements(
                        scene.elements.map { el ->
                            if (ExEl.id(el) == id) ExFactory.deleted(el) else el
                        },
                    )
                    selectedId.value = null
                    commit(next)
                },
                enabled = selectedId.value != null,
            ) { Icon(Icons.Filled.Delete, contentDescription = "Delete selected") }
            IconButton(
                onClick = {
                    val next = scene.withElements(
                        scene.visibleElements.map { el -> ExFactory.deleted(el) },
                    )
                    selectedId.value = null
                    commit(next)
                },
            ) { Icon(Icons.Filled.Clear, contentDescription = "Clear drawing") }
        }

        Row(
            modifier = Modifier
                .fillMaxWidth()
                .horizontalScroll(rememberScrollState())
                .padding(bottom = 8.dp),
            horizontalArrangement = Arrangement.spacedBy(8.dp),
            verticalAlignment = Alignment.CenterVertically,
        ) {
            EX_PALETTE.forEach { paletteColor ->
                Box(
                    Modifier
                        .size(30.dp)
                        .clip(CircleShape)
                        .background(parseExColor(paletteColor))
                        .border(
                            2.dp,
                            if (paletteColor == color.value) MaterialTheme.colorScheme.onSurface
                            else Color.Transparent,
                            CircleShape,
                        )
                        .clickable { color.value = paletteColor },
                )
            }
            Text(
                "Stroke",
                style = MaterialTheme.typography.labelLarge,
                modifier = Modifier.padding(start = 8.dp),
            )
            Slider(
                value = thickness.value,
                onValueChange = { thickness.value = it },
                valueRange = 1f..4f,
                steps = 2,
                modifier = Modifier.width(160.dp),
            )
        }

        Box(
            Modifier
                .fillMaxWidth()
                .fillMaxHeight()
                .border(1.dp, MaterialTheme.colorScheme.outline)
                .pointerInput(tool.value, color.value, thickness.value, scene.serialize()) {
                    awaitPointerEventScope {
                        fun toScene(pos: Offset): Pair<Float, Float> {
                            val bounds = ExBounds.of(scene.visibleElements)
                            val (scale, offsetX, offsetY) =
                                viewTransform(size.width.toFloat(), size.height.toFloat(), bounds)
                            return ((pos.x - offsetX) / scale) to
                                ((pos.y - offsetY) / scale)
                        }

                        while (true) {
                            val down = awaitFirstDown(requireUnconsumed = false)
                            val start = toScene(down.position)

                            when (tool.value) {
                                ExTool.SELECT -> {
                                    val hit = scene.visibleElements.lastOrNull {
                                        hitTest(it, start.first, start.second)
                                    }
                                    selectedId.value = hit?.let { ExEl.id(it) }
                                    if (hit != null) {
                                        var moved = false
                                        val id = ExEl.id(hit)
                                        while (true) {
                                            val event = awaitPointerEvent()
                                            if (event.type == PointerEventType.Release) break
                                            if (event.type == PointerEventType.Move) {
                                                moved = true
                                                val now = toScene(event.changes.first().position)
                                                val next = scene.withElements(
                                                    scene.elements.map { el ->
                                                        if (ExEl.id(el) == id) {
                                                            ExFactory.translate(
                                                                el,
                                                                now.first - start.first,
                                                                now.second - start.second,
                                                            )
                                                        } else el
                                                    },
                                                )
                                                Storage.updateExcalidrawScene(next.serialize())
                                            }
                                        }
                                        if (moved) commit(scene)
                                    }
                                }

                                ExTool.TEXT -> textDialogPoint = start

                                else -> {
                                    val type = when (tool.value) {
                                        ExTool.RECTANGLE -> "rectangle"
                                        ExTool.ELLIPSE -> "ellipse"
                                        ExTool.DIAMOND -> "diamond"
                                        ExTool.LINE -> "line"
                                        ExTool.ARROW -> "arrow"
                                        else -> "freedraw"
                                    }
                                    val isShape =
                                        type in setOf("rectangle", "ellipse", "diamond")
                                    val initial = if (isShape) {
                                        ExFactory.shape(
                                            type, start.first, start.second,
                                            1f, 1f, color.value, thickness.value,
                                        )
                                    } else {
                                        ExFactory.linear(
                                            type, listOf(start, start),
                                            color.value, thickness.value,
                                        )
                                    }
                                    pending.value = initial
                                    while (true) {
                                        val event = awaitPointerEvent()
                                        if (event.type == PointerEventType.Release ||
                                            event.type == PointerEventType.Exit
                                        ) break
                                        if (event.type == PointerEventType.Move) {
                                            val now =
                                                toScene(event.changes.first().position)
                                            pending.value = if (isShape) {
                                                ExFactory.shape(
                                                    type,
                                                    min(start.first, now.first),
                                                    min(start.second, now.second),
                                                    abs(now.first - start.first),
                                                    abs(now.second - start.second),
                                                    color.value,
                                                    thickness.value,
                                                )
                                            } else {
                                                val points =
                                                    absolutePoints(initial)
                                                        .toMutableList()
                                                while (points.size < 2) points.add(start)
                                                points[points.size - 1] = now
                                                ExFactory.linear(
                                                    type, points,
                                                    color.value, thickness.value,
                                                )
                                            }
                                        }
                                    }
                                    val finished = pending.value ?: continue
                                    pending.value = null
                                    // A tap with a shape tool (no drag) draws nothing.
                                    if (isShape && ExEl.width(finished) < 2f &&
                                        ExEl.height(finished) < 2f
                                    ) continue
                                    commit(scene.withElements(scene.elements + finished))
                                }
                            }
                        }
                    }
                },
        ) {
            Canvas(modifier = Modifier.fillMaxSize()) {
                val bounds = ExBounds.of(scene.visibleElements)
                val (scale, offsetX, offsetY) =
                    viewTransform(size.width, size.height, bounds)
                for (el in scene.visibleElements) {
                    drawElement(el, scale, offsetX, offsetY, textMeasurer)
                }
                pending.value?.let { drawElement(it, scale, offsetX, offsetY, textMeasurer) }
                selectedId.value?.let { id ->
                    scene.visibleElements
                        .firstOrNull { ExEl.id(it) == id }
                        ?.let { drawSelection(it, scale, offsetX, offsetY) }
                }
            }
        }
    }

    if (textDialogPoint != null) {
        AlertDialog(
            onDismissRequest = { textDialogPoint = null },
            title = { Text("Add text") },
            text = {
                OutlinedTextField(
                    value = textDraft,
                    onValueChange = { textDraft = it },
                )
            },
            confirmButton = {
                TextButton(onClick = {
                    val point = textDialogPoint
                    if (point != null && textDraft.isNotBlank()) {
                        val el = ExFactory.text(
                            point.first, point.second, textDraft,
                            color.value,
                        )
                        commit(scene.withElements(scene.elements + el))
                    }
                    textDraft = ""
                    textDialogPoint = null
                }) { Text("Add") }
            },
            dismissButton = {
                TextButton(onClick = { textDialogPoint = null }) { Text("Cancel") }
            },
        )
    }
}

/** View transform: fit the scene bounds into the viewport, centered. */
private fun viewTransform(
    viewW: Float,
    viewH: Float,
    bounds: ExBounds?,
): Triple<Float, Float, Float> {
    if (bounds == null) return Triple(1f, 0f, 0f)
    val bw = (bounds.maxX - bounds.minX).coerceAtLeast(1f)
    val bh = (bounds.maxY - bounds.minY).coerceAtLeast(1f)
    val scale = min(viewW / bw, viewH / bh)
    val offsetX = (viewW - bw * scale) / 2f - bounds.minX * scale
    val offsetY = (viewH - bh * scale) / 2f - bounds.minY * scale
    return Triple(scale, offsetX, offsetY)
}

internal fun parseExColor(hex: String): Color = runCatching {
    val value = hex.removePrefix("#")
    val argb = when (value.length) {
        8 -> value.toLong(16)
        6 -> 0xFF000000L or value.toLong(16)
        else -> return Color.Black
    }
    Color(argb.toInt())
}.getOrElse { Color.Black }

private fun DrawScope.drawElement(
    el: JsonObject,
    scale: Float,
    offsetX: Float,
    offsetY: Float,
    textMeasurer: androidx.compose.ui.text.TextMeasurer,
) {
    if (!ExEl.isRenderable(el)) return
    val sx = { x: Float -> x * scale + offsetX }
    val sy = { y: Float -> y * scale + offsetY }
    val stroke = Stroke(ExEl.strokeWidth(el) * scale, cap = StrokeCap.Round)
    val strokeColor = parseExColor(ExEl.strokeColor(el)).copy(
        alpha = ExEl.opacity(el) / 100f,
    )
    val fill = ExEl.backgroundColor(el)
    val fillPaint = if (fill != "transparent" && fill.isNotBlank()) {
        parseExColor(fill).copy(alpha = ExEl.opacity(el) / 100f)
    } else null

    fun pathOf(points: List<Pair<Float, Float>>): Path = Path().apply {
        points.forEachIndexed { index, (x, y) ->
            if (index == 0) moveTo(sx(x), sy(y)) else lineTo(sx(x), sy(y))
        }
    }

    when (ExEl.type(el)) {
        "rectangle" -> {
            fillPaint?.let {
                drawRect(
                    it,
                    Offset(sx(ExEl.x(el)), sy(ExEl.y(el))),
                    Size(ExEl.width(el) * scale, ExEl.height(el) * scale),
                )
            }
            drawRect(
                strokeColor,
                topLeft = Offset(sx(ExEl.x(el)), sy(ExEl.y(el))),
                size = Size(ExEl.width(el) * scale, ExEl.height(el) * scale),
                style = stroke,
            )
        }
        "ellipse" -> {
            val topLeft = Offset(sx(ExEl.x(el)), sy(ExEl.y(el)))
            val size = Size(ExEl.width(el) * scale, ExEl.height(el) * scale)
            fillPaint?.let { drawOval(it, topLeft, size) }
            drawOval(strokeColor, topLeft, size, style = stroke)
        }
        "diamond" -> {
            val cx = sx(ExEl.x(el) + ExEl.width(el) / 2f)
            val cy = sy(ExEl.y(el) + ExEl.height(el) / 2f)
            val left = sx(ExEl.x(el)); val right = sx(ExEl.x(el) + ExEl.width(el))
            val top = sy(ExEl.y(el)); val bottom = sy(ExEl.y(el) + ExEl.height(el))
            val path = Path().apply {
                moveTo(cx, top); lineTo(right, cy); lineTo(cx, bottom); lineTo(left, cy); close()
            }
            fillPaint?.let { drawPath(path, it) }
            drawPath(path, strokeColor, style = stroke)
        }
        "line", "arrow", "freedraw" -> {
            val points = absolutePoints(el)
            if (points.size > 1) {
                drawPath(pathOf(points), strokeColor, style = stroke)
            }
            if (ExEl.type(el) == "arrow" && points.size >= 2) {
                val head = arrowHead(points[points.size - 2], points.last(), ExEl.strokeWidth(el))
                val headPath = Path().apply {
                    moveTo(sx(points.last().first), sy(points.last().second))
                    lineTo(sx(head[0].first), sy(head[0].second))
                    moveTo(sx(points.last().first), sy(points.last().second))
                    lineTo(sx(head[1].first), sy(head[1].second))
                }
                drawPath(headPath, strokeColor, style = stroke)
            }
        }
        "text" -> {
            val measured = textMeasurer.measure(
                text = ExEl.text(el),
                style = TextStyle(
                    color = strokeColor,
                    fontSize = (ExEl.fontSize(el) * scale).sp,
                ),
            )
            drawText(measured, topLeft = Offset(sx(ExEl.x(el)), sy(ExEl.y(el))))
        }
    }
}

private fun DrawScope.drawSelection(
    el: JsonObject,
    scale: Float,
    offsetX: Float,
    offsetY: Float,
) {
    val accent = Color(0xFF6965DB)
    drawRect(
        accent,
        topLeft = Offset(
            ExEl.x(el) * scale + offsetX - 4f,
            ExEl.y(el) * scale + offsetY - 4f,
        ),
        size = Size(
            ExEl.width(el) * scale + 8f,
            ExEl.height(el) * scale + 8f,
        ),
        style = Stroke(2f),
    )
}
