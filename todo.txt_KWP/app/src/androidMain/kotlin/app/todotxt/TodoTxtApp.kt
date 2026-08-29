package app.todotxt

import android.app.Application
import app.todotxt.core.TodoParser
import app.todotxt.persistence.PlatformStorage
import app.todotxt.persistence.Storage
import app.todotxt.service.DueReminderManager
import app.todotxt.service.ReminderManager
import app.todotxt.sync.AccountSyncManager
import app.todotxt.sync.FirebaseSyncManager
import app.todotxt.widget.WidgetRefresher
import kotlinx.coroutines.CoroutineScope
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.SupervisorJob
import kotlinx.coroutines.flow.debounce
import kotlinx.coroutines.launch

class TodoTxtApp : Application() {
    companion object {
        lateinit var instance: TodoTxtApp
            private set
    }

    private val appScope = CoroutineScope(SupervisorJob() + Dispatchers.Default)

    override fun onCreate() {
        super.onCreate()
        instance = this
        PlatformStorage.init(this)
        Storage.load()
        // Account sync (web-compatible) is the primary engine; the legacy
        // anonymous group relay only runs while no account session exists.
        AccountSyncManager.start()
        if (!AccountSyncManager.hasAccountSession()) {
            FirebaseSyncManager.start()
        }
        // Live widget updates + alarm (re)scheduling on every data change.
        WidgetRefresher.observe(this, appScope)
        appScope.launch {
            Storage.habits.collect { ReminderManager.scheduleReminders(it) }
        }
        appScope.launch {
            Storage.content
                .debounce(1000)
                .collect {
                    DueReminderManager.scheduleDueReminders(TodoParser.parseTodoContent(it))
                }
        }
    }
}
