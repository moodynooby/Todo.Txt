package app.todotxt.ui.draw

import androidx.compose.foundation.Canvas
import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.gestures.awaitEachGesture
import androidx.compose.foundation.gestures.awaitFirstDown
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.fillMaxHeight
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.material3.Button
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Slider
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.mutableStateListOf
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import kotlinx.coroutines.coroutineScope
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.geometry.Offset
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.Path
import androidx.compose.ui.graphics.StrokeCap
import androidx.compose.ui.graphics.drawscope.Stroke
import androidx.compose.ui.input.pointer.AwaitPointerEventScope
import androidx.compose.ui.input.pointer.PointerEventType
import androidx.compose.ui.input.pointer.pointerInput
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp

/**
 * Drawing canvas workspace — free-hand Excalidraw-style sketch.
 *
 * A tiny stroke store (paths + colors), drawn with `drawPath`. Persisting
 * vector data to disk is the parity path for the web Excalidraw scenes;
 * this page keeps strokes in memory for the experimental build.
 */
data class DrawStroke(
    val points: MutableList<Offset> = mutableListOf(),
    var color: Color = Color.Black,
    var thickness: Float = 4f,
)

@Composable
fun DrawPage() {
    val strokes = remember { mutableStateListOf<DrawStroke>() }
    val currentStroke = remember { mutableStateOf<DrawStroke?>(null) }
    val color = remember { mutableStateOf(Color.Black) }
    val thickness = remember { mutableStateOf(4f) }

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

        Row(
            modifier = Modifier.fillMaxWidth().padding(bottom = 8.dp),
            horizontalArrangement = Arrangement.spacedBy(6.dp),
        ) {
            palette.forEach { paletteColor ->
                Box(
                    Modifier
                        .size(32.dp)
                        .clip(CircleShape)
                        .background(paletteColor)
                        .border(
                            2.dp,
                            if (paletteColor == color.value) MaterialTheme.colorScheme.onSurface else Color.Transparent,
                            CircleShape,
                        )
                        .pointerInput(Unit) {
                            awaitEachGesture {
                                val down = awaitFirstDown()
                                if (down.pressed) color.value = paletteColor
                            }
                        },
                )
            }
            Slider(
                value = thickness.value,
                onValueChange = { thickness.value = it },
                valueRange = 2f..24f,
                modifier = Modifier.weight(1f).padding(horizontal = 8.dp),
            )
            Text("%.0f".format(thickness.value))
            Button(onClick = { strokes.clear(); currentStroke.value = null }) {
                Text("Clear")
            }
        }

        Box(
            Modifier
                .fillMaxWidth()
                .fillMaxHeight()
                .background(MaterialTheme.colorScheme.surface)
                .border(1.dp, MaterialTheme.colorScheme.outline)
                .pointerInput(Unit) {
                    coroutineScope {
                        awaitPointerEventScope {
                            while (true) {
                                val down = awaitFirstDown(requireUnconsumed = false)
                                val stroke = DrawStroke()
                                stroke.color = color.value
                                stroke.thickness = thickness.value
                                stroke.points.add(down.position)
                                currentStroke.value = stroke
                                while (true) {
                                    val event = awaitPointerEvent()
                                    if (event.type == PointerEventType.Release ||
                                        event.type == PointerEventType.Exit
                                    ) {
                                        break
                                    }
                                    if (event.type == PointerEventType.Move) {
                                        val pos: Offset =
                                            event.changes.firstOrNull()?.position ?: Offset.Zero
                                        stroke.points.add(pos)
                                        currentStroke.value = stroke
                                    }
                                }
                                strokes.add(stroke)
                                currentStroke.value = null
                            }
                        }
                    }
                },
        ) {
            Canvas(modifier = Modifier.fillMaxSize()) {
                strokes.forEach { s ->
                    if (s.points.size > 1) {
                        val path = Path().apply {
                            moveTo(s.points.first().x, s.points.first().y)
                            s.points.drop(1).forEach { pos -> lineTo(pos.x, pos.y) }
                        }
                        drawPath(path, s.color, style = Stroke(s.thickness, cap = StrokeCap.Round))
                    }
                }
                currentStroke.value?.let { s ->
                    if (s.points.size > 1) {
                        val path = Path().apply {
                            moveTo(s.points.first().x, s.points.first().y)
                            s.points.drop(1).forEach { pos -> lineTo(pos.x, pos.y) }
                        }
                        drawPath(path, s.color, style = Stroke(s.thickness, cap = StrokeCap.Round))
                    }
                }
            }
        }
    }
}
