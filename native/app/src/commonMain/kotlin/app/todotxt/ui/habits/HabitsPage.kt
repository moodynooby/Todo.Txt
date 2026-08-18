package app.todotxt.ui.habits

import androidx.compose.foundation.background
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material3.Button
import androidx.compose.material3.Card
import androidx.compose.material3.CardDefaults
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.OutlinedTextField
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.collectAsState
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import app.todotxt.domain.Habit
import app.todotxt.domain.HabitColor
import app.todotxt.domain.HabitUtils
import app.todotxt.domain.IdUtils
import app.todotxt.persistence.Storage

/** Habits workspace — Field Notes Ritual daily check-ins. */
@Composable
fun HabitsPage(habits: List<Habit>) {
    var showCreate by remember { mutableStateOf(false) }
    var draftName by remember { mutableStateOf("") }

    Column(Modifier.fillMaxSize().padding(16.dp)) {
        Text(
            "Habits",
            style = MaterialTheme.typography.headlineMedium,
            fontWeight = FontWeight.Bold,
            modifier = Modifier.padding(bottom = 8.dp),
        )

        Button(
            onClick = { showCreate = !showCreate },
            shape = RoundedCornerShape(20.dp),
            modifier = Modifier.padding(bottom = 12.dp),
        ) {
            Text(if (showCreate) "Cancel" else "+ New habit")
        }

        if (showCreate) {
            Row(verticalAlignment = Alignment.CenterVertically) {
                OutlinedTextField(
                    value = draftName,
                    onValueChange = { draftName = it },
                    placeholder = { Text("Habit name") },
                    modifier = Modifier.weight(1f),
                    singleLine = true,
                )
                Button(
                    onClick = {
                        if (draftName.isNotBlank()) {
                            val now = System.currentTimeMillis()
                            val habit = Habit(
                                id = IdUtils.newId(),
                                name = draftName,
                                color = HabitColor.entries[habits.size % HabitColor.entries.size],
                                createdAt = now,
                                updatedAt = now,
                            )
                            Storage.updateHabits { it + habit }
                            draftName = ""
                            showCreate = false
                        }
                    },
                    shape = RoundedCornerShape(20.dp),
                    modifier = Modifier.padding(start = 8.dp),
                ) {
                    Text("Save")
                }
            }
        }

        LazyColumn(verticalArrangement = Arrangement.spacedBy(12.dp)) {
            items(habits.filter { !it.archived }, key = { it.id }) { habit ->
                HabitCard(habit)
            }
        }
    }
}

@Composable
private fun HabitCard(habit: Habit) {
    val streak = remember(habit) { HabitUtils.getHabitStreak(habit) }
    val best = remember(habit) { HabitUtils.getBestStreak(habit) }
    val rate = remember(habit) { HabitUtils.getCompletionRate(habit) }
    val heatmap = remember(habit) { HabitUtils.getHeatmap(habit) }
    val today = remember { HabitUtils.today() }
    val doneToday = habit.completedDates.contains(today)

    Card(
        modifier = Modifier.fillMaxWidth(),
        shape = RoundedCornerShape(16.dp),
        elevation = CardDefaults.cardElevation(defaultElevation = 2.dp),
    ) {
        Column(Modifier.padding(14.dp)) {
            Row(
                modifier = Modifier.fillMaxWidth(),
                verticalAlignment = Alignment.CenterVertically,
            ) {
                Box(
                    Modifier
                        .size(14.dp)
                        .clip(CircleShape)
                        .background(Color(habit.color.red, habit.color.green, habit.color.blue)),
                )
                Text(
                    habit.name,
                    style = MaterialTheme.typography.titleMedium,
                    fontWeight = FontWeight.Bold,
                    modifier = Modifier.padding(start = 8.dp).weight(1f),
                )
                Button(
                    onClick = { Storage.updateHabits { list ->
                        list.map { if (it.id == habit.id) HabitUtils.toggleDate(it, today) else it }
                    } },
                    shape = RoundedCornerShape(28.dp),
                    enabled = true,
                    modifier = Modifier.padding(start = 8.dp),
                ) {
                    Text(if (doneToday) "Done ✓" else "Mark done")
                }
            }

            Row(
                modifier = Modifier.fillMaxWidth().padding(top = 8.dp),
                horizontalArrangement = Arrangement.SpaceEvenly,
            ) {
                Stat("Streak", "$streak")
                Stat("Best", "$best")
                Stat("28-day", "$rate%")
            }

            Heatmap(heatmap = heatmap, completed = habit.completedDates.toSet())
        }
    }
}

@Composable
private fun Stat(label: String, value: String) {
    Column(horizontalAlignment = Alignment.CenterHorizontally) {
        Text(value, style = MaterialTheme.typography.titleMedium, fontWeight = FontWeight.Bold)
        Text(label, style = MaterialTheme.typography.labelSmall)
    }
}

/**
 * 12-week x 7-day heatmap (portrait orientation: weeks as columns). Colours
 * follow the web habit heatmap intensity steps.
 */
@Composable
private fun Heatmap(heatmap: List<List<String?>>, completed: Set<String>) {
    val base = Color(0xFF2F6F61)
    Row(horizontalArrangement = Arrangement.spacedBy(2.dp), modifier = Modifier.padding(top = 10.dp)) {
        for (week in heatmap) {
            Column(verticalArrangement = Arrangement.spacedBy(2.dp)) {
                for (date in week) {
                    val done = date != null && date in completed
                    val future = date == null
                    Box(
                        Modifier
                            .size(10.dp)
                            .clip(RoundedCornerShape(2.dp))
                            .background(if (future) Color.Transparent else if (done) base else base.copy(alpha = 0.12f)),
                    )
                }
            }
        }
    }
}
