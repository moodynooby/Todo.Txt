package app.todotxt.ui.capture

import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.AddTask
import androidx.compose.material.icons.filled.Brush
import androidx.compose.material.icons.filled.Note
import androidx.compose.material3.Button
import androidx.compose.material3.Card
import androidx.compose.material3.CardDefaults
import androidx.compose.material3.Icon
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.OutlinedTextField
import androidx.compose.material3.Text
import androidx.compose.material3.TextButton
import androidx.compose.runtime.Composable
import androidx.compose.runtime.collectAsState
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Modifier
import androidx.compose.ui.unit.dp
import app.todotxt.domain.IdUtils
import app.todotxt.domain.Note
import app.todotxt.domain.NoteColor
import app.todotxt.domain.TodoParser
import app.todotxt.persistence.Storage
import app.todotxt.ui.Workspace
import app.todotxt.ui.PageHeader

/**
 * Unified capture home inspired by Keep: one quick-capture surface and a
 * lightweight stream of recent content. Todo, note, and drawing documents stay
 * separate; this page only provides a coherent entry point and preview.
 */
@Composable
fun CapturePage(onOpen: (Workspace) -> Unit) {
    val content by Storage.content.collectAsState()
    val notes by Storage.notes.collectAsState()
    val drawings by Storage.drawings.collectAsState()
    var draft by remember { mutableStateOf("") }
    var captureType by remember { mutableStateOf(CaptureType.TASK) }
    val parsed = remember(content) { TodoParser.parseTodoContent(content) }
    val recentNotes = remember(notes) { notes.sortedByDescending(Note::updatedAt).take(8) }
    val openTasks = remember(parsed) { parsed.tasks.filterNot { it.completed }.take(8) }
    val recentDrawings = remember(drawings) { drawings.sortedByDescending { it.createdAt }.take(4) }

    Column(Modifier.fillMaxSize().padding(20.dp)) {
        PageHeader("Capture", modifier = Modifier.padding(bottom = 12.dp))
        Card(
            colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.surfaceVariant),
            modifier = Modifier.fillMaxWidth(),
        ) {
            Column(Modifier.padding(16.dp), verticalArrangement = Arrangement.spacedBy(10.dp)) {
                Text("Capture something", style = MaterialTheme.typography.titleMedium)
                OutlinedTextField(
                    value = draft,
                    onValueChange = { draft = it },
                    modifier = Modifier.fillMaxWidth(),
                    placeholder = { Text(if (captureType == CaptureType.TASK) "Add a task…" else "Write a note…") },
                    minLines = if (captureType == CaptureType.TASK) 1 else 3,
                )
                Row(horizontalArrangement = Arrangement.spacedBy(8.dp)) {
                    TextButton(onClick = { captureType = CaptureType.TASK }) {
                        Icon(Icons.Filled.AddTask, contentDescription = null)
                        Text(" Task")
                    }
                    TextButton(onClick = { captureType = CaptureType.NOTE }) {
                        Icon(Icons.Filled.Note, contentDescription = null)
                        Text(" Note")
                    }
                    Spacer(Modifier.weight(1f))
                    Button(
                        enabled = draft.isNotBlank(),
                        onClick = {
                            val value = draft.trim()
                            if (captureType == CaptureType.TASK) {
                                val next = buildString {
                                    append(content)
                                    if (isNotEmpty() && !endsWith("\n")) append('\n')
                                    append(value)
                                }
                                Storage.setContent(next)
                            } else {
                                val now = app.todotxt.platform.nowMillis()
                                Storage.updateNotes { it + Note(IdUtils.newId(), "", value, NoteColor.LEMON, createdAt = now, updatedAt = now) }
                            }
                            draft = ""
                        },
                    ) { Text("Save") }
                }
            }
        }

        LazyColumn(
            modifier = Modifier.weight(1f).fillMaxWidth(),
            verticalArrangement = Arrangement.spacedBy(8.dp),
        ) {
            item { SectionTitle("Open tasks", onOpen = { onOpen(Workspace.TODO) }) }
            if (openTasks.isEmpty()) {
                item { Text("No open tasks", style = MaterialTheme.typography.bodyMedium) }
            } else {
                items(openTasks, key = { it.id }) { task ->
                    PreviewCard(
                        icon = { Icon(Icons.Filled.AddTask, contentDescription = null) },
                        title = task.text,
                        subtitle = task.due ?: "Todo.txt",
                        onClick = { onOpen(Workspace.TODO) },
                    )
                }
            }
            item { SectionTitle("Recent notes", onOpen = { onOpen(Workspace.NOTES) }) }
            if (recentNotes.isEmpty()) {
                item { Text("No notes yet", style = MaterialTheme.typography.bodyMedium) }
            } else {
                items(recentNotes, key = { it.id }) { note ->
                    PreviewCard(
                        icon = { Icon(Icons.Filled.Note, contentDescription = null) },
                        title = note.title.ifBlank { "Untitled note" },
                        subtitle = note.content.lineSequence().firstOrNull().orEmpty(),
                        onClick = { onOpen(Workspace.NOTES) },
                    )
                }
            }
            if (recentDrawings.isNotEmpty()) {
                item { SectionTitle("Recent drawings", onOpen = { onOpen(Workspace.DRAW) }) }
                items(recentDrawings, key = { it.id }) { drawing ->
                    PreviewCard(
                        icon = { Icon(Icons.Filled.Brush, contentDescription = null) },
                        title = drawing.name,
                        subtitle = "Drawing",
                        onClick = { onOpen(Workspace.DRAW) },
                    )
                }
            }
            item { Spacer(Modifier.height(8.dp)) }
        }
    }
}

private enum class CaptureType { TASK, NOTE }

@Composable
private fun SectionTitle(title: String, onOpen: () -> Unit) {
    Row(Modifier.fillMaxWidth(), horizontalArrangement = Arrangement.SpaceBetween) {
        Text(title, style = MaterialTheme.typography.titleMedium)
        TextButton(onClick = onOpen) { Text("View all") }
    }
}

@Composable
private fun PreviewCard(
    icon: @Composable () -> Unit,
    title: String,
    subtitle: String,
    onClick: () -> Unit,
) {
    Card(onClick = onClick, modifier = Modifier.fillMaxWidth()) {
        Row(Modifier.padding(14.dp), horizontalArrangement = Arrangement.spacedBy(12.dp)) {
            icon()
            Column(Modifier.weight(1f)) {
                Text(title, maxLines = 2)
                if (subtitle.isNotBlank()) {
                    Text(subtitle, style = MaterialTheme.typography.bodySmall, maxLines = 2)
                }
            }
        }
    }
}
