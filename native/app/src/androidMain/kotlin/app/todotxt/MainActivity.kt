package app.todotxt

import android.app.Application
import android.app.NotificationChannel
import android.app.NotificationManager
import android.os.Build
import android.os.Bundle
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.activity.enableEdgeToEdge
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.ui.Modifier
import app.todotxt.persistence.AndroidImportExportControls
import app.todotxt.ui.AppRoot

class MainActivity : ComponentActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        enableEdgeToEdge()
        createNotificationChannel()
        setContent {
            AppRoot(Modifier.fillMaxSize())
            AndroidImportExportControls(
                onImported = { content ->
                    val existing = app.todotxt.persistence.Storage.content.value
                    val merged = if (existing.isBlank()) content
                    else "$content\n$existing"
                    app.todotxt.persistence.Storage.setContent(merged)
                },
                onExportShared = {},
            )
        }
    }

    private fun createNotificationChannel() {
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            val manager = getSystemService(NotificationManager::class.java)
            // Must match ReminderManager.CHANNEL_ID — the channel every
            // reminder notification actually posts to.
            val channel = NotificationChannel(
                "habit_reminders",
                "Todos & Habits",
                NotificationManager.IMPORTANCE_HIGH,
            ).apply {
                description = "Reminders for todos and habit check-ins"
            }
            manager.createNotificationChannel(channel)
            // Remove the orphaned pre-0.1.2 channel nothing posts to.
            manager.deleteNotificationChannel("todos")
        }
    }
}
