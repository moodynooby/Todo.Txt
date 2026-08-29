package app.todotxt.service

import java.net.InetAddress
import java.net.NetworkInterface

actual object PlatformDeviceId {
    actual val deviceId: String by lazy {
        runCatching { InetAddress.getLocalHost().hostName }.getOrDefault("desktop")
    }
}

actual fun getLocalIpAddress(): String {
    return try {
        val interfaces = NetworkInterface.getNetworkInterfaces()
        for (iface in interfaces) {
            if (iface.isLoopback || !iface.isUp) continue
            val addresses = iface.inetAddresses
            for (addr in addresses) {
                if (!addr.isLoopbackAddress && addr is java.net.Inet4Address) {
                    return addr.hostAddress
                }
            }
        }
        InetAddress.getLocalHost().hostAddress
    } catch (e: Exception) {
        "127.0.0.1"
    }
}
