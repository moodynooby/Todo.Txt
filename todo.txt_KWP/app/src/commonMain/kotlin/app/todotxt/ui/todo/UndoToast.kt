package app.todotxt.ui.todo

import androidx.compose.animation.AnimatedVisibility
import androidx.compose.animation.expandVertically
import androidx.compose.animation.shrinkVertically
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.padding
import androidx.compose.material3.ButtonDefaults
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Text
import androidx.compose.material3.TextButton
import androidx.compose.material3.surfaceColorAtElevation
import androidx.compose.runtime.Composable
import androidx.compose.runtime.LaunchedEffect
import androidx.compose.ui.Modifier
import androidx.compose.ui.unit.dp
import app.todotxt.persistence.UndoStack

/**
 * Undo affordance toast — renders while [UndoStack.pending] holds an entry
 * and auto-dismisses after a few seconds. Applies the undo when tapped.
 */
@Composable
fun UndoToast(modifier: Modifier = Modifier) {
    val pending = UndoStack.pending.value
    AnimatedVisibility(
        visible = pending != null,
        enter = expandVertically(),
        exit = shrinkVertically(),
        modifier = modifier,
    ) {
        Row(
            modifier = Modifier
                .fillMaxWidth()
                .padding(8.dp),
            horizontalArrangement = Arrangement.SpaceBetween,
        ) {
            Text(
                pending?.description ?: "",
                style = MaterialTheme.typography.bodyMedium,
                color = MaterialTheme.colorScheme.onSurfaceVariant,
                modifier = Modifier.weight(1f).padding(end = 8.dp),
            )
            TextButton(
                onClick = { UndoStack.undo() },
                colors = ButtonDefaults.textButtonColors(
                    contentColor = MaterialTheme.colorScheme.primary,
                ),
            ) {
                Text("Undo")
            }
            TextButton(
                onClick = { UndoStack.dismiss() },
                colors = ButtonDefaults.textButtonColors(
                    contentColor = MaterialTheme.colorScheme.onSurfaceVariant,
                ),
            ) {
                Text("Done")
            }
        }
    }
    // Auto-dismiss after 6 seconds.
    LaunchedEffect(pending) {
        if (pending != null) {
            kotlinx.coroutines.delay(6_000L)
            UndoStack.dismiss()
        }
    }
}
