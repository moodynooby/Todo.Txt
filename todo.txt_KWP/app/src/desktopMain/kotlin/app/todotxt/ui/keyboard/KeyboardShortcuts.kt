package app.todotxt.ui.keyboard

import androidx.compose.runtime.Composable
import androidx.compose.runtime.LaunchedEffect
import androidx.compose.runtime.remember
import androidx.compose.ui.ExperimentalComposeUiApi
import androidx.compose.ui.Modifier
import androidx.compose.ui.focus.FocusRequester
import androidx.compose.ui.input.key.Key
import androidx.compose.ui.input.key.KeyEventType
import androidx.compose.ui.input.key.type
import androidx.compose.ui.input.key.isCtrlPressed
import androidx.compose.ui.input.key.key
import androidx.compose.ui.input.key.onKeyEvent
import app.todotxt.persistence.UndoStack

/**
 * Desktop actual: attaches keyboard shortcut handling to the host
 * composable. The host must be focusable (see [rememberKeyboardHost]).
 *
 * Captures:
 *
 * - `/`            — focus search input
 * - `n`            — focus quick-add input
 * - `Ctrl/Cmd+Z`   — undo the last destructive action
 */
@OptIn(ExperimentalComposeUiApi::class)
@Composable
actual fun Modifier.keyboardShortcuts(
    searchFocus: FocusRequester?,
    addFocus: FocusRequester?,
): Modifier = onKeyEvent { event ->
    if (event.type != KeyEventType.KeyDown) return@onKeyEvent false // type: KeyDown/KeyUp/Type
    when {
        event.key == Key.Slash && searchFocus != null -> {
            searchFocus.requestFocus()
            true
        }
        event.key == Key.N && addFocus != null -> {
            addFocus.requestFocus()
            true
        }
        event.isCtrlPressed && event.key == Key.Z -> {
            UndoStack.undo()
            true
        }
        else -> false
    }
}

/**
 * Desktop actual: on desktop the Compose scene forwards key events to any
 * element with [Modifier.onKeyEvent], so no extra focusability marker is
 * needed — this is intentionally a pass-through.
 */
actual fun Modifier.keyboardFocusable(): Modifier = this

/**
 * Desktop actual: focus requester for the keyboard-driven workspace —
 * requests focus on first composition so shortcuts work immediately.
 */
@Composable
actual fun rememberKeyboardHost(): FocusRequester {
    val requester = remember { FocusRequester() }
    LaunchedEffect(Unit) { requester.requestFocus() }
    return requester
}
