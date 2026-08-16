package app.todotxt

import android.app.Application
import app.todotxt.persistence.PlatformStorage

class TodoTxtApp : Application() {
    override fun onCreate() {
        super.onCreate()
        PlatformStorage.init(this)
        app.todotxt.persistence.Storage.load()
    }
}
