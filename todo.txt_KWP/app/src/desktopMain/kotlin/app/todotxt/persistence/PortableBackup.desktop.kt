package app.todotxt.persistence

import java.awt.FileDialog
import java.awt.Frame
import java.io.File
import java.nio.charset.StandardCharsets
import java.security.SecureRandom
import java.util.Base64
import javax.crypto.Cipher
import javax.crypto.SecretKeyFactory
import javax.crypto.spec.GCMParameterSpec
import javax.crypto.spec.PBEKeySpec
import javax.crypto.spec.SecretKeySpec

actual object PortableBackup {

    actual fun export(passphrase: String) {
        if (passphrase.length < 8) {
            BackupManager.setPortableStatus(
                PortableBackupStatus.Failed("Use at least 8 characters for the backup passphrase"),
            )
            return
        }
        BackupManager.setPortableStatus(PortableBackupStatus.Exporting)
        runCatching {
            val dialog = FileDialog(null as Frame?, "Export Todo.Txt backup", FileDialog.SAVE).apply {
                file = "todotxt-backup.tdb"
                filenameFilter = object : java.io.FilenameFilter {
                    override fun accept(dir: File?, name: String?): Boolean = name?.endsWith(".tdb") == true
                }
                isVisible = true
            }
            val selected = dialog.file?.let { name -> dialog.directory?.let { File(it, name) } }
                ?: run {
                    BackupManager.setPortableStatus(PortableBackupStatus.Idle)
                    return
                }
            val payload = BackupManager.exportPortablePayload()
            val salt = ByteArray(PortableBackupFormat.SALT_BYTES).also(SecureRandom()::nextBytes)
            val iv = ByteArray(PortableBackupFormat.IV_BYTES).also(SecureRandom()::nextBytes)
            val cipher = Cipher.getInstance("AES/GCM/NoPadding")
            cipher.init(Cipher.ENCRYPT_MODE, deriveKey(passphrase, salt), GCMParameterSpec(128, iv))
            val ciphertext = cipher.doFinal(payload.toByteArray(StandardCharsets.UTF_8))
            val encoded = listOf(salt, iv, ciphertext).joinToString(".") {
                Base64.getEncoder().encodeToString(it)
            }
            val output = if (selected.extension.equals("tdb", ignoreCase = true)) {
                selected
            } else {
                File(selected.parentFile, "${selected.name}.tdb")
            }
            output.writeText("${PortableBackupFormat.PREFIX}\n$encoded", StandardCharsets.UTF_8)
            BackupManager.setPortableStatus(PortableBackupStatus.Completed)
        }.onFailure { error ->
            BackupManager.setPortableStatus(
                PortableBackupStatus.Failed(error.message ?: "Could not create backup"),
            )
        }
    }

    actual fun import(passphrase: String) {
        if (passphrase.length < 8) {
            BackupManager.setPortableStatus(
                PortableBackupStatus.Failed("Use the passphrase that protected the backup"),
            )
            return
        }
        BackupManager.setPortableStatus(PortableBackupStatus.Importing)
        runCatching {
            val dialog = FileDialog(null as Frame?, "Import Todo.Txt backup", FileDialog.LOAD).apply {
                filenameFilter = object : java.io.FilenameFilter {
                    override fun accept(dir: File?, name: String?): Boolean = name?.endsWith(".tdb") == true
                }
                isVisible = true
            }
            val selected = dialog.file?.let { name -> dialog.directory?.let { File(it, name) } }
                ?: run {
                    BackupManager.setPortableStatus(PortableBackupStatus.Idle)
                    return
                }
            val lines = selected.readText(StandardCharsets.UTF_8).trim().split("\n", limit = 2)
            require(lines.firstOrNull()?.trimEnd('\r') == PortableBackupFormat.PREFIX) { "This is not a Todo.Txt backup" }
            val parts = lines.getOrNull(1)?.trim()?.split(".") ?: error("Backup is incomplete")
            require(parts.size == 3) { "Backup is incomplete" }
            val salt = Base64.getDecoder().decode(parts[0])
            val iv = Base64.getDecoder().decode(parts[1])
            val ciphertext = Base64.getDecoder().decode(parts[2])
            val cipher = Cipher.getInstance("AES/GCM/NoPadding")
            cipher.init(Cipher.DECRYPT_MODE, deriveKey(passphrase, salt), GCMParameterSpec(128, iv))
            val payload = cipher.doFinal(ciphertext).toString(StandardCharsets.UTF_8)
            require(BackupManager.restorePortablePayload(payload)) { "Backup data is invalid" }
            BackupManager.setPortableStatus(PortableBackupStatus.Completed)
        }.onFailure { error ->
            BackupManager.setPortableStatus(
                PortableBackupStatus.Failed(
                    "Could not restore backup: ${error.message ?: "wrong passphrase or damaged file"}",
                ),
            )
        }
    }

    private fun deriveKey(passphrase: String, salt: ByteArray): SecretKeySpec {
        val spec = PBEKeySpec(passphrase.toCharArray(), salt, PortableBackupFormat.ITERATIONS, PortableBackupFormat.KEY_BITS)
        val bytes = SecretKeyFactory.getInstance("PBKDF2WithHmacSHA256").generateSecret(spec).encoded
        return SecretKeySpec(bytes, "AES")
    }
}
