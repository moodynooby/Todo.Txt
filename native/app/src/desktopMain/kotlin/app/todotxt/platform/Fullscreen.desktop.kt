package app.todotxt.platform

/** Desktop: the app runs in a resizable window; no programmatic fullscreen. */
actual fun setFullscreen(enabled: Boolean) {
    // No-op: users can resize/maximize the window manually.
}

@androidx.compose.runtime.Composable
actual fun initFullscreenHost() {
    // No-op: desktop runs in a resizable window.
}
