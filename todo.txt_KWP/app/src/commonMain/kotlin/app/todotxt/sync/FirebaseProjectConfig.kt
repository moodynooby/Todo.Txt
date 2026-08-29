package app.todotxt.sync

/**
 * Firebase configuration is platform-specific because the native app currently
 * targets Android and desktop. Desktop remains local-only until a desktop
 * Firebase transport is explicitly added.
 */
expect object FirebaseProjectConfig {
    val apiKey: String
    val projectId: String
}
