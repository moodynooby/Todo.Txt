package app.todotxt.service

import android.provider.Settings

actual object PlatformDeviceId {
    actual val deviceId: String by lazy {
        runCatching {
            val context = app.todotxt.TodoTxtApp.instance
            Settings.Secure.getString(context.contentResolver, Settings.Secure.ANDROID_ID)
        }.getOrDefault("android-${System.currentTimeMillis()}")
    }
}
