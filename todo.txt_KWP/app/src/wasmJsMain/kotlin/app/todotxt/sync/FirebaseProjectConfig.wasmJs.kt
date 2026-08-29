@file:OptIn(kotlin.js.ExperimentalWasmJsInterop::class)

package app.todotxt.sync

import kotlin.js.js

private fun publicConfig(name: String): String =
    js("(globalThis[name] ?? '').toString()")

actual object FirebaseProjectConfig {
    actual val apiKey: String = publicConfig("__TODO_TXT_FIREBASE_API_KEY__")
    actual val projectId: String = publicConfig("__TODO_TXT_FIREBASE_PROJECT_ID__")
}
