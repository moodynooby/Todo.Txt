package app.todotxt.ui.timer

import androidx.compose.foundation.gestures.detectDragGestures
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.offset
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.widthIn
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Close
import androidx.compose.material.icons.filled.Pause
import androidx.compose.material.icons.filled.PlayArrow
import androidx.compose.material.icons.filled.Refresh
import androidx.compose.material3.Card
import androidx.compose.material3.CardDefaults
import androidx.compose.material3.Icon
import androidx.compose.material3.IconButton
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.LaunchedEffect
import androidx.compose.runtime.collectAsState
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableFloatStateOf
import androidx.compose.runtime.mutableLongStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.shadow
import androidx.compose.ui.input.pointer.pointerInput
import androidx.compose.ui.unit.IntOffset
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import app.todotxt.core.TimerRuntime
import app.todotxt.persistence.Storage
import app.todotxt.platform.nowMillis
import kotlin.math.roundToInt
import kotlinx.coroutines.delay

@Composable
fun FloatingTimerOverlay(modifier: Modifier = Modifier) {
    val timers by Storage.timers.collectAsState()
    val visibleTimers = timers.filter { it.isActive || it.elapsed > 0L }
    if (visibleTimers.isEmpty()) return

    val settings by Storage.settings.collectAsState()
    var offsetX by remember { mutableFloatStateOf(settings.timerOffsetX.toFloat()) }
    var offsetY by remember { mutableFloatStateOf(settings.timerOffsetY.toFloat()) }
    var now by remember { mutableLongStateOf(nowMillis()) }

    LaunchedEffect(Unit) {
        while (true) {
            now = nowMillis()
            delay(500L)
        }
    }

    Box(modifier = modifier) {
        Card(
            modifier = Modifier
                .widthIn(min = 220.dp, max = 340.dp)
                .offset { IntOffset(offsetX.roundToInt(), offsetY.roundToInt()) }
                .shadow(8.dp, RoundedCornerShape(18.dp))
                .pointerInput(Unit) {
                    detectDragGestures { change, dragAmount ->
                        change.consume()
                        offsetX = (offsetX + dragAmount.x).coerceAtLeast(0f)
                        offsetY = (offsetY + dragAmount.y).coerceAtLeast(0f)
                        Storage.updateSettings {
                            it.copy(
                                timerOffsetX = offsetX.roundToInt(),
                                timerOffsetY = offsetY.roundToInt(),
                            )
                        }
                    }
                },
            shape = RoundedCornerShape(18.dp),
            colors = CardDefaults.cardColors(
                containerColor = MaterialTheme.colorScheme.inverseSurface,
                contentColor = MaterialTheme.colorScheme.inverseOnSurface,
            ),
        ) {
            Column(
                modifier = Modifier.padding(horizontal = 12.dp, vertical = 10.dp),
                verticalArrangement = Arrangement.spacedBy(4.dp),
            ) {
                Text(
                    "Timers",
                    style = MaterialTheme.typography.labelMedium,
                    color = MaterialTheme.colorScheme.inverseOnSurface,
                )
                                    visibleTimers.forEach { timer ->

                    val remaining = TimerRuntime.remainingAt(timer, now)
                    val elapsed = TimerRuntime.elapsedAt(timer, now)
                    val display = remaining ?: elapsed
                    val urgent = remaining != null && remaining <= 180_000L
                    Row(
                        modifier = Modifier.fillMaxWidth(),
                        verticalAlignment = Alignment.CenterVertically,
                        horizontalArrangement = Arrangement.spacedBy(4.dp),
                    ) {
                        Column(modifier = Modifier.weight(1f)) {
                            Text(
                                timer.title ?: "Timer",
                                style = MaterialTheme.typography.labelLarge,
                                color = MaterialTheme.colorScheme.inverseOnSurface,
                                maxLines = 1,
                            )
                            Text(
                                formatTimer(display),
                                style = MaterialTheme.typography.titleLarge.copy(fontSize = 22.sp),
                                color = if (urgent) MaterialTheme.colorScheme.errorContainer
                                else MaterialTheme.colorScheme.inversePrimary,
                            )
                        }
                        IconButton(onClick = {
                            Storage.updateTimers { list ->
                                list.map { candidate ->
                                    if (candidate.id == timer.id) {
                                        if (candidate.isActive) TimerRuntime.pause(candidate, now)
                                        else TimerRuntime.start(candidate, now)
                                    } else candidate
                                }
                            }
                        }) {
                            Icon(
                                if (timer.isActive) Icons.Filled.Pause else Icons.Filled.PlayArrow,
                                contentDescription = if (timer.isActive) "Pause" else "Resume",
                            )
                        }
                        IconButton(onClick = {
                            Storage.updateTimers { list ->
                                list.map { candidate ->
                                    if (candidate.id == timer.id) TimerRuntime.reset(candidate) else candidate
                                }
                            }
                        }) {
                            Icon(Icons.Filled.Refresh, contentDescription = "Reset ${timer.title ?: "timer"}")
                        }
                        IconButton(onClick = {
                            Storage.updateTimers { list -> list.filterNot { it.id == timer.id } }
                        }) {
                            Icon(Icons.Filled.Close, contentDescription = "Remove ${timer.title ?: "timer"}")
                        }
                    }
                }
            }
        }
    }
}

private fun formatTimer(milliseconds: Long): String {
    val totalSeconds = (milliseconds / 1000L).coerceAtLeast(0L)
    val hours = totalSeconds / 3600L
    val minutes = (totalSeconds % 3600L) / 60L
    val seconds = totalSeconds % 60L
    fun padded(value: Long) = value.toString().padStart(2, '0')
    return if (hours > 0) "$hours:${padded(minutes)}:${padded(seconds)}"
    else "${minutes}:${padded(seconds)}"
}
