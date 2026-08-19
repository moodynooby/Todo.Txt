package app.todotxt

import android.app.Application
import app.todotxt.persistence.PlatformStorage
import app.todotxt.sync.FirebaseSyncManager

class TodoTxtApp : Application() {
    companion object {
        lateinit var instance: TodoTxtApp
            private set
    }

    override fun onCreate() {
        super.onCreate()
        instance = this
        PlatformStorage.init(this)
        app.todotxt.persistence.Storage.load()
        FirebaseSyncManager.start()
    }
}
