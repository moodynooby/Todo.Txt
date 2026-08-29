package app.todotxt.ui.keyboard

import androidx.compose.runtime.Composable
import androidx.compose.ui.focus.focusRequester
import androidx.compose.ui.Modifier
import androidx.compose.ui.focus.FocusRequester

/**
 * Desktop-first keyboard shortcuts — a keyboard-driven workflow is the
 * biggest ergonomics win on desktop, and the web app has none.
 *
 * Captures (desktop actual):
 *
 * - `/`            — focus search input
 * - `n`            — focus quick-add input
 * - `Ctrl/Cmd+Z`   — undo the last destructive action
 *
 * The common API is a no-op modifier so page code stays cross-platform;
 * only the desktop actual performs key handling.
 */
@Composable
expect fun Modifier.keyboardShortcuts(
    searchFocus: FocusRequester? = null,
    addFocus: FocusRequester? = null,
): Modifier

/**
 * Makes the host composable able to receive keyboard focus — required on
 * desktop before [keyboardShortcuts] can capture key events. No-op on
 * Android (the actual there is just `this`).
 */
expect fun Modifier.keyboardFocusable(): Modifier

/**
 * Focus setup for a keyboard-driven workspace: creates a focus requester,
 * grants it to the host, and requests focus on first composition so
 * shortcuts work immediately without an explicit click.
 */
@androidx.compose.runtime.Composable
expect fun rememberKeyboardHost(): FocusRequester
