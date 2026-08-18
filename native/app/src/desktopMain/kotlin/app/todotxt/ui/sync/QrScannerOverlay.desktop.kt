package app.todotxt.ui.sync

import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.LaunchedEffect
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier

/**
 * Desktop QR scanner — no camera available, show a message.
 * Automatically dismisses after a brief moment.
 */
@Composable
actual fun QrScannerOverlay(onDismiss: () -> Unit) {
    LaunchedEffect(Unit) {
        // Auto-dismiss on desktop since there's no camera
        kotlinx.coroutines.delay(500)
        onDismiss()
    }
    Box(modifier = Modifier.fillMaxSize(), contentAlignment = Alignment.Center) {
        Text(
            "QR scanning is not available on desktop.\n" +
            "Use the native Android app to scan QR codes.",
            style = MaterialTheme.typography.bodyMedium
        )
    }
}
