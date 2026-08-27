package app.todotxt.persistence

import android.content.Context
import android.content.Intent
import android.net.Uri
import androidx.activity.compose.rememberLauncherForActivityResult
import androidx.activity.result.contract.ActivityResultContracts
import androidx.compose.runtime.Composable
import androidx.compose.runtime.LaunchedEffect
import androidx.compose.ui.platform.LocalContext

/**
 * Android: import via `ACTION_OPEN_DOCUMENT` and export via `ACTION_SEND`
 * (share sheet). The launchers are registered in `AndroidImportExportControls`;
 * calling `importTodoDocument()` / `exportTodoDocument()` on Android opens the
 * picker and delivers the result asynchronously through `ImportExportBridge`.
 */
actual fun importTodoDocument(): ImportExportResult {
    LauncherBridge.openDocument?.invoke("text/plain")
    return ImportExportResult.Cancelled
}

actual fun exportTodoDocument(content: String): ImportExportResult {
    val ctx = LauncherBridge.context
    if (ctx != null) {
        val uri: Uri? = runCatching {
            val cache = java.io.File(ctx.cacheDir, "todo.txt")
            cache.writeText(content)
            androidx.core.content.FileProvider.getUriForFile(ctx, "${ctx.packageName}.fileprovider", cache)
        }.getOrNull()
        if (uri != null) {
            val share = Intent(Intent.ACTION_SEND).apply {
                type = "text/plain"
                putExtra(Intent.EXTRA_STREAM, uri)
                addFlags(Intent.FLAG_GRANT_READ_URI_PERMISSION)
            }
            LauncherBridge.shareIntent?.invoke(share)
            return ImportExportResult.Cancelled
        }
    }
    return ImportExportResult.Cancelled
}

/** Singleton holding launcher references registered by the controls composable. */
internal object LauncherBridge {
    var context: Context? = null
    var openDocument: ((String) -> Unit)? = null
    var shareIntent: ((Intent) -> Unit)? = null
    var openBackupDocument: (() -> Unit)? = null
    var shareBackupIntent: ((Intent) -> Unit)? = null
    var importBackupPassphrase: String = ""
}

/** Drop-in composable registering the Android document-picker launchers. */
@Composable
fun AndroidImportExportControls(
    onImported: (String) -> Unit,
    onExportShared: () -> Unit,
) {
    val ctx = LocalContext.current
    LauncherBridge.context = ctx.applicationContext

    val openLauncher = rememberLauncherForActivityResult(
        ActivityResultContracts.OpenDocument(),
    ) { uri: Uri? ->
        if (uri != null) readUri(ctx.applicationContext, uri)?.let(onImported)
    }

    val openBackupLauncher = rememberLauncherForActivityResult(
        ActivityResultContracts.OpenDocument(),
    ) { uri: Uri? ->
        when {
            uri == null -> BackupManager.setPortableStatus(
                PortableBackupStatus.Failed("Backup import cancelled"),
            )
            else -> {
                val raw = readUri(ctx.applicationContext, uri)
                if (raw == null) {
                    BackupManager.setPortableStatus(
                        PortableBackupStatus.Failed("Could not read the selected backup"),
                    )
                } else {
                    PortableBackup.decryptAndRestore(raw, LauncherBridge.importBackupPassphrase)
                }
            }
        }
    }

    val shareLauncher = rememberLauncherForActivityResult(
        ActivityResultContracts.StartActivityForResult(),
    ) { onExportShared() }

    LaunchedEffect(Unit) {
        LauncherBridge.openDocument = { mimeType ->
            openLauncher.launch(arrayOf(mimeType))
        }
        LauncherBridge.shareIntent = { intent ->
            shareLauncher.launch(Intent.createChooser(intent, "Export todo.txt"))
        }
        LauncherBridge.openBackupDocument = {
            openBackupLauncher.launch(arrayOf("application/octet-stream", "application/octet-stream"))
        }
        LauncherBridge.shareBackupIntent = { intent ->
            shareLauncher.launch(Intent.createChooser(intent, "Save encrypted Todo.Txt backup"))
        }
    }
}

private fun readUri(ctx: Context, uri: Uri): String? = runCatching {
    ctx.contentResolver.openInputStream(uri)?.use { it.readBytes().decodeToString() }
}.getOrNull()
