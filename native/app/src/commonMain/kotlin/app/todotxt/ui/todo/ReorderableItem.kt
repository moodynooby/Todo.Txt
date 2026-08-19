package app.todotxt.ui.todo

import androidx.compose.foundation.gestures.detectDragGestures
import androidx.compose.foundation.layout.offset
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Modifier
import androidx.compose.ui.composed
import androidx.compose.ui.input.pointer.pointerInput
import androidx.compose.ui.unit.IntOffset
import kotlin.math.roundToInt

/**
 * Drag-to-reorder support for a list item. While dragging, the item follows the
 * pointer and reports `onMove(fromIndex, toIndex)` whenever it crosses another
 * item's slot so the backing list (and the persisted document) can be updated
 * in place.
 */
fun Modifier.reorderableItem(
    index: Int,
    onMove: (from: Int, to: Int) -> Unit,
): Modifier = composed {
    var draggedOffset by remember { mutableStateOf(0f) }
    var dragging by remember { mutableStateOf(false) }

    pointerInput(index) {
        detectDragGestures(
            onDragStart = { dragging = true },
            onDrag = { change, dragAmount ->
                change.consume()
                draggedOffset += dragAmount.y
                // One "slot" move per item height (26dp ≈ 78px).
                val slots = (draggedOffset / 78f).roundToInt()
                if (slots != 0) {
                    onMove(index, (index + slots).coerceAtLeast(0))
                    draggedOffset = 0f
                }
            },
            onDragEnd = {
                dragging = false
                draggedOffset = 0f
            },
            onDragCancel = {
                dragging = false
                draggedOffset = 0f
            },
        )
    }.then(
        if (dragging) Modifier.offset { IntOffset(0, draggedOffset.roundToInt()) }
        else Modifier,
    )
}
