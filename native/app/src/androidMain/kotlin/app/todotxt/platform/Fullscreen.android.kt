package app.todotxt.platform

import android.app.Activity
import android.content.Context
import android.content.ContextWrapper
import android.os.Build
import android.view.View
import android.view.WindowInsets
import android.view.WindowInsetsController

private fun findActivity(context: Context): Activity? = when (context) {
    is Activity -> context
    is ContextWrapper -> findActivity(context.baseContext)
    else -> null
}

/**
 * Hides system bars (Android 11+: `WindowInsetsController.hide`; older:
 * legacy SYSTEM_UI flags) and shows the activity content edge-to-edge.
 */
private fun runFullscreen(activity: Activity, enabled: Boolean) {
    if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.R) {
        activity.window.insetsController?.let { controller ->
            if (enabled) {
                controller.hide(WindowInsets.Type.systemBars())
                controller.systemBarsBehavior =
                    WindowInsetsController.BEHAVIOR_SHOW_TRANSIENT_BARS_BY_SWIPE
            } else {
                controller.show(WindowInsets.Type.systemBars())
            }
        }
    } else {
        @Suppress("DEPRECATION")
        activity.window.decorView.systemUiVisibility = if (enabled) {
            (View.SYSTEM_UI_FLAG_HIDE_NAVIGATION
                or View.SYSTEM_UI_FLAG_FULLSCREEN
                or View.SYSTEM_UI_FLAG_IMMERSIVE_STICKY)
        } else {
            View.SYSTEM_UI_FLAG_VISIBLE
        }
    }
}

/** Entry point for the app: toggles immersive fullscreen on the activity. */
actual fun setFullscreen(enabled: Boolean) {
    fullscreenHost?.let { runFullscreen(it, enabled) }
}

@Volatile
private var fullscreenHost: Activity? = null

/**
 * Registers the hosting activity so [setFullscreen] can reach its window.
 * Call once from the composable tree (via `LocalContext.current`), e.g. from
 * a `DisposableEffect` in `AppRoot`.
 */
fun registerFullscreenHost(context: Context) {
    fullscreenHost = findActivity(context)
}

/** Call once from the composable root to register the hosting activity. */
@androidx.compose.runtime.Composable
actual fun initFullscreenHost() {
    registerFullscreenHost(androidx.compose.ui.platform.LocalContext.current)
}
