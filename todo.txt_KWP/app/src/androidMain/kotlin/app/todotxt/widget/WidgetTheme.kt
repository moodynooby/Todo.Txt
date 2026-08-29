package app.todotxt.widget

import androidx.compose.ui.graphics.Color
import androidx.glance.unit.ColorProvider

/** Shared palette for all widgets (dark surface, evergreen accent). */
internal object WidgetTheme {
    val Surface = Color(0xFF1A1A2E)
    val CellIdle = Color(0xFF2A2A3E)
    val CellChecked = Color(0xFF333355)
    val TextPrimary = Color(0xFFE0E0E0)
    val TextDim = Color(0xFF888899)
    val Accent = Color(0xFF2F6F61) // evergreen
    val White = Color.White

    fun provider(color: Color) = ColorProvider(color)

    fun habitColor(hex: String): Color = try {
        Color(
            red = hex.substring(1, 3).toInt(16),
            green = hex.substring(3, 5).toInt(16),
            blue = hex.substring(5, 7).toInt(16),
            alpha = 255,
        )
    } catch (_: Exception) {
        Accent
    }
}
