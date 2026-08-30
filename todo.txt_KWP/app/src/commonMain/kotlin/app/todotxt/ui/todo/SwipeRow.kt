package app.todotxt.ui.todo

import androidx.compose.foundation.background
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.padding
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.SwipeToDismissBox
import androidx.compose.material3.SwipeToDismissBoxValue
import androidx.compose.material3.Text
import androidx.compose.material3.rememberSwipeToDismissBoxState
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.unit.dp

/**
 * Swipe affordance wrapping a task row: swipe right to complete, swipe left to
 * uncomplete. Uses Material3 SwipeToDismissBox for a11y semantics and
 * consistent motion, replacing the previous custom draggable+Animatable impl.
 */
@Composable
fun SwipeRow(
    complete: Boolean,
    content: @Composable (Modifier) -> Unit,
    onSwipeComplete: () -> Unit,
    onSwipeUncomplete: () -> Unit,
) {
    @Suppress("DEPRECATION")
    val state = rememberSwipeToDismissBoxState(
        confirmValueChange = { value ->
            when (value) {
                SwipeToDismissBoxValue.StartToEnd -> {
                    if (!complete) onSwipeComplete()
                    false // don't dismiss, just trigger action and snap back
                }
                SwipeToDismissBoxValue.EndToStart -> {
                    if (complete) onSwipeUncomplete()
                    false
                }
                SwipeToDismissBoxValue.Settled -> false
            }
        },
        positionalThreshold = { it * 0.35f },
    )

    SwipeToDismissBox(
        state = state,
        backgroundContent = {
            val isStartToEnd = state.dismissDirection == SwipeToDismissBoxValue.StartToEnd
            val isEndToStart = state.dismissDirection == SwipeToDismissBoxValue.EndToStart
            when {
                !complete && isStartToEnd -> Box(
                    modifier = Modifier.fillMaxSize()
                        .background(MaterialTheme.colorScheme.primaryContainer)
                        .padding(start = 16.dp),
                    contentAlignment = Alignment.CenterStart,
                ) {
                    Text("✓", color = MaterialTheme.colorScheme.onPrimaryContainer, style = MaterialTheme.typography.headlineSmall)
                }
                complete && isEndToStart -> Box(
                    modifier = Modifier.fillMaxSize()
                        .background(MaterialTheme.colorScheme.errorContainer)
                        .padding(end = 16.dp),
                    contentAlignment = Alignment.CenterEnd,
                ) {
                    Text("✗", color = MaterialTheme.colorScheme.onErrorContainer, style = MaterialTheme.typography.headlineSmall)
                }
                else -> Box(Modifier.fillMaxSize())
            }
        },
        content = { content(Modifier) },
        enableDismissFromStartToEnd = !complete,
        enableDismissFromEndToStart = complete,
    )
}
