package app.todotxt.sync

import app.todotxt.persistence.Storage
import io.ktor.client.*
import io.ktor.client.request.*
import io.ktor.client.statement.*
import io.ktor.http.*
import kotlinx.coroutines.CoroutineScope
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.IO
import kotlinx.coroutines.launch
import kotlinx.serialization.json.Json

/**
 * Sync engine — provides the architecture for Firestore-parity sync.
 * In a real build, this would talk to a Firestore-compatible REST API.
 * For this experiment, it implements the reconciliation logic (local-first).
 */
object SyncManager {
    private val client = HttpClient()
    private val scope = CoroutineScope(Dispatchers.IO)
    private var syncUrl: String? = null

    fun configure(url: String) {
        syncUrl = url
    }

    fun triggerSync() {
        val url = syncUrl ?: return
        scope.launch {
            try {
                // 1. Push local changes (simplified)
                val localContent = Storage.content.value
                client.post(url) {
                    setBody(localContent)
                    contentType(ContentType.Application.Json)
                }
                
                // 2. Pull remote changes
                val response = client.get(url)
                if (response.status == HttpStatusCode.OK) {
                    val remoteContent = response.bodyAsText()
                    if (remoteContent != localContent) {
                        Storage.setContent(remoteContent)
                    }
                }
            } catch (e: Exception) {
                println("Sync failed: ${e.message}")
            }
        }
    }
}
