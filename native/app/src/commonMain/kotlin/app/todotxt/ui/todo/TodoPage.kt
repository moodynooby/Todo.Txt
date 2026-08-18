package app.todotxt.ui.todo

import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.ExperimentalFoundationApi
import androidx.compose.foundation.combinedClickable
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.PaddingValues
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.width
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.itemsIndexed
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Share
import androidx.compose.material3.Checkbox
import androidx.compose.material3.DropdownMenu
import androidx.compose.material3.DropdownMenuItem
import androidx.compose.material3.ExperimentalMaterial3Api
import androidx.compose.material3.FilterChip
import androidx.compose.material3.Icon
import androidx.compose.material3.IconButton
import androidx.compose.material3.MaterialTheme
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
import androidx.compose.ui.graphics.vector.rememberVectorPainter
import androidx.compose.ui.input.pointer.pointerInput
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import app.todotxt.domain.FilterType
import app.todotxt.domain.ParsedTodoContent
import app.todotxt.domain.TodoParser
import app.todotxt.persistence.ImportExportBridge
import app.todotxt.persistence.Storage
import app.todotxt.persistence.exportTodoDocument
import app.todotxt.persistence.importTodoDocument
import app.todotxt.theme.Shapes

/**
 * Todo workspace — quick-add bar with suggestions, filter chips, bulk actions,
 * drag-to-reorder, and import/export of the todo.txt document.
 */
@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun TodoPage(content: String) {
    var filter by remember { mutableStateOf<FilterType?>(null) }
    var selectedIds by remember { mutableStateOf(setOf<Int>()) }
    var importMenuOpen by remember { mutableStateOf(false) }

    Column(Modifier.fillMaxSize().padding(16.dp)) {
        Row(
            modifier = Modifier.fillMaxWidth(),
            verticalAlignment = Alignment.CenterVertically,
        ) {
            Text(
                "Todos",
                style = MaterialTheme.typography.headlineMedium,
                fontWeight = FontWeight.Bold,
                modifier = Modifier.padding(end = 8.dp),
            )
            // Import / export of the raw todo.txt document.
            IconButton(onClick = { importMenuOpen = true }) {
                Icon(Icons.Filled.Share, contentDescription = "Import / Export")
            }
            DropdownMenu(
                expanded = importMenuOpen,
                onDismissRequest = { importMenuOpen = false },
            ) {
                DropdownMenuItem(
                    text = { Text("Import todo.txt (merge)") },
                    onClick = {
                        importMenuOpen = false
                        importTodoDocument()
                    },
                )
                DropdownMenuItem(
                    text = { Text("Export todo.txt") },
                    onClick = {
                        importMenuOpen = false
                        exportTodoDocument(content)
                    },
                )
            }
        }

        // Quick-add bar with +project / @context / due: suggestions.
        val parsed = remember(content) { TodoParser.parseTodoContent(content) }
        QuickAddBar(
            parsed = parsed,
            modifier = Modifier.padding(vertical = 8.dp),
        )

        // Filter chips mirror the web filter bar (priority / project / context / due / done).
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
        if (selectedIds.isNotEmpty()) {
            BulkActionsBar(
                selectedIds = selectedIds,
                tasks = shown,
                onToggle = { id -> selectedIds = selectedIds - id },
                onDone = { selectedIds = emptySet() },
            )
        }

        TodoList(
            parsed = parsed,
            tasks = shown,
            selectedIds = selectedIds,
            onToggleSelection = { id ->
                selectedIds = if (id in selectedIds) selectedIds - id
                else selectedIds + id
            },
            onSelect = { id -> selectedIds = setOf(id) },
            onDeselect = { selectedIds = emptySet() },
        )
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
private fun TodoList(
    parsed: ParsedTodoContent,
    tasks: List<app.todotxt.domain.Task>,
    selectedIds: Set<Int>,
    onToggleSelection: (Int) -> Unit,
    onSelect: (Int) -> Unit,
    onDeselect: () -> Unit,
) {
    val content by Storage.content.collectAsState()

    // Drag-reorder: moving task at line `from` to line `to` in the raw document.
    fun moveLine(from: Int, to: Int) {
        val lines = content.split("\n")
        if (lines.isEmpty() || from >= lines.size || to >= lines.size) return
        if (from == to) return
        val clampedTo = to.coerceAtMost(lines.size - 1)
        val reordered = lines.toMutableList().apply {
            add(clampedTo, removeAt(from))
        }
        Storage.setContent(reordered.joinToString("\n"))
    }

    LazyColumn(modifier = Modifier.fillMaxSize()) {
        itemsIndexed(tasks) { index, task ->
            TaskRow(
                task = task,
                index = index,
                isSelected = task.id in selectedIds,
                onMove = ::moveLine,
                onToggle = {
                    val updated = TodoParser.setLineCompleted(content, task.id, !task.completed)
                    Storage.setContent(updated)
                },
                onSelect = onSelect,
                onDeselect = onDeselect,
                onToggleSelection = onToggleSelection,
            )
        }
    }
}

@OptIn(ExperimentalFoundationApi::class)
@Composable
private fun TaskRow(
    task: app.todotxt.domain.Task,
    index: Int,
    isSelected: Boolean,
    onMove: (Int, Int) -> Unit = { _, _ -> },
    onToggle: () -> Unit,
    onSelect: (Int) -> Unit,
    onDeselect: () -> Unit,
    onToggleSelection: (Int) -> Unit,
) {
    Surface(
        modifier = Modifier
            .fillMaxWidth()
            .padding(vertical = 3.dp)
            .background(
                if (isSelected) MaterialTheme.colorScheme.secondaryContainer
                else MaterialTheme.colorScheme.surface,
            ),
        shape = RoundedCornerShape(Shapes.Lg),
        tonalElevation = if (task.completed) 0.dp else 1.dp,
    ) {
        Row(
            modifier = Modifier
                .fillMaxWidth()
                .combinedClickable(
                    onClick = { onDeselect() },
                    onLongClick = { onSelect(task.id) },
                )
                .padding(horizontal = 10.dp, vertical = 6.dp),
            verticalAlignment = Alignment.CenterVertically,
        ) {
            // Drag handle: grab to reorder this line in the raw document.
            Text(
                text = "⋮⋮",
                modifier = Modifier
                    .padding(end = 6.dp)
                    .width(18.dp)
                    .reorderableItem(index, onMove),
                color = MaterialTheme.colorScheme.onSurfaceVariant,
            )
            Checkbox(
                checked = isSelected || task.completed,
                onCheckedChange = {
                    if (isSelected) onToggleSelection(task.id) else onToggle()
                },
            )
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
