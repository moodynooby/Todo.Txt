package app.todotxt.service

import android.provider.Settings
import java.net.NetworkInterface

actual object PlatformDeviceId {
    actual val deviceId: String by lazy {
        runCatching {
            val context = app.todotxt.TodoTxtApp.instance
            Settings.Secure.getString(context.contentResolver, Settings.Secure.ANDROID_ID)
        }.getOrDefault("android-${System.currentTimeMillis()}")
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
        "127.0.0.1"
    } catch (e: Exception) {
        "127.0.0.1"
    }
}
