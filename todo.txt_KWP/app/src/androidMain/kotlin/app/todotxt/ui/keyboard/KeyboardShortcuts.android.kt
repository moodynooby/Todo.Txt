package app.todotxt.ui.keyboard

import androidx.compose.runtime.Composable
import androidx.compose.ui.Modifier
import androidx.compose.ui.focus.FocusRequester

/**
 * Android actual: hardware-keyboard shortcuts are handled by the system
 * IME / accessibility layer on Android, so the common API is a no-op here.
 * The desktop actual is where `/`, `n`, and `Ctrl+Z` live.
 */
actual fun Modifier.keyboardFocusable(): Modifier = this

@Composable
actual fun Modifier.keyboardShortcuts(
    searchFocus: FocusRequester?,
    addFocus: FocusRequester?,
): Modifier = this

@Composable
actual fun rememberKeyboardHost(): FocusRequester = FocusRequester()
