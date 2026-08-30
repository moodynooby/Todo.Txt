package app.todotxt.ui.draw

import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.clickable
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
import androidx.compose.material.icons.automirrored.filled.Redo
import androidx.compose.material.icons.automirrored.filled.Undo
import androidx.compose.material.icons.filled.Clear
import androidx.compose.material.icons.filled.Delete
import androidx.compose.material.icons.filled.Edit
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
import androidx.compose.runtime.LaunchedEffect
import androidx.compose.runtime.collectAsState
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.unit.dp
import app.todotxt.persistence.Storage
import app.todotxt.ui.PageHeader
import io.ak1.drawbox.DrawBox
import io.ak1.drawbox.domain.model.Mode
import io.ak1.drawbox.presentation.viewmodel.rememberDrawBoxController

/**
 * Drawing workspace over the SHARED `.excalidraw` v2 format — the same
 * scenes the web's Excalidraw editor produces, synced at `excalidraw/main`.
 *
 * Uses [DrawBox] (KMP drawing SDK) for the canvas, with a
 * [DrawBoxExcalidrawAdapter] to round-trip through the Excalidraw JSON format.
 * All unknown fields (images, frames, bindings, customData) are preserved
 * via the base scene carry-over pattern.
 */
enum class ExTool { SELECT, RECTANGLE, ELLIPSE, DIAMOND, LINE, ARROW, PEN, TEXT }

private val EX_PALETTE = listOf(
    "#1e1e1e", "#e03131", "#2f9e44", "#1971c2", "#f08c00", "#9c36b5",
)

@Composable
fun ExcalidrawDrawPage() {
    val sceneJson by Storage.excalidrawScene.collectAsState()
    val scene = remember(sceneJson) { ExcalidrawScene.parse(sceneJson) }

    // DrawBox controller — owns the canvas state, undo/redo, mode, etc.
    val controller = rememberDrawBoxController()
    val state by controller.state.collectAsState()
    val canUndo by controller.canUndo.collectAsState()
    val canRedo by controller.canRedo.collectAsState()

    // Load the Excalidraw scene into DrawBox on first composition or scene change.
    LaunchedEffect(sceneJson) {
        if (sceneJson != null) {
            val drawBoxState = toDrawBox(scene)
            controller.importPath(
                io.ak1.drawbox.domain.model.DrawingSerializer.serialize(
                    io.ak1.drawbox.domain.model.PayLoad(
                        bgColor = drawBoxState.bgColor,
                        elements = drawBoxState.elements,
                    ),
                ),
            )
        }
    }

    // Persist DrawBox state back to Storage whenever it changes.
    LaunchedEffect(state.elements) {
        if (state.elements.isNotEmpty() || sceneJson != null) {
            val excalidrawScene = toExcalidraw(state, scene)
            Storage.updateExcalidrawScene(excalidrawScene.serialize())
        }
    }

    val color = remember { mutableStateOf(EX_PALETTE.first()) }
    val thickness = remember { mutableStateOf(10f) }
    val tool = remember { mutableStateOf(ExTool.PEN) }
    var toolMenuOpen by remember { mutableStateOf(false) }
    var textDialogPoint by remember { mutableStateOf<Pair<Float, Float>?>(null) }
    var textDraft by remember { mutableStateOf("") }

    Column(Modifier.fillMaxSize().padding(16.dp)) {
        PageHeader("Draw", modifier = Modifier.padding(bottom = 8.dp))

        // ── Toolbar row: tool selector, undo/redo, delete, clear ──
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
                                // Map ExTool → DrawBox Mode
                                val mode = when (target) {
                                    ExTool.SELECT -> Mode.SELECT
                                    ExTool.RECTANGLE -> Mode.RECTANGLE
                                    ExTool.ELLIPSE -> Mode.CIRCLE
                                    ExTool.DIAMOND -> Mode.RECTANGLE // diamond mapped via adapter
                                    ExTool.LINE -> Mode.LINE
                                    ExTool.ARROW -> Mode.ARROW
                                    ExTool.PEN -> Mode.PEN
                                    ExTool.TEXT -> Mode.TEXT
                                }
                                controller.setMode(mode)
                                toolMenuOpen = false
                            },
                        )
                    }
                }
            }
            IconButton(
                onClick = { controller.undo() },
                enabled = canUndo,
            ) { Icon(Icons.AutoMirrored.Filled.Undo, contentDescription = "Undo") }
            IconButton(
                onClick = { controller.redo() },
                enabled = canRedo,
            ) { Icon(Icons.AutoMirrored.Filled.Redo, contentDescription = "Redo") }
            IconButton(
                onClick = { controller.deleteSelected() },
                enabled = state.selectedIds.isNotEmpty(),
            ) { Icon(Icons.Filled.Delete, contentDescription = "Delete selected") }
            IconButton(
                onClick = { controller.reset() },
            ) { Icon(Icons.Filled.Clear, contentDescription = "Clear drawing") }
        }

        // ── Color palette + stroke width slider ──
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
                        .clickable {
                            color.value = paletteColor
                            controller.setColor(parseExColor(paletteColor))
                        },
                )
            }
            Text(
                "Stroke",
                style = MaterialTheme.typography.labelLarge,
                modifier = Modifier.padding(start = 8.dp),
            )
            Slider(
                value = thickness.value,
                onValueChange = {
                    thickness.value = it
                    controller.setStrokeWidth(it)
                },
                valueRange = 1f..20f,
                steps = 18,
                modifier = Modifier.width(160.dp),
            )
        }

        // ── DrawBox canvas ──
        Box(
            Modifier
                .fillMaxWidth()
                .fillMaxHeight()
                .border(1.dp, MaterialTheme.colorScheme.outline),
        ) {
            DrawBox(
                state = state,
                onIntent = controller::onIntent,
                modifier = Modifier.fillMaxSize(),
            )
        }
    }

    // ── Text input dialog (for TEXT mode taps) ──
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
                        controller.insertText(
                            text = textDraft,
                            position = androidx.compose.ui.geometry.Offset(point.first, point.second),
                            fontSize = 20f,
                            color = parseExColor(color.value),
                        )
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

/** Parse hex color string to Compose Color (shared utility). */
internal fun parseExColor(hex: String, fallback: Color = Color.Black): Color = runCatching {
    val value = hex.removePrefix("#")
    val argb = when (value.length) {
        8 -> value.toLong(16)
        6 -> 0xFF000000L or value.toLong(16)
        else -> return fallback
    }
    Color(argb.toInt())
}.getOrElse { fallback }
