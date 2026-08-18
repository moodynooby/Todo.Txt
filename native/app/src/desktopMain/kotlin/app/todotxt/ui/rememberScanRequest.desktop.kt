package app.todotxt.ui

import androidx.compose.runtime.Composable

/** Desktop: no camera scanning available. */
actual fun rememberScanRequest(): () -> Unit {
    return { /* no-op on desktop */ }
}
