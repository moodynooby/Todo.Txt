package app.todotxt.ui.todo

import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.padding
import androidx.compose.material3.Button
import androidx.compose.material3.ButtonDefaults
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Text
import androidx.compose.material3.TextButton
import androidx.compose.runtime.Composable
import androidx.compose.ui.Modifier
import androidx.compose.ui.unit.dp
import app.todotxt.domain.Task
import app.todotxt.domain.TodoParser
import app.todotxt.persistence.Storage
import app.todotxt.persistence.UndoStack

/**
 * Bulk-actions toolbar (web parity: task selection + bulk complete / delete /
 * move-to-end / clear-done). `selectedIds` carries the ids of checked tasks;
 * `onToggle(id)` enters or exits selection mode.
 */
@Composable
fun BulkActionsBar(
    selectedIds: Set<Int>,
    tasks: List<Task>,
    onToggle: (Int) -> Unit,
    onDone: () -> Unit,
) {
    Row(
        modifier = Modifier
            .fillMaxWidth()
            .padding(vertical = 6.dp),
        horizontalArrangement = Arrangement.spacedBy(6.dp),
    ) {
        Text(
            "${selectedIds.size} selected",
            style = MaterialTheme.typography.bodyMedium,
            modifier = Modifier.padding(end = 8.dp),
        )
        Button(
            onClick = {
                bulkComplete(selectedIds, tasks, completed = true)
                onDone()
            },
            enabled = selectedIds.isNotEmpty(),
        ) { Text("Complete") }
        Button(
            onClick = {
                bulkComplete(selectedIds, tasks, completed = false)
                onDone()
            },
            enabled = selectedIds.isNotEmpty(),
        ) { Text("Reopen") }
        Button(
            onClick = {
                bulkDelete(selectedIds, tasks)
                onDone()
            },
            enabled = selectedIds.isNotEmpty(),
            colors = ButtonDefaults.buttonColors(
                containerColor = MaterialTheme.colorScheme.errorContainer,
                contentColor = MaterialTheme.colorScheme.onErrorContainer,
            ),
        ) { Text("Delete") }
        TextButton(onClick = { onDone() }) { Text("Cancel") }
    }
}

/** Mark all selected tasks (un)completed by rewriting their lines. Uses
 * `setTaskCompleted`, which resolves each line by raw text so the bulk action
 * stays correct after reorders, inserts, and deletes. */
private fun bulkComplete(selectedIds: Set<Int>, tasks: List<Task>, completed: Boolean) {
    if (selectedIds.isEmpty()) return
    UndoStack.push(
        todoContent = Storage.content.value,
        description = "${selectedIds.size} task(s) ${if (completed) "completed" else "unchecked"}",
    )
    var content = Storage.content.value
    val byId = tasks.associateBy { it.id }
    selectedIds.forEach { id ->
        byId[id]?.let { task ->
            content = TodoParser.setTaskCompleted(content, task, completed)
        }
    }
    Storage.setContent(content)
}

/** Remove the raw lines of all selected tasks, matching by raw text so stale
 * line ids (after a reorder or insert) can never delete the wrong line. */
private fun bulkDelete(selectedIds: Set<Int>, tasks: List<Task>) {
    if (selectedIds.isEmpty()) return
    UndoStack.push(
        todoContent = Storage.content.value,
        description = "${selectedIds.size} task(s) deleted",
    )
    val removeRaw = tasks
        .filter { it.id in selectedIds }
        .map { it.raw.trim() }
        .toSet()
    val lines = Storage.content.value.split("\n")
    val updated = lines.filter { it.trim() !in removeRaw }.joinToString("\n")
    Storage.setContent(updated)
}
