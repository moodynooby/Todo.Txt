package app.todotxt.persistence

import android.content.Context
import java.io.File

/** Android: files stored under the app's private filesDir. */
actual object PlatformStorage {

    private var context: Context? = null

    fun init(ctx: Context) {
        context = ctx.applicationContext
    }

    private fun dir(): File? {
        val c = context ?: return null
        return File(c.filesDir, "todotxt").also {
            if (!it.exists()) it.mkdirs()
        }
    }

    actual fun readString(name: String): String? =
        runCatching {
            dir()?.let { File(it, name) }?.takeIf { f -> f.exists() }?.readText()
        }.getOrNull()

    actual fun writeString(name: String, value: String) {
        runCatching {
            dir()?.let { File(it, name) }?.writeText(value)
        }
    }
}
