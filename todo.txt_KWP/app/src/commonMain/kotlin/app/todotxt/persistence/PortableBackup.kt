package app.todotxt.persistence

/** Platform bridge for password-protected backup file export and import. */
expect object PortableBackup {
    fun export(passphrase: String)
    fun import(passphrase: String)
}
