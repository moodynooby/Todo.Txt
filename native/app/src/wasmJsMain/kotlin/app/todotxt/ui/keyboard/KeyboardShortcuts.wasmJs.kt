package app.todotxt.ui.keyboard

import androidx.compose.runtime.Composable
import androidx.compose.runtime.LaunchedEffect
import androidx.compose.runtime.remember
import androidx.compose.ui.ExperimentalComposeUiApi
import androidx.compose.ui.Modifier
import androidx.compose.ui.focus.FocusRequester
import androidx.compose.ui.input.key.Key
import androidx.compose.ui.input.key.KeyEventType
import androidx.compose.ui.input.key.isCtrlPressed
import androidx.compose.ui.input.key.isMetaPressed
import androidx.compose.ui.input.key.key
import androidx.compose.ui.input.key.onPreviewKeyEvent
import androidx.compose.ui.input.key.type
import app.todotxt.persistence.UndoStack

@OptIn(ExperimentalComposeUiApi::class)
@Composable
actual fun Modifier.keyboardShortcuts(
    searchFocus: FocusRequester?,
    addFocus: FocusRequester?,
): Modifier = onPreviewKeyEvent { event ->
    if (event.type != KeyEventType.KeyDown) return@onPreviewKeyEvent false
    when {
        event.key == Key.Slash && searchFocus != null -> {
            searchFocus.requestFocus()
            true
        }
        event.key == Key.N && addFocus != null -> {
            addFocus.requestFocus()
            true
        }
        (event.isCtrlPressed || event.isMetaPressed) && event.key == Key.Z -> {
            UndoStack.undo()
            true
        }
        else -> false
    }
}

actual fun Modifier.keyboardFocusable(): Modifier = this

@Composable
actual fun rememberKeyboardHost(): FocusRequester {
    val requester = remember { FocusRequester() }
    LaunchedEffect(Unit) { requester.requestFocus() }
    return requester
}
