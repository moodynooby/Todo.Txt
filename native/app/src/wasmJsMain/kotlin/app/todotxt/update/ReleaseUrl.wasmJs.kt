package app.todotxt.update

import kotlinx.browser.window

actual fun openReleaseUrl(url: String): Boolean {
    window.open(url)
    return true
}
