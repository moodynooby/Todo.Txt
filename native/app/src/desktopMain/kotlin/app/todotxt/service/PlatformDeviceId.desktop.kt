package app.todotxt.service

import java.net.InetAddress

actual object PlatformDeviceId {
    actual val deviceId: String by lazy {
        runCatching { InetAddress.getLocalHost().hostName }.getOrDefault("desktop")
    }
}
