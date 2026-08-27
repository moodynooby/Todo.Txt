package app.todotxt.ui.timer

import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.*
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import app.todotxt.domain.IdUtils
import app.todotxt.domain.TimerState
import app.todotxt.persistence.Storage
import app.todotxt.platform.playBeep
import app.todotxt.ui.PageHeader
import kotlinx.coroutines.delay

@Composable
fun TimerPage() {
    val timers by Storage.timers.collectAsState()
    var showCreate by remember { mutableStateOf(false) }
    var titleDraft by remember { mutableStateOf("") }
    var durationDraft by remember { mutableStateOf("25") }

    Column(Modifier.fillMaxSize().padding(16.dp)) {
        PageHeader("Timers", modifier = Modifier.padding(bottom = 16.dp)) {
            IconButton(onClick = { showCreate = !showCreate }) {
                Icon(if (showCreate) Icons.Filled.Close else Icons.Filled.Add, contentDescription = "Add Timer")
            }
        }

        if (showCreate) {
            Card(
                modifier = Modifier.fillMaxWidth().padding(bottom = 16.dp),
                shape = RoundedCornerShape(16.dp),
                colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.surfaceVariant)
            ) {
                Column(Modifier.padding(16.dp)) {
                    OutlinedTextField(
                        value = titleDraft,
                        onValueChange = { titleDraft = it },
                        placeholder = { Text("Title (e.g. Focus)") },
                        modifier = Modifier.fillMaxWidth(),
                        singleLine = true
                    )
                    Spacer(Modifier.height(8.dp))
                    OutlinedTextField(
                        value = durationDraft,
                        onValueChange = { if (it.all { c -> c.isDigit() } || it.isEmpty()) durationDraft = it },
                        placeholder = { Text("Minutes (0 = stopwatch)") },
                        modifier = Modifier.fillMaxWidth(),
                        singleLine = true
                    )
                    Spacer(Modifier.height(12.dp))
                    Button(
                        onClick = {
                            val minutes = durationDraft.toLongOrNull() ?: 0L
                            val newTimer = TimerState(
                                id = IdUtils.newId(),
                                title = titleDraft.takeIf { it.isNotBlank() },
                                durationMs = minutes * 60_000L,
                                createdAt = app.todotxt.platform.nowMillis()
                            )
                            Storage.updateTimers { it + newTimer }
                            titleDraft = ""
                            showCreate = false
                        },
                        modifier = Modifier.fillMaxWidth(),
                        shape = RoundedCornerShape(20.dp)
                    ) {
                        Text("Add Timer")
                    }
                }
            }
        }

        if (timers.isEmpty()) {
            Box(Modifier.fillMaxSize(), contentAlignment = Alignment.Center) {
                Text("No timers yet. Add one to stay focused.", color = MaterialTheme.colorScheme.onSurfaceVariant)
            }
        } else {
            LazyColumn(verticalArrangement = Arrangement.spacedBy(12.dp)) {
                items(timers, key = { it.id }) { timer ->
                    TimerItem(timer)
                }
            }
        }
    }
}

@Composable
fun TimerItem(timer: TimerState) {
    var tick by remember { mutableStateOf(0L) }
    LaunchedEffect(timer.isActive) {
        while (timer.isActive) {
            delay(1000L)
            tick += 1L
        }
    }

    fun nowElapsed(): Long {
        val started = timer.startedAt
        return if (started != null) {
            timer.elapsed + (app.todotxt.platform.nowMillis() - started)
        } else {
            timer.elapsed
        }
    }

    fun remainingMs(): Long? {
        if (timer.durationMs <= 0) return null
        return (timer.durationMs - nowElapsed()).coerceAtLeast(0)
    }

    val remaining = remainingMs()
    val elapsed = nowElapsed()
    val displayMs = remaining ?: elapsed

    fun formatted(ms: Long): String {
        val totalSeconds = ms / 1000
        val minutes = totalSeconds / 60
        val seconds = totalSeconds % 60
        val hours = minutes / 60
		fun padded(value: Long): String = value.toString().padStart(2, '0')
		return if (hours > 0) {
			"$hours:${padded(minutes % 60)}:${padded(seconds)}"
		} else {
			"$minutes:${padded(seconds)}"
		}
    }

    Card(
        modifier = Modifier.fillMaxWidth(),
        shape = RoundedCornerShape(16.dp),
        elevation = CardDefaults.cardElevation(defaultElevation = 2.dp)
    ) {
        Column(Modifier.padding(16.dp)) {
            Row(verticalAlignment = Alignment.CenterVertically) {
                Column(Modifier.weight(1f)) {
                    Text(
                        timer.title ?: "Timer",
                        style = MaterialTheme.typography.titleMedium,
                        fontWeight = FontWeight.Bold
                    )
                    if (timer.durationMs > 0) {
                        Text(
                            "${timer.durationMs / 60_000} min target",
                            style = MaterialTheme.typography.bodySmall,
                            color = MaterialTheme.colorScheme.onSurfaceVariant
                        )
                    }
                }
                Text(
                    formatted(displayMs),
                    style = MaterialTheme.typography.headlineLarge,
                    fontWeight = FontWeight.Light,
                    color = if (remaining != null && remaining < 180_000) MaterialTheme.colorScheme.error else MaterialTheme.colorScheme.primary
                )
            }

            Spacer(Modifier.height(12.dp))

            Row(horizontalArrangement = Arrangement.spacedBy(8.dp)) {
                if (!timer.isActive) {
                    Button(
                        onClick = {
                            Storage.updateTimers { list ->
                                list.map { if (it.id == timer.id) it.copy(isActive = true, startedAt = app.todotxt.platform.nowMillis()) else it }
                            }
                        },
                        modifier = Modifier.weight(1f),
                        shape = RoundedCornerShape(20.dp)
                    ) {
                        Icon(Icons.Filled.PlayArrow, contentDescription = null)
                        Spacer(Modifier.width(4.dp))
                        Text("Start")
                    }
                    IconButton(onClick = {
                        Storage.updateTimers { list ->
                            list.map { if (it.id == timer.id) TimerState(id = it.id, title = it.title, durationMs = it.durationMs, createdAt = it.createdAt) else it }
                        }
                    }) {
                        Icon(Icons.Filled.Refresh, contentDescription = "Reset")
                    }
                } else {
                    Button(
                        onClick = {
                            playBeep()
                            Storage.updateTimers { list ->
                                list.map { if (it.id == timer.id) it.copy(isActive = false, elapsed = nowElapsed(), startedAt = null) else it }
                            }
                        },
                        modifier = Modifier.weight(1f),
                        shape = RoundedCornerShape(20.dp),
                        colors = ButtonDefaults.buttonColors(containerColor = MaterialTheme.colorScheme.secondary)
                    ) {
                        Text("Pause")
                    }
                }
                IconButton(onClick = {
                    Storage.updateTimers { list -> list.filter { it.id != timer.id } }
                }) {
                    Icon(Icons.Filled.Delete, contentDescription = "Delete", tint = MaterialTheme.colorScheme.error)
                }
            }
        }
    }

    // Auto-stop + beep at target
    if (timer.isActive && remaining != null && remaining <= 0) {
        LaunchedEffect(timer.id) {
            playBeep()
            Storage.updateTimers { list ->
                list.map { if (it.id == timer.id) it.copy(isActive = false, elapsed = it.durationMs, startedAt = null) else it }
            }
        }
    }
}
