package app.todotxt.persistence

actual object PortableBackup {
    actual fun export(passphrase: String) {
        BackupManager.setPortableStatus(
            PortableBackupStatus.Failed("Portable encrypted backup export is currently available on Android"),
        )
    }

    actual fun import(passphrase: String) {
        BackupManager.setPortableStatus(
            PortableBackupStatus.Failed("Portable encrypted backup import is currently available on Android"),
        )
    }
}
