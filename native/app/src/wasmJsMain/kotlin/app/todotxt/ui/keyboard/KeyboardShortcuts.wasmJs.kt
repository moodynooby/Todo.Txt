package app.todotxt.ui.keyboard

import androidx.compose.runtime.Composable
import androidx.compose.runtime.remember
import androidx.compose.ui.Modifier
import androidx.compose.ui.focus.FocusRequester

@Composable
actual fun Modifier.keyboardShortcuts(
    searchFocus: FocusRequester?,
    addFocus: FocusRequester?,
): Modifier = this

actual fun Modifier.keyboardFocusable(): Modifier = this

@Composable
actual fun rememberKeyboardHost(): FocusRequester = remember { FocusRequester() }
