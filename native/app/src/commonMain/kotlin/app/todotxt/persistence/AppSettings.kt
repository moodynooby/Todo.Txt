package app.todotxt.persistence

import kotlinx.serialization.Serializable

/** Preferred theme mode. SYSTEM follows the platform appearance. */
@Serializable
enum class ThemeMode { LIGHT, DARK, SYSTEM }

/** Small user-facing settings bag persisted to settings.json. */
@Serializable
data class AppSettings(
    val themeMode: ThemeMode = ThemeMode.SYSTEM,
)
