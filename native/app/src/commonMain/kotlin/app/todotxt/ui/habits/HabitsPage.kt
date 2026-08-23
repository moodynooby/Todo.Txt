package app.todotxt.ui.habits

import androidx.compose.foundation.background
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Archive
import androidx.compose.material.icons.filled.Delete
import androidx.compose.material.icons.filled.Edit
import androidx.compose.material.icons.filled.Info
import androidx.compose.material.icons.filled.MoreVert
import androidx.compose.material.icons.filled.Share
import androidx.compose.material.icons.filled.Unarchive
import androidx.compose.material3.AlertDialog
import androidx.compose.material3.Button
import androidx.compose.material3.Card
import androidx.compose.material3.CardDefaults
import androidx.compose.material3.DropdownMenu
import androidx.compose.material3.DropdownMenuItem
import androidx.compose.material3.Icon
import androidx.compose.material3.IconButton
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.OutlinedTextField
import androidx.compose.material3.Switch
import androidx.compose.material3.Text
import androidx.compose.material3.TextButton
import androidx.compose.runtime.Composable
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
import app.todotxt.persistence.exportTodoDocument
import app.todotxt.service.AlarmPermissionManager
import app.todotxt.ui.ColorSwatchRow
import app.todotxt.ui.ConfirmDialog
import app.todotxt.ui.PageHeader
import app.todotxt.ui.SearchField

/** Habits workspace — Field Notes Ritual daily check-ins. */
@Composable
fun HabitsPage(habits: List<Habit>) {
    var showCreate by remember { mutableStateOf(false) }
    var draftName by remember { mutableStateOf("") }
    var searchQuery by remember { mutableStateOf("") }
    var editTarget by remember { mutableStateOf<Habit?>(null) }
    var exportMenuOpen by remember { mutableStateOf(false) }

    val alarmPermission = AlarmPermissionManager.rememberPermissionStatus()

    Column(Modifier.fillMaxSize().padding(16.dp)) {
        PageHeader("Habits", modifier = Modifier.padding(bottom = 8.dp))

        // Exact-alarm permission guide (web parity: ExactAlarmPermission.tsx).
        if (AlarmPermissionManager.requiresExactAlarmGrant() && !alarmPermission.value) {
            Row(
                modifier = Modifier
                    .fillMaxWidth()
                    .background(MaterialTheme.colorScheme.tertiaryContainer)
                    .padding(12.dp),
                verticalAlignment = Alignment.CenterVertically,
            ) {
                Icon(Icons.Filled.Info, contentDescription = null, tint = MaterialTheme.colorScheme.onTertiaryContainer)
                Column(modifier = Modifier.weight(1f).padding(start = 8.dp)) {
                    Text(
                        "Reminder accuracy",
                        style = MaterialTheme.typography.bodyMedium,
                        fontWeight = FontWeight.Bold,
                        color = MaterialTheme.colorScheme.onTertiaryContainer,
                    )
                    Text(
                        "Allow exact alarms so habit reminders fire at your chosen time.",
                        style = MaterialTheme.typography.bodySmall,
                        color = MaterialTheme.colorScheme.onTertiaryContainer,
                    )
                }
                TextButton(onClick = { AlarmPermissionManager.openExactAlarmSettings() }) {
                    Text("Open Settings")
                }
            }
            Spacer(modifier = Modifier.height(8.dp))
        }

        // Search + habits export, mirroring the web habitsBackup surface.
        Row(
            modifier = Modifier
                .fillMaxWidth()
                .padding(bottom = 8.dp),
            verticalAlignment = Alignment.CenterVertically,
        ) {
            SearchField(
                value = searchQuery,
                onValueChange = { searchQuery = it },
                placeholder = "Search habits…",
                modifier = Modifier.weight(1f),
            )
            IconButton(onClick = { exportMenuOpen = true }) {
                Icon(Icons.Filled.Share, contentDescription = "Export habits")
            }
            DropdownMenu(expanded = exportMenuOpen, onDismissRequest = { exportMenuOpen = false }) {
                DropdownMenuItem(
                    text = { Text("Export habits (JSON)") },
                    onClick = {
                        exportMenuOpen = false
                        exportHabits()
                    },
                )
            }
        }

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

        val visibleHabits = habits.filter { !it.archived }
            .filter { searchQuery.isBlank() || it.name.contains(searchQuery, ignoreCase = true) }

        if (visibleHabits.isEmpty()) {
            Box(Modifier.weight(1f).fillMaxWidth(), contentAlignment = Alignment.Center) {
                app.todotxt.ui.todo.EmptyStateArt()
            }
        } else {
            LazyColumn(modifier = Modifier.weight(1f), verticalArrangement = Arrangement.spacedBy(12.dp)) {
                items(
                    visibleHabits,
                    key = { it.id },
                ) { habit ->
                    HabitCard(habit, onEdit = { editTarget = habit })
                }
            }
        }
    }

    editTarget?.let { habit ->
        EditHabitDialog(habit = habit, onDismiss = { editTarget = null })
    }
}

/** Habits export (web parity: `habitsBackup.ts` JSON mirror shape). */
private fun exportHabits() {
    val habits = Storage.habits.value
    val items = habits.joinToString(",") { habit ->
        buildString {
            append("""{"id":""" + habit.id.escapeJson() + """","name":""" + habit.name.escapeJson() + """","color":""" + habit.color.name + """","reminder":${habit.reminderEnabled},"completedDates":[""" + habit.completedDates.joinToString(",") { """"$it"""" } + """],"createdAt":""" + habit.createdAt + ""","updatedAt":""" + habit.updatedAt + """}""")
        }
    }
    exportTodoDocument("""{"habits":[${items}],"updatedAt":""" + System.currentTimeMillis() + """}""")
}

private fun String.escapeJson(): String =
    replace("\\", "\\\\").replace("\"", "\\\"").replace("\n", "\\n").replace("\r", "\\r")

@Composable
private fun HabitCard(
    habit: Habit,
    onEdit: () -> Unit = {},
) {
    val streak = remember(habit) { HabitUtils.getHabitStreak(habit) }
    val best = remember(habit) { HabitUtils.getBestStreak(habit) }
    val rate = remember(habit) { HabitUtils.getCompletionRate(habit) }
    val heatmap = remember(habit) { HabitUtils.getHeatmap(habit) }
    val today = remember { HabitUtils.today() }
    val doneToday = habit.completedDates.contains(today)
    var menuOpen by remember { mutableStateOf(false) }
    var confirmDelete by remember { mutableStateOf(false) }

    Card(
        modifier = Modifier.fillMaxWidth(),
        shape = RoundedCornerShape(16.dp),
        elevation = CardDefaults.cardElevation(defaultElevation = 2.dp),
    ) {
        Column(Modifier.padding(14.dp)) {
            Row(
                modifier = Modifier.fillMaxWidth(),
                verticalAlignment = Alignment.Top,
            ) {
                Box(
                    Modifier
                        .padding(top = 6.dp)
                        .size(14.dp)
                        .clip(CircleShape)
                        .background(Color(habit.color.red, habit.color.green, habit.color.blue)),
                )
                Text(
                    habit.name,
                    style = MaterialTheme.typography.titleMedium,
                    fontWeight = FontWeight.Bold,
                    modifier = Modifier
                        .padding(start = 8.dp, top = 2.dp)
                        .weight(1f),
                )
                Box {
                    IconButton(onClick = { menuOpen = true }) {
                        Icon(Icons.Filled.MoreVert, contentDescription = "Habit actions")
                    }
                    DropdownMenu(
                        expanded = menuOpen,
                        onDismissRequest = { menuOpen = false },
                    ) {
                        DropdownMenuItem(
                            text = { Text("Edit habit") },
                            leadingIcon = { Icon(Icons.Filled.Edit, contentDescription = null) },
                            onClick = {
                                menuOpen = false
                                onEdit()
                            },
                        )
                        DropdownMenuItem(
                            text = { Text(if (habit.archived) "Restore habit" else "Archive habit") },
                            leadingIcon = {
                                Icon(
                                    if (habit.archived) Icons.Filled.Unarchive else Icons.Filled.Archive,
                                    contentDescription = null,
                                )
                            },
                            onClick = {
                                menuOpen = false
                                Storage.updateHabits { list ->
                                    list.map { if (it.id == habit.id) it.copy(archived = !it.archived) else it }
                                }
                            },
                        )
                        DropdownMenuItem(
                            text = { Text("Delete habit", color = MaterialTheme.colorScheme.error) },
                            leadingIcon = {
                                Icon(Icons.Filled.Delete, contentDescription = null, tint = MaterialTheme.colorScheme.error)
                            },
                            onClick = {
                                menuOpen = false
                                confirmDelete = true
                            },
                        )
                    }
                }
            }

            Button(
                onClick = {
                    Storage.updateHabits { list ->
                        list.map { if (it.id == habit.id) HabitUtils.toggleDate(it, today) else it }
                    }
                },
                shape = RoundedCornerShape(28.dp),
                modifier = Modifier.fillMaxWidth().padding(top = 10.dp),
            ) {
                Text(if (doneToday) "Done ✓" else "Mark done")
            }

            Row(
                modifier = Modifier.fillMaxWidth().padding(top = 8.dp),
                horizontalArrangement = Arrangement.SpaceEvenly,
                verticalAlignment = Alignment.CenterVertically,
            ) {
                Stat("Streak", "$streak")
                Stat("Best", "$best")
                Stat("28-day", "$rate%")
            }

            Row(
                modifier = Modifier.fillMaxWidth().padding(top = 6.dp),
                verticalAlignment = Alignment.CenterVertically,
            ) {
                Text(
                    "Daily reminder",
                    style = MaterialTheme.typography.bodySmall,
                    modifier = Modifier.weight(1f),
                )
                Switch(
                    checked = habit.reminderEnabled,
                    onCheckedChange = { remind ->
                        Storage.updateHabits { list ->
                            list.map { if (it.id == habit.id) it.copy(reminderEnabled = remind) else it }
                        }
                    },
                )
            }

            Heatmap(heatmap = heatmap, completed = habit.completedDates.toSet())
        }
    }

    if (confirmDelete) {
        ConfirmDialog(
            title = "Delete habit?",
            text = "This removes the habit and its history. This action cannot be undone.",
            confirmLabel = "Delete",
            destructive = true,
            onConfirm = {
                Storage.updateHabits { list -> list.filter { it.id != habit.id } }
                confirmDelete = false
            },
            onDismiss = { confirmDelete = false },
        )
    }
}

/** Edit dialog (web parity: HabitCardEditor) — name, colour, reminder. */
@Composable
private fun EditHabitDialog(
    habit: Habit,
    onDismiss: () -> Unit,
) {
    var name by remember { mutableStateOf(habit.name) }
    var color by remember { mutableStateOf(habit.color) }
    AlertDialog(
        onDismissRequest = onDismiss,
        title = { Text("Edit habit") },
        text = {
            Column {
                OutlinedTextField(
                    value = name,
                    onValueChange = { name = it },
                    singleLine = true,
                    modifier = Modifier.fillMaxWidth(),
                )
                ColorSwatchRow(
                    colors = HabitColor.entries.map { Color(it.red, it.green, it.blue) },
                    selectedIndex = HabitColor.entries.indexOf(color),
                    onSelect = { color = HabitColor.entries[it] },
                    modifier = Modifier.padding(top = 8.dp),
                )
            }
        },
        confirmButton = {
            TextButton(
                onClick = {
                    val now = System.currentTimeMillis()
                    Storage.updateHabits { list ->
                        list.map {
                            if (it.id == habit.id) it.copy(
                                name = name, color = color, updatedAt = now,
                            ) else it
                        }
                    }
                    onDismiss()
                },
            ) { Text("Save") }
        },
        dismissButton = {
            TextButton(onClick = onDismiss) { Text("Cancel") }
        },
    )
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
