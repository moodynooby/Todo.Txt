package app.todotxt.persistence

import android.content.Intent
import android.net.Uri
import android.util.Base64
import java.security.SecureRandom
import javax.crypto.Cipher
import javax.crypto.SecretKeyFactory
import javax.crypto.spec.GCMParameterSpec
import javax.crypto.spec.PBEKeySpec
import javax.crypto.spec.SecretKeySpec

actual object PortableBackup {
    private const val PREFIX = "TODOTXT-BACKUP-1"
    private const val ITERATIONS = 120_000
    private const val KEY_BITS = 256
    private const val SALT_BYTES = 16
    private const val IV_BYTES = 12

    actual fun export(passphrase: String) {
        if (passphrase.length < 8) {
            BackupManager.setPortableStatus(PortableBackupStatus.Failed("Use at least 8 characters for the backup passphrase"))
            return
        }
        val context = LauncherBridge.context
        if (context == null) {
            BackupManager.setPortableStatus(PortableBackupStatus.Failed("Backup sharing is not ready"))
            return
        }
        BackupManager.setPortableStatus(PortableBackupStatus.Exporting)
        runCatching {
            val payload = BackupManager.exportPortablePayload()
            val salt = ByteArray(SALT_BYTES)
            val iv = ByteArray(IV_BYTES)
            SecureRandom().nextBytes(salt)
            SecureRandom().nextBytes(iv)
            val key = deriveKey(passphrase, salt)
            val cipher = Cipher.getInstance("AES/GCM/NoPadding")
            cipher.init(Cipher.ENCRYPT_MODE, key, GCMParameterSpec(128, iv))
            val ciphertext = cipher.doFinal(payload.encodeToByteArray())
            val encoded = listOf(salt, iv, ciphertext).joinToString(".") { Base64.encodeToString(it, Base64.NO_WRAP) }
            val file = java.io.File(context.cacheDir, "todotxt-backup.tdb")
            file.writeText("$PREFIX\n$encoded")
            val uri: Uri = androidx.core.content.FileProvider.getUriForFile(
                context,
                "${context.packageName}.fileprovider",
                file,
            )
            val share = Intent(Intent.ACTION_SEND).apply {
                type = "application/octet-stream"
                putExtra(Intent.EXTRA_STREAM, uri)
                addFlags(Intent.FLAG_GRANT_READ_URI_PERMISSION)
            }
            LauncherBridge.shareBackupIntent?.invoke(share)
            BackupManager.setPortableStatus(PortableBackupStatus.Completed)
        }.onFailure { error ->
            BackupManager.setPortableStatus(PortableBackupStatus.Failed(error.message ?: "Could not create backup"))
        }
    }

    actual fun import(passphrase: String) {
        if (passphrase.length < 8) {
            BackupManager.setPortableStatus(PortableBackupStatus.Failed("Use the passphrase that protected the backup"))
            return
        }
        BackupManager.setPortableStatus(PortableBackupStatus.Importing)
        LauncherBridge.importBackupPassphrase = passphrase
        LauncherBridge.openBackupDocument?.invoke()
    }

    internal fun decryptAndRestore(raw: String, passphrase: String) {
        runCatching {
            val lines = raw.trim().split("\n", limit = 2)
            require(lines.firstOrNull() == PREFIX) { "This is not a Todo.Txt backup" }
            val parts = lines.getOrNull(1)?.split(".") ?: error("Backup is incomplete")
            require(parts.size == 3) { "Backup is incomplete" }
            val salt = Base64.decode(parts[0], Base64.DEFAULT)
            val iv = Base64.decode(parts[1], Base64.DEFAULT)
            val ciphertext = Base64.decode(parts[2], Base64.DEFAULT)
            val cipher = Cipher.getInstance("AES/GCM/NoPadding")
            cipher.init(Cipher.DECRYPT_MODE, deriveKey(passphrase, salt), GCMParameterSpec(128, iv))
            val payload = cipher.doFinal(ciphertext).decodeToString()
            require(BackupManager.restorePortablePayload(payload)) { "Backup data is invalid" }
            BackupManager.setPortableStatus(PortableBackupStatus.Completed)
        }.onFailure { error ->
            BackupManager.setPortableStatus(PortableBackupStatus.Failed("Could not restore backup: ${error.message ?: "wrong passphrase or damaged file"}"))
        }
    }

    private fun deriveKey(passphrase: String, salt: ByteArray): SecretKeySpec {
        val spec = PBEKeySpec(passphrase.toCharArray(), salt, ITERATIONS, KEY_BITS)
        val bytes = SecretKeyFactory.getInstance("PBKDF2WithHmacSHA256").generateSecret(spec).encoded
        return SecretKeySpec(bytes, "AES")
    }
}
