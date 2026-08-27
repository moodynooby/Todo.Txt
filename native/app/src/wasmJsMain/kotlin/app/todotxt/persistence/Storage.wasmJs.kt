package app.todotxt.persistence

import kotlinx.browser.localStorage

actual object PlatformStorage {
    actual fun readString(name: String): String? = localStorage.getItem(name)

    actual fun writeString(name: String, value: String) {
        localStorage.setItem(name, value)
    }
}
