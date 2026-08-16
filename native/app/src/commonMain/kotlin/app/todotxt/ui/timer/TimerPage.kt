package app.todotxt.ui.timer

import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.width
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.PlayArrow
import androidx.compose.material.icons.filled.Refresh
import androidx.compose.material3.Button
import androidx.compose.material3.ButtonDefaults
import androidx.compose.material3.Icon
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.OutlinedTextField
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.LaunchedEffect
import androidx.compose.runtime.collectAsState
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import app.todotxt.domain.TimerState
import app.todotxt.persistence.Storage
import kotlinx.coroutines.delay
import kotlin.math.floor

/**
 * Floating stopwatch / Pomodoro timer.
 *
 * State persists to timer.json. While running, elapsed =
 * savedElapsed + (now - startedAt), so the counter survives app restarts.
 */
@Composable
fun TimerPage() {
    val timer by Storage.timers.collectAsState()
    val current: TimerState = timer ?: TimerState()

    // Tick state: drive recomposition while active; elapsed is recomputed
    // from the persisted anchor so the source of truth stays on disk.
    var tick by remember { mutableStateOf(0L) }
    LaunchedEffect(current.isActive) {
        while (current.isActive) {
            delay(1000L)
            tick += 1L
        }
    }

    fun nowElapsed(): Long = if (current.startedAt != null) {
        (current.elapsed ?: 0L) + (System.currentTimeMillis() - current.startedAt)
    } else {
        current.elapsed ?: 0L
    }

    fun formatted(ms: Long): String {
        val totalSeconds = ms / 1000
        val minutes = floor(totalSeconds / 60.0).toLong()
        val seconds = totalSeconds % 60
        val hours = floor(minutes / 60.0).toLong()
        return if (hours > 0) {
            "%d:%02d:%02d".format(hours, minutes % 60, seconds)
        } else {
            "%d:%02d".format(minutes, seconds)
        }
    }

    var titleDraft by remember { mutableStateOf(current.title ?: "") }

    Column(
        Modifier.fillMaxSize().padding(16.dp),
        horizontalAlignment = Alignment.CenterHorizontally,
    ) {
        Text(
            "Timer",
            style = MaterialTheme.typography.headlineMedium,
            fontWeight = FontWeight.Bold,
            modifier = Modifier.padding(bottom = 8.dp),
        )

        Spacer(Modifier.height(24.dp))

        Text(
            formatted(nowElapsed()),
            style = MaterialTheme.typography.displayLarge,
            fontWeight = FontWeight.Light,
        )

        Spacer(Modifier.height(24.dp))

        OutlinedTextField(
            value = titleDraft,
            onValueChange = { titleDraft = it },
            placeholder = { Text("Session title (optional)") },
            singleLine = true,
        )

        Spacer(Modifier.height(16.dp))

        Row(horizontalArrangement = Arrangement.Center) {
            if (!current.isActive) {
                Button(
                    onClick = {
                        Storage.updateTimer(current.copy(
                            title = titleDraft.takeIf { it.isNotBlank() },
                            isActive = true,
                            startedAt = System.currentTimeMillis(),
                        ))
                    },
                    shape = RoundedCornerShape(28.dp),
                    colors = ButtonDefaults.buttonColors(containerColor = MaterialTheme.colorScheme.primary),
                ) {
                    Icon(Icons.Filled.PlayArrow, contentDescription = "Start")
                    Text("Start")
                }
                Spacer(Modifier.width(12.dp))
                Button(
                    onClick = {
                        Storage.updateTimer(TimerState(
                            title = titleDraft.takeIf { it.isNotBlank() },
                        ))
                    },
                    shape = RoundedCornerShape(28.dp),
                    colors = ButtonDefaults.buttonColors(containerColor = MaterialTheme.colorScheme.tertiary),
                ) {
                    Icon(Icons.Filled.Refresh, contentDescription = "Reset")
                    Text("Reset")
                }
            } else {
                Button(
                    onClick = {
                        Storage.updateTimer(current.copy(
                            isActive = false,
                            elapsed = nowElapsed(),
                            startedAt = null,
                        ))
                    },
                    shape = RoundedCornerShape(28.dp),
                    colors = ButtonDefaults.buttonColors(containerColor = MaterialTheme.colorScheme.secondary),
                ) {
                    Text("Pause")
                }
            }
        }
    }
}
