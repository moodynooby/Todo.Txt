package app.todotxt.ui.todo

import androidx.compose.animation.core.RepeatMode
import androidx.compose.animation.core.animateFloatAsState
import androidx.compose.animation.core.infiniteRepeatable
import androidx.compose.animation.core.tween
import androidx.compose.foundation.background
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Add
import androidx.compose.material3.Icon
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.LaunchedEffect
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.graphicsLayer
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import kotlinx.coroutines.delay

/**
 * Pet companion strip — Compose port of the web app's `PetStrip`/`EditorPlay`
 * delight layer. A tiny seedling that reacts to the document's rhythm: it
 * bounces when a task is added, celebrates when one completes, cheers when
 * everything is done, and settles into a gentle idle breathe otherwise.
 * Tapping it scrolls the user back to the quick-add bar.
 */

typealias PetMood = String

object PetMoods {
    const val IDLE = "idle"
    const val ADD = "add"
    const val CELEBRATE = "celebrate"
    const val CHEER = "cheer"
}

private val PET_FACES = mapOf(
    PetMoods.IDLE to "🌱",
    PetMoods.ADD to "🌿",
    PetMoods.CELEBRATE to "🎉",
    PetMoods.CHEER to "✨",
)

private val PET_SPEAK = mapOf(
    PetMoods.IDLE to emptyList<String>(),
    PetMoods.ADD to listOf("New task! 🎈", "Got it!", "On the list!"),
    PetMoods.CELEBRATE to listOf("Nice work!", "One down!", "Keep going!"),
    PetMoods.CHEER to listOf("You're on fire! 🔥", "Great streak!", "Look at you go!"),
)

private val WARM_PROMPTS = listOf(
    "What's on your mind?",
    "One small thing first…",
    "Anything you'd like to remember?",
    "What will make today feel done?",
    "Start anywhere — no line is too small.",
    "Your future self will thank you.",
)

/**
 * Task-rhythm dots: one capsule per task, filled for the completed ones —
 * the heartbeat strip from the web editor. Only shown when there is at
 * least one task to celebrate.
 */
@Composable
fun TaskRhythmStrip(
    taskCount: Int,
    doneCount: Int,
    modifier: Modifier = Modifier,
) {
    Row(modifier = modifier, horizontalArrangement = Arrangement.spacedBy(4.dp)) {
        repeat(taskCount) { dotIndex ->
            val done = dotIndex < doneCount
            Box(
                modifier = Modifier
                    .background(
                        color = if (done) {
                            MaterialTheme.colorScheme.primary
                        } else {
                            MaterialTheme.colorScheme.surfaceVariant
                        },
                        shape = RoundedCornerShape(50),
                    )
                    .padding(horizontal = 6.dp, vertical = 2.dp),
            )
        }
    }
}

/** Rotating warm placeholder — swaps softly every ~7 seconds of idleness. */
@Composable
fun warmPlaceholder(): String {
    var promptIndex by remember { mutableStateOf(0) }
    LaunchedEffect(Unit) {
        while (true) {
            delay(7000)
            promptIndex = (promptIndex + 1) % WARM_PROMPTS.size
        }
    }
    return WARM_PROMPTS[promptIndex]
}

/** Derives the pet's mood from document activity (task count / done count). */
@Composable
fun rememberPetMood(taskCount: Int, doneCount: Int): PetMood {
    var mood by remember { mutableStateOf(PetMoods.IDLE) }
    var prevCounts by remember { mutableStateOf(taskCount to doneCount) }
    LaunchedEffect(taskCount, doneCount) {
        val (prevTasks, prevDone) = prevCounts
        if (taskCount != prevTasks && taskCount > prevTasks) {
            mood = PetMoods.ADD
        } else if (doneCount != prevDone && doneCount > prevDone) {
            mood = if (doneCount == taskCount && taskCount > 0) PetMoods.CHEER
            else PetMoods.CELEBRATE
        }
        prevCounts = taskCount to doneCount
        delay(1500)
        mood = PetMoods.IDLE
    }
    return mood
}

/** Empty-state art: seedling + warm prompt when the document is bare. */
@Composable
fun EmptyStateArt(modifier: Modifier = Modifier) {
    val breathe by animateFloatAsState(
        targetValue = 1.08f,
        animationSpec = infiniteRepeatable(
            animation = tween(3000),
            repeatMode = RepeatMode.Reverse,
        ),
        label = "empty-breathe",
    )
    val prompt = warmPlaceholder()
    Column(
        modifier = modifier.padding(vertical = 16.dp),
        horizontalAlignment = Alignment.CenterHorizontally,
    ) {
        Text(
            text = "🌱",
            style = MaterialTheme.typography.displaySmall,
            modifier = Modifier.graphicsLayer(scaleX = breathe, scaleY = breathe),
        )
        Text(
            text = prompt,
            style = MaterialTheme.typography.bodyMedium,
            color = MaterialTheme.colorScheme.onSurfaceVariant,
            modifier = Modifier.padding(top = 8.dp),
        )
    }
}

/**
 * The pet strip itself: speech bubble, animated seedling face, progress
 * readout, and a tap target that invites the user to add a task.
 */
@Composable
fun PetStrip(
    taskCount: Int,
    doneCount: Int,
    mood: PetMood = PetMoods.IDLE,
    onNudge: () -> Unit,
    modifier: Modifier = Modifier,
) {
    var bubble by remember(mood) {
        mutableStateOf(
            if (mood == PetMoods.IDLE) null
            else (PET_SPEAK[mood] ?: emptyList()).randomOrNull(),
        )
    }
    LaunchedEffect(mood) {
        delay(2200)
        bubble = null
    }
    val dance by animateFloatAsState(
        targetValue = if (mood == PetMoods.CELEBRATE) 12f else 0f,
        animationSpec = tween(durationMillis = if (mood == PetMoods.CELEBRATE) 300 else 600),
        label = "pet-dance",
    )
    val progress = if (taskCount > 0) (doneCount * 100 / taskCount) else 0
    Row(
        modifier = modifier
            .background(
                color = MaterialTheme.colorScheme.surfaceVariant,
                shape = CircleShape,
            )
            .padding(horizontal = 12.dp, vertical = 6.dp)
            .clickable(onClick = onNudge),
        verticalAlignment = Alignment.CenterVertically,
        horizontalArrangement = Arrangement.spacedBy(6.dp),
    ) {
        bubble?.let {
            Text(
                text = it,
                style = MaterialTheme.typography.labelSmall,
                fontWeight = FontWeight.SemiBold,
                color = MaterialTheme.colorScheme.onSurfaceVariant,
            )
        }
        Text(
            text = PET_FACES[mood] ?: "🌱",
            style = MaterialTheme.typography.bodyLarge,
            modifier = Modifier.graphicsLayer(
                translationY = if (mood == PetMoods.ADD) -dance else 0f,
            ),
        )
        if (taskCount > 0) {
            Text(
                text = "$doneCount/$taskCount · $progress%",
                style = MaterialTheme.typography.labelSmall,
                color = MaterialTheme.colorScheme.onSurfaceVariant,
            )
        }
        Icon(
            Icons.Filled.Add,
            contentDescription = "Add a task",
            tint = MaterialTheme.colorScheme.onSurfaceVariant,
        )
    }
}
