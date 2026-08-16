package app.todotxt.persistence

import java.io.File
import java.nio.file.Files

/** Desktop: `~/.config/T0do.TxT/` on Linux, `%APPDATA%\T0do.TxT` on Windows. */
actual object PlatformStorage {
    private val dir: File = System.getProperty("os.name")
        .lowercase()
        .takeIf { it.contains("win") }
        ?.let { File(System.getenv("APPDATA") ?: System.getProperty("user.home"), "T0do.TxT") }
        ?: File(System.getProperty("user.home"), ".config/T0do.TxT")

    private fun file(name: String): File = File(dir, name)

    actual fun readString(name: String): String? =
        runCatching {
            file(name).takeIf { it.exists() }?.readText()
        }.getOrNull()

    actual fun writeString(name: String, value: String) {
        runCatching {
            Files.createDirectories(dir.toPath())
            file(name).writeText(value)
        }
    }
}
