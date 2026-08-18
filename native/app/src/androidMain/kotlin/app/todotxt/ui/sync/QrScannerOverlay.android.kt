package app.todotxt.ui.sync

import androidx.compose.foundation.background
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.material3.Button
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.unit.dp
import app.todotxt.service.P2pSyncManager
import app.todotxt.service.QrScanner

/**
 * Android QR scanner overlay — shows CameraX + ML Kit scanner fullscreen.
 * When a QR code is detected, connects to the peer and dismisses.
 */
@Composable
actual fun QrScannerOverlay(onDismiss: () -> Unit) {
    Column(
        modifier = Modifier
            .fillMaxSize()
            .background(MaterialTheme.colorScheme.background)
    ) {
        QrScanner(
            onQrDetected = { url ->
                P2pSyncManager.connectToPeer(url)
                onDismiss()
            },
            modifier = Modifier.weight(1f)
        )
        Spacer(Modifier.height(8.dp))
        Button(
            onClick = onDismiss,
            modifier = Modifier.padding(16.dp)
        ) {
            Text("Cancel")
        }
    }
}
