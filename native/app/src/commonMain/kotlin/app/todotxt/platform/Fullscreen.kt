package app.todotxt.platform

/**
 * Full-screen immersion for the timer workspace (web parity:
 * `TimerFullscreen.tsx`). On Android this hides the system bars and shows the
 * activity in immersive mode; on Desktop it is a no-op (user can resize the
 * window manually).
 */
expect fun setFullscreen(enabled: Boolean)

/**
 * One-shot registration of the hosting window/activity so that [setFullscreen]
 * can reach it later. Call once from the composable root on startup.
 */
@androidx.compose.runtime.Composable
expect fun initFullscreenHost()
