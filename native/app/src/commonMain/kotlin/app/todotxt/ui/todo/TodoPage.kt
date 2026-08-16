package app.todotxt.ui.todo

import androidx.compose.foundation.background
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.PaddingValues
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.itemsIndexed
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Add
import androidx.compose.material3.Button
import androidx.compose.material3.Checkbox
import androidx.compose.material3.ExperimentalMaterial3Api
import androidx.compose.material3.FilterChip
import androidx.compose.material3.Icon
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.OutlinedTextField
import androidx.compose.material3.Surface
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.collectAsState
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import app.todotxt.domain.FilterType
import app.todotxt.domain.ParsedTodoContent
import app.todotxt.domain.TodoParser
import app.todotxt.persistence.Storage
import app.todotxt.theme.Shapes

/** Todo workspace — quick add + parsed todo.txt list, mark done inline. */
@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun TodoPage(content: String) {
    var input by remember { mutableStateOf("") }
    var filter by remember { mutableStateOf<FilterType?>(null) }

    Column(Modifier.fillMaxSize().padding(16.dp)) {
        Text(
            "Todos",
            style = MaterialTheme.typography.headlineMedium,
            fontWeight = FontWeight.Bold,
            modifier = Modifier.padding(bottom = 8.dp),
        )

        // Quick add, like the web `QuickAdd`.
        Row(verticalAlignment = Alignment.CenterVertically, modifier = Modifier.fillMaxWidth()) {
            OutlinedTextField(
                value = input,
                onValueChange = { input = it },
                placeholder = { Text("Add a todo… (+project @context due:today)") },
                modifier = Modifier.weight(1f),
                shape = RoundedCornerShape(Shapes.Xl),
                singleLine = true,
            )
            Button(
                onClick = {
                    if (input.isNotBlank()) {
                        val existing = Storage.content.value
                        val append = if (existing.isBlank()) input else "$existing\n$input"
                        Storage.setContent(append)
                        input = ""
                    }
                },
                shape = RoundedCornerShape(Shapes.Xl),
                modifier = Modifier.padding(start = 8.dp),
                contentPadding = PaddingValues(horizontal = 14.dp, vertical = 10.dp),
            ) {
                Icon(Icons.Filled.Add, contentDescription = "Add")
            }
        }

        // Filter chips mirror the web filter bar (priority / project / context / due / done).
        val parsed = remember(content) { TodoParser.parseTodoContent(content) }
        Row(modifier = Modifier.padding(vertical = 8.dp), horizontalArrangement = Arrangement.spacedBy(6.dp)) {
            FilterChip(
                selected = filter == null,
                onClick = { filter = null },
                label = { Text("All") },
            )
            FilterChip(
                selected = filter == FilterType.PROJECT,
                onClick = { filter = FilterType.PROJECT },
                label = { Text("+projects") },
            )
            FilterChip(
                selected = filter == FilterType.CONTEXT,
                onClick = { filter = FilterType.CONTEXT },
                label = { Text("@contexts") },
            )
            FilterChip(
                selected = filter == FilterType.DUE,
                onClick = { filter = FilterType.DUE },
                label = { Text("due") },
            )
            FilterChip(
                selected = filter == FilterType.COMPLETION,
                onClick = { filter = FilterType.COMPLETION },
                label = { Text("done") },
            )
        }

        val shown = filteredTasks(parsed, filter)
        TodoList(parsed, shown)
    }
}

private fun filteredTasks(
    parsed: ParsedTodoContent,
    filter: FilterType?,
): List<app.todotxt.domain.Task> {
    val tasks = parsed.tasks
    return when (filter) {
        null -> tasks
        FilterType.PROJECT -> tasks.filter { it.projects.isNotEmpty() }
        FilterType.CONTEXT -> tasks.filter { it.contexts.isNotEmpty() }
        FilterType.DUE -> tasks.filter { it.due != null }
        FilterType.COMPLETION -> tasks.filter { it.completed }
        else -> tasks
    }
}

@Composable
private fun TodoList(parsed: ParsedTodoContent, tasks: List<app.todotxt.domain.Task>) {
    val content by Storage.content.collectAsState()
    LazyColumn(modifier = Modifier.fillMaxSize()) {
        itemsIndexed(tasks) { _, task ->
            TaskRow(
                task = task,
                onToggle = {
                    val updated = TodoParser.setLineCompleted(content, task.id, !task.completed)
                    Storage.setContent(updated)
                },
            )
        }
    }
}

@Composable
private fun TaskRow(
    task: app.todotxt.domain.Task,
    onToggle: () -> Unit,
) {
    Surface(
        modifier = Modifier.fillMaxWidth().padding(vertical = 3.dp),
        shape = RoundedCornerShape(Shapes.Lg),
        tonalElevation = if (task.completed) 0.dp else 1.dp,
    ) {
        Row(
            modifier = Modifier.fillMaxWidth().padding(horizontal = 10.dp, vertical = 6.dp),
            verticalAlignment = Alignment.CenterVertically,
        ) {
            Checkbox(checked = task.completed, onCheckedChange = { onToggle() })
            Column(modifier = Modifier.weight(1f)) {
                Text(
                    task.text,
                    style = MaterialTheme.typography.bodyLarge,
                    color = if (task.completed) {
                        MaterialTheme.colorScheme.onSurfaceVariant
                    } else {
                        MaterialTheme.colorScheme.onSurface
                    },
                )
                Row(horizontalArrangement = Arrangement.spacedBy(6.dp)) {
                    task.priority?.let {
                        FilterChip(
                            selected = false,
                            onClick = {},
                            label = { Text("($it)") },
                            enabled = false,
                        )
                    }
                    task.due?.let {
                        FilterChip(
                            selected = false,
                            onClick = {},
                            label = { Text("due:$it") },
                            enabled = false,
                        )
                    }
                }
            }
        }
    }
}
