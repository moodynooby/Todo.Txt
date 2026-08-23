package app.todotxt.ui.sync

import androidx.compose.foundation.Canvas
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.layout.width
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.verticalScroll
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.FavoriteBorder
import androidx.compose.material.icons.filled.Share
import androidx.compose.material3.Button
import androidx.compose.material3.Card
import androidx.compose.material3.CardDefaults
import androidx.compose.material3.Icon
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.OutlinedTextField
import androidx.compose.material3.Text
import androidx.compose.material3.TextButton
import androidx.compose.runtime.Composable
import androidx.compose.runtime.collectAsState
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.geometry.Offset
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.Dp
import androidx.compose.ui.unit.dp
import app.todotxt.persistence.BackupManager
import app.todotxt.persistence.PortableBackup
import app.todotxt.persistence.PortableBackupStatus
import app.todotxt.service.P2pSyncManager
import app.todotxt.service.PlatformDeviceId
import app.todotxt.ui.PageHeader

/**
 * P2P Sync page — QR-based pairing + continuous WebSocket sync.
 *
 * On desktop: click "Show QR" to generate and display a real QR code.
 * On Android: also supports scanning via camera (triggered by callback).
 */
@Composable
fun P2pSyncPage(
    onScanRequest: () -> Unit = {},
) {
    val syncState by P2pSyncManager.state.collectAsState()
    val scanRequested by P2pSyncManager.scanRequested.collectAsState()
    var qrData by remember { mutableStateOf("") }
    var qrPixels by remember { mutableStateOf<IntArray?>(null) }
    var isServerRunning by remember { mutableStateOf(false) }
    var backupPassphrase by remember { mutableStateOf("") }
    val backupStatus by BackupManager.portableStatus.collectAsState()

    if (scanRequested) {
        // Show QR scanner (Android only — desktop callback is no-op)
        Box(modifier = Modifier.fillMaxSize()) {
            // The QrScanner composable is platform-specific
            // On Android it uses CameraX + ML Kit
            // On Desktop it's a no-op
            QrScannerOverlay(
                onDismiss = { P2pSyncManager.setScanRequested(false) }
            )
        }
        return
    }

    Column(
        modifier = Modifier
            .fillMaxSize()
            .verticalScroll(rememberScrollState())
            .padding(16.dp),
        horizontalAlignment = Alignment.CenterHorizontally,
        verticalArrangement = Arrangement.Top
    ) {
        // Header
        PageHeader(
            title = "P2P Sync",
            leading = {
                Icon(Icons.Filled.FavoriteBorder, contentDescription = null)
                Spacer(Modifier.width(8.dp))
            },
        )

        Spacer(Modifier.height(8.dp))
        Text(
            "Sync your data with another device over your local network. " +
            "No internet or server needed — just scan the QR code.",
            style = MaterialTheme.typography.bodyMedium,
            color = MaterialTheme.colorScheme.onSurfaceVariant
        )

        Spacer(Modifier.height(16.dp))

        // Device ID
        Card(
            modifier = Modifier.fillMaxWidth(),
            colors = CardDefaults.cardColors(
                containerColor = MaterialTheme.colorScheme.secondaryContainer
            )
        ) {
            Column(modifier = Modifier.padding(12.dp)) {
                Text(
                    "This device",
                    style = MaterialTheme.typography.labelMedium,
                    color = MaterialTheme.colorScheme.onSecondaryContainer
                )
                Spacer(Modifier.height(4.dp))
                Text(
                    PlatformDeviceId.deviceId,
                    style = MaterialTheme.typography.bodyMedium,
                    fontWeight = FontWeight.Medium
                )
            }
        }

        Spacer(Modifier.height(16.dp))

        // Sync state indicator
        when (val state = syncState) {
            is P2pSyncManager.SyncState.Listening -> {
                Card(
                    modifier = Modifier.fillMaxWidth(),
                    colors = CardDefaults.cardColors(
                        containerColor = MaterialTheme.colorScheme.primaryContainer
                    )
                ) {
                    Column(modifier = Modifier.padding(12.dp)) {
                        Text(
                            "Ready — show this QR to another device",
                            style = MaterialTheme.typography.labelMedium,
                            color = MaterialTheme.colorScheme.onPrimaryContainer
                        )
                        Spacer(Modifier.height(8.dp))
                        // Render QR code
                        qrPixels?.let { pixels ->
                            QrCodeCanvas(pixels = pixels, size = 200.dp)
                        }
                        Spacer(Modifier.height(8.dp))
                        Text(
                            state.qrData,
                            style = MaterialTheme.typography.bodySmall,
                            color = MaterialTheme.colorScheme.onPrimaryContainer
                        )
                    }
                }
                Spacer(Modifier.height(12.dp))
                Button(onClick = {
                    P2pSyncManager.stopServer()
                    isServerRunning = false
                    qrData = ""
                    qrPixels = null
                }) {
                    Text("Stop Sharing")
                }
            }
            is P2pSyncManager.SyncState.Connected -> {
                Card(
                    modifier = Modifier.fillMaxWidth(),
                    colors = CardDefaults.cardColors(
                        containerColor = MaterialTheme.colorScheme.tertiaryContainer
                    )
                ) {
                    Column(modifier = Modifier.padding(12.dp)) {
                        Text(
                            "Connected to ${state.peerId}",
                            style = MaterialTheme.typography.labelMedium,
                            color = MaterialTheme.colorScheme.onTertiaryContainer
                        )
                        Spacer(Modifier.height(4.dp))
                        Text(
                            "Continuous sync active — changes sync automatically",
                            style = MaterialTheme.typography.bodySmall,
                            color = MaterialTheme.colorScheme.onTertiaryContainer
                        )
                    }
                }
            }
            is P2pSyncManager.SyncState.Syncing -> {
                Text(
                    "Syncing with ${state.peerId}...",
                    style = MaterialTheme.typography.bodyMedium,
                    color = MaterialTheme.colorScheme.primary
                )
            }
            is P2pSyncManager.SyncState.Error -> {
                Text(
                    "Error: ${state.message}",
                    style = MaterialTheme.typography.bodySmall,
                    color = MaterialTheme.colorScheme.error
                )
            }
            else -> { /* Idle — show buttons */ }
        }

        Spacer(Modifier.height(16.dp))

        // Action buttons
        Row(
            modifier = Modifier.fillMaxWidth(),
            horizontalArrangement = Arrangement.spacedBy(8.dp)
        ) {
            // Share button
            Button(
                onClick = {
                    qrData = P2pSyncManager.startServer()
                    qrPixels = P2pSyncManager.generateQrPixels(qrData)
                    isServerRunning = true
                },
                enabled = !isServerRunning,
                modifier = Modifier.weight(1f)
            ) {
                Icon(Icons.Filled.Share, contentDescription = null)
                Spacer(Modifier.width(8.dp))
                Text("Show QR", style = MaterialTheme.typography.labelMedium)
            }

            // Scan button (Android only — desktop callback is a no-op)
            Button(
                onClick = { onScanRequest() },
                modifier = Modifier.weight(1f)
            ) {
                Icon(Icons.Filled.FavoriteBorder, contentDescription = null)
                Spacer(Modifier.width(8.dp))
                Text("Scan QR", style = MaterialTheme.typography.labelMedium)
            }
        }

        Spacer(Modifier.height(24.dp))

        Spacer(Modifier.height(20.dp))

        Card(modifier = Modifier.fillMaxWidth()) {
            Column(modifier = Modifier.padding(12.dp)) {
                Text(
                    "Encrypted recovery backup",
                    style = MaterialTheme.typography.titleMedium,
                    fontWeight = FontWeight.Bold,
                )
                Spacer(Modifier.height(4.dp))
                Text(
                    "Save an encrypted copy outside the app so it can be restored after device loss or app removal. Keep the passphrase safe; it is not stored in Firebase.",
                    style = MaterialTheme.typography.bodySmall,
                    color = MaterialTheme.colorScheme.onSurfaceVariant,
                )
                Spacer(Modifier.height(8.dp))
                OutlinedTextField(
                    value = backupPassphrase,
                    onValueChange = { backupPassphrase = it },
                    label = { Text("Backup passphrase") },
                    singleLine = true,
                    modifier = Modifier.fillMaxWidth(),
                )
                Spacer(Modifier.height(8.dp))
                Row(
                    modifier = Modifier.fillMaxWidth(),
                    horizontalArrangement = Arrangement.spacedBy(8.dp),
                ) {
                    Button(
                        onClick = { PortableBackup.export(backupPassphrase) },
                        enabled = backupPassphrase.length >= 8,
                        modifier = Modifier.weight(1f),
                    ) {
                        Text("Export backup")
                    }
                    TextButton(
                        onClick = { PortableBackup.import(backupPassphrase) },
                        enabled = backupPassphrase.length >= 8,
                        modifier = Modifier.weight(1f),
                    ) {
                        Text("Restore backup")
                    }
                }
                when (val status = backupStatus) {
                    PortableBackupStatus.Exporting -> Text("Preparing encrypted backup…", style = MaterialTheme.typography.bodySmall)
                    PortableBackupStatus.Importing -> Text("Choose the .tdb backup file…", style = MaterialTheme.typography.bodySmall)
                    PortableBackupStatus.Completed -> Text("Backup operation completed.", style = MaterialTheme.typography.bodySmall, color = MaterialTheme.colorScheme.primary)
                    is PortableBackupStatus.Failed -> Text(status.message, style = MaterialTheme.typography.bodySmall, color = MaterialTheme.colorScheme.error)
                    PortableBackupStatus.Idle -> Unit
                }
            }
        }

        Spacer(Modifier.height(20.dp))

        // Info
        Text(
            "How it works:\n" +
            "1. Both devices must be on the same WiFi network\n" +
            "2. One device taps 'Show QR' — the other scans it\n" +
            "3. Data merges automatically (newer changes win)\n" +
            "4. After pairing, changes sync continuously",
            style = MaterialTheme.typography.bodySmall,
            color = MaterialTheme.colorScheme.onSurfaceVariant,
            modifier = Modifier.fillMaxWidth()
        )
    }
}

/**
 * Simple QR code renderer using Canvas.
 * Each pixel in the IntArray maps to a colored square.
 */
@Composable
fun QrCodeCanvas(pixels: IntArray, size: Dp, modifier: Modifier = Modifier) {
    val dimension = kotlin.math.sqrt(pixels.size.toFloat()).toInt()

    Canvas(
        modifier = modifier.size(size)
    ) {
        val cellSize = size.value / dimension
        pixels.forEachIndexed { index, pixel ->
            val x = index % dimension
            val y = index / dimension
            val color = Color(pixel)
            drawRect(
                color = color,
                topLeft = Offset(x * cellSize, y * cellSize),
                size = androidx.compose.ui.geometry.Size(cellSize, cellSize)
            )
        }
    }
}

/** Platform-specific QR scanner overlay. Android: CameraX+ML Kit. Desktop: no-op. */
@Composable
expect fun QrScannerOverlay(onDismiss: () -> Unit)
