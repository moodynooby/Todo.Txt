package app.todotxt.persistence

/**
 * Interoperable encrypted portable-backup contract shared by every app target.
 * The ciphertext is AES-GCM with a 128-bit authentication tag; its textual
 * envelope is `TODOTXT-BACKUP-1\nbase64(salt).base64(iv).base64(ciphertext)`.
 */
internal object PortableBackupFormat {
    const val PREFIX = "TODOTXT-BACKUP-1"
    const val ITERATIONS = 120_000
    const val KEY_BITS = 256
    const val SALT_BYTES = 16
    const val IV_BYTES = 12
}
