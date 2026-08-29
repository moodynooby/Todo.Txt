package app.todotxt.ui.todo

import androidx.compose.animation.core.Animatable
import androidx.compose.animation.core.tween
import androidx.compose.foundation.background
import androidx.compose.foundation.gestures.Orientation
import androidx.compose.foundation.gestures.draggable
import androidx.compose.foundation.gestures.rememberDraggableState
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.offset
import androidx.compose.foundation.layout.padding
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.remember
import androidx.compose.runtime.rememberCoroutineScope
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.platform.LocalDensity
import androidx.compose.ui.unit.IntOffset
import androidx.compose.ui.unit.dp
import kotlinx.coroutines.launch

/**
 * Swipe affordance wrapping a task row: drag right to complete, drag left to
 * uncomplete. A check or cross glyph peeks from beneath the row as the user
 * drags; releasing past the threshold fires the action and the row springs
 * back into place. Pure Compose gesture handling — no swipe library needed.
 */
@Composable
fun SwipeRow(
    complete: Boolean,
    content: @Composable (Modifier) -> Unit,
    onSwipeComplete: () -> Unit,
    onSwipeUncomplete: () -> Unit,
) {
    val density = LocalDensity.current
    val scope = rememberCoroutineScope()
    // Pixels the user must drag before the action commits.
    val threshold = with(density) { 96.dp.toPx() }
    // Maximum visible offset (the row slides at most this far).
    val maxOffset = with(density) { 140.dp.toPx() }

    val offset = remember { Animatable(0f) }
    var dragPx = remember { 0f }

    val commit = { direction: Float ->
        val action = if (direction > 0f) onSwipeComplete else onSwipeUncomplete
        action()
        scope.launch {
            offset.animateTo(0f, animationSpec = tween(durationMillis = 240))
        }
    }

    Box(
        modifier = Modifier
            .fillMaxWidth()
            .draggable(
                orientation = Orientation.Horizontal,
                state = rememberDraggableState { delta ->
                    dragPx += delta
                    // Clamp between -maxOffset and +maxOffset.
                    val clamped = dragPx.coerceIn(-maxOffset, maxOffset)
                    // Keep the sign: dragging always increases magnitude.
                    val signed = (if (clamped >= 0f) 1f else -1f) *
                        minOf(kotlin.math.abs(clamped), maxOffset)
                    scope.launch { offset.snapTo(signed) }
                },
                onDragStopped = { velocity ->
                    dragPx = 0f
                    if (kotlin.math.abs(offset.value) >= threshold ||
                        kotlin.math.abs(velocity) >= maxOffset * 2f
                    ) {
                        commit(if (offset.value > 0f) 1f else -1f)
                    } else {
                        scope.launch {
                            offset.animateTo(0f, animationSpec = tween(durationMillis = 240))
                        }
                    }
                },
            ),
    ) {
        // Reveal layer: check glyph on the left (swipe right = complete),
        // cross glyph on the right (swipe left = uncomplete).
        if (!complete && offset.value > 0f) {
            Box(
                modifier = Modifier
                    .align(Alignment.CenterStart)
                    .fillMaxWidth()
                    .background(MaterialTheme.colorScheme.primaryContainer)
                    .padding(start = 16.dp),
                contentAlignment = Alignment.CenterStart,
            ) {
                Text(
                    "✓",
                    color = MaterialTheme.colorScheme.onPrimaryContainer,
                    style = MaterialTheme.typography.headlineSmall,
                )
            }
        }
        if (complete && offset.value < 0f) {
            Box(
                modifier = Modifier
                    .align(Alignment.CenterEnd)
                    .fillMaxWidth()
                    .background(MaterialTheme.colorScheme.errorContainer)
                    .padding(end = 16.dp),
                contentAlignment = Alignment.CenterEnd,
            ) {
                Text(
                    "✗",
                    color = MaterialTheme.colorScheme.onErrorContainer,
                    style = MaterialTheme.typography.headlineSmall,
                )
            }
        }
        // The actual row slides over the reveal layer.
        content(
            Modifier.offset { IntOffset(offset.value.toInt(), 0) }
        )
    }
}
