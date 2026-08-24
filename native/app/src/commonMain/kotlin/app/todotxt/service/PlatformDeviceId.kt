package app.todotxt.service

/** Platform-specific device identifier. */
expect object PlatformDeviceId {
    val deviceId: String
}

/** Best-effort LAN address; used by local-network tooling. */
expect fun getLocalIpAddress(): String
