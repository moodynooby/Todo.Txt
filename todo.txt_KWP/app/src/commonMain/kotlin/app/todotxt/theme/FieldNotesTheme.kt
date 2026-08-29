package app.todotxt.theme

import androidx.compose.foundation.isSystemInDarkTheme
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.darkColorScheme
import androidx.compose.material3.lightColorScheme
import androidx.compose.runtime.Composable
import androidx.compose.ui.graphics.Color

/**
 * Field Notes Ritual — the Material 3 Expressive design system of Todo.Txt,
 * ported from `src/theme/m3Theme.ts`. The palette: evergreen (primary),
 * terracotta (secondary), honey (tertiary). Paper-toned surfaces, deep ink.
 */

// Evergreen scale  (light index 5 = --4 = #578752 ≈ primary)
val Evergreen50 = Color(0xFFEEF4EE)
val Evergreen100 = Color(0xFFE0EBE0)
val Evergreen300 = Color(0xFF93B88E)
val Evergreen400 = Color(0xFF6F9F6A)
val Evergreen500 = Color(0xFF578752)
val Evergreen700 = Color(0xFF2A5829)

// Terracotta scale (terracotta400 = #f5a677)
val Terracotta50 = Color(0xFFFFF0E8)
val Terracotta100 = Color(0xFFFFE0CE)
val Terracotta300 = Color(0xFFFFC9A8)
val Terracotta400 = Color(0xFFF5A677)
val Terracotta500 = Color(0xFFE98A58)
val Terracotta700 = Color(0xFF8F4526)

// Honey scale (honey400 = #efc169)
val Honey50 = Color(0xFFFFF7E8)
val Honey100 = Color(0xFFFEECD1)
val Honey300 = Color(0xFFF7D9A0)
val Honey400 = Color(0xFFEFC169)
val Honey500 = Color(0xFFE9AC40)
val Honey700 = Color(0xFF8C5B19)

// Field Notes surfaces
val CanvasLight = Color(0xFFF7F5EF)
val CanvasStrongLight = Color(0xFFFFFDF7)
val SurfaceMutedLight = Color(0xFFE8EEE3)
val InkLight = Color(0xFF173D35)
val InkMutedLight = Color(0xFF61706A)
val InkFaintLight = Color(0xFF89938A)
val BorderLight = Color(0xFFE3E2DA)

val CanvasDark = Color(0xFF12161A)
val CanvasStrongDark = Color(0xFF171C21)
val SurfaceMutedDark = Color(0xFF333D47)
val InkDark = Color(0xFFE8ECEF)
val InkMutedDark = Color(0xFFB8C0C7)
val InkFaintDark = Color(0xFF8A939B)
val BorderDark = Color(0x21D6DEE6)

val LightColors = lightColorScheme(
    primary = Evergreen700,
    onPrimary = Evergreen50,
    primaryContainer = Evergreen100,
    onPrimaryContainer = Evergreen700,
    secondary = Terracotta500,
    onSecondary = Terracotta50,
    secondaryContainer = Terracotta100,
    onSecondaryContainer = Terracotta700,
    tertiary = Honey500,
    onTertiary = Honey50,
    tertiaryContainer = Honey100,
    onTertiaryContainer = Honey700,
    background = CanvasLight,
    onBackground = InkLight,
    surface = CanvasStrongLight,
    onSurface = InkLight,
    surfaceVariant = SurfaceMutedLight,
    onSurfaceVariant = InkMutedLight,
    outline = BorderLight,
)

val DarkColors = darkColorScheme(
    primary = Evergreen300,
    onPrimary = Evergreen700,
    primaryContainer = Evergreen700,
    onPrimaryContainer = Evergreen100,
    secondary = Terracotta300,
    onSecondary = Terracotta700,
    secondaryContainer = Terracotta700,
    onSecondaryContainer = Terracotta100,
    tertiary = Honey300,
    onTertiary = Honey700,
    tertiaryContainer = Honey700,
    onTertiaryContainer = Honey100,
    background = CanvasDark,
    onBackground = InkDark,
    surface = CanvasStrongDark,
    onSurface = InkDark,
    surfaceVariant = SurfaceMutedDark,
    onSurfaceVariant = InkMutedDark,
    outline = BorderDark,
)

/** M3 Expressive shape scale: xs 4, sm 8, md 12, lg 16, xl 20, xxl 28, full. */
object Shapes {
    val Xs = 4f
    val Sm = 8f
    val Md = 12f
    val Lg = 16f
    val Xl = 20f
    val Xxl = 28f
    val Full = 9999f
}

@Composable
fun FieldNotesTheme(
    darkTheme: Boolean = isSystemInDarkTheme(),
    content: @Composable () -> Unit,
) {
    val colors = if (darkTheme) DarkColors else LightColors
    MaterialTheme(colorScheme = colors, content = content)
}
