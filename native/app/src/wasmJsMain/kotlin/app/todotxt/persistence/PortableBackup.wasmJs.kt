package app.todotxt.persistence

actual object PortableBackup {
    actual fun export(passphrase: String) {
        BackupManager.setPortableStatus(
            PortableBackupStatus.Failed("Encrypted portable backups are not available in the browser yet"),
        )
    }

    actual fun import(passphrase: String) {
        BackupManager.setPortableStatus(
            PortableBackupStatus.Failed("Encrypted portable backups are not available in the browser yet"),
        )
    }
}
