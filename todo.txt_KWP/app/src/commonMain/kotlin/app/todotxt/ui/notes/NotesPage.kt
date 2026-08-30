package app.todotxt.ui.notes

import androidx.compose.foundation.background
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.PaddingValues
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.lazy.grid.GridCells
import androidx.compose.foundation.lazy.grid.LazyVerticalGrid
import androidx.compose.foundation.lazy.grid.items
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Archive
import androidx.compose.material.icons.filled.Delete
import androidx.compose.material.icons.filled.Edit
import androidx.compose.material.icons.filled.MoreVert
import androidx.compose.material.icons.filled.Share
import androidx.compose.material.icons.filled.Star
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
import androidx.compose.material3.Text
import androidx.compose.material3.TextButton
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.AnnotatedString
import androidx.compose.ui.text.SpanStyle
import androidx.compose.ui.text.buildAnnotatedString
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextOverflow
import androidx.compose.ui.text.withStyle
import androidx.compose.ui.unit.dp
import app.todotxt.core.DynamicContrast
import app.todotxt.domain.IdUtils
import app.todotxt.domain.Note
import app.todotxt.domain.NoteColor
import app.todotxt.persistence.Storage
import app.todotxt.persistence.exportTodoDocument
import app.todotxt.ui.ConfirmDialog
import app.todotxt.ui.PageHeader
import app.todotxt.ui.SearchField

/** Notes workspace — colored cards with search, pin / archive / edit,
 * like the web board (NotesPage.tsx + NoteCard.tsx parity). */
@Composable
fun NotesPage(notes: List<Note>) {
    var showCreate by remember { mutableStateOf(false) }
    var draftTitle by remember { mutableStateOf("") }
    var draftColor by remember { mutableStateOf(NoteColor.entries.random()) }
    var draftContent by remember { mutableStateOf("") }
    var searchQuery by remember { mutableStateOf("") }
    var showArchived by remember { mutableStateOf(false) }
    var editTarget by remember { mutableStateOf<Note?>(null) }
    var exportMenuOpen by remember { mutableStateOf(false) }

    Column(Modifier.fillMaxSize().padding(16.dp)) {
        PageHeader("Notes", modifier = Modifier.padding(bottom = 8.dp))

        // Search + export, mirroring the web NotesPage search surface.
        Row(
            modifier = Modifier
                .fillMaxWidth()
                .padding(bottom = 8.dp),
            verticalAlignment = androidx.compose.ui.Alignment.CenterVertically,
        ) {
            SearchField(
                value = searchQuery,
                onValueChange = { searchQuery = it },
                placeholder = "Search notes…",
                modifier = Modifier.weight(1f),
            )
            IconButton(onClick = { exportMenuOpen = true }) {
                Icon(Icons.Filled.Share, contentDescription = "Export notes")
            }
            DropdownMenu(expanded = exportMenuOpen, onDismissRequest = { exportMenuOpen = false }) {
                DropdownMenuItem(
                    text = { Text("Export notes (JSON)") },
                    onClick = {
                        exportMenuOpen = false
                        exportNotes()
                    },
                )
            }
        }

        Button(
            onClick = { showCreate = !showCreate },
            shape = RoundedCornerShape(20.dp),
            modifier = Modifier.padding(bottom = 12.dp),
        ) {
            Text(if (showCreate) "Cancel" else "+ New note")
        }

        if (showCreate) {
            Column(modifier = Modifier.padding(bottom = 12.dp)) {
                OutlinedTextField(
                    value = draftTitle,
                    onValueChange = { draftTitle = it },
                    placeholder = { Text("Title") },
                    modifier = Modifier.fillMaxWidth(),
                    singleLine = true,
                )
                OutlinedTextField(
                    value = draftContent,
                    onValueChange = { draftContent = it },
                    placeholder = { Text("Write a note…") },
                    modifier = Modifier.fillMaxWidth().height(180.dp),
                )
                MarkdownToolbar(
                    content = draftContent,
                    onContentChange = { draftContent = it },
                )
                ColorDotsRow(selected = draftColor) { draftColor = it }
                Row {
                    Button(
                        onClick = {
                            val richMarkdown = draftContent
                            if (draftTitle.isNotBlank() || richMarkdown.isNotBlank()) {
                                val now = app.todotxt.platform.nowMillis()
                                val note = Note(
                                    id = IdUtils.newId(),
                                    title = draftTitle,
                                    content = richMarkdown,
                                    color = draftColor,
                                    createdAt = now,
                                    updatedAt = now,
                                )
                                Storage.updateNotes { list -> list + note }
                                draftTitle = ""
                                draftContent = ""
                                draftColor = NoteColor.entries.random()
                                showCreate = false
                            }
                        },
                        shape = RoundedCornerShape(20.dp),
                    ) {
                        Text("Save")
                    }
                }
            }
        }

        // Web parity: pinned notes surface first, then unpinned, and archived
        // notes hide behind a collapsible toggle.
        val active = notes
            .filter { !it.archived }
            .filter { note ->
                searchQuery.isBlank() ||
                    note.title.contains(searchQuery, ignoreCase = true) ||
                    note.content.contains(searchQuery, ignoreCase = true)
            }
        val pinned = active.filter { it.pinned }
        val unpinned = active.filter { !it.pinned }
        val archived = notes.filter { it.archived }

        if (active.isEmpty() && archived.isEmpty()) {
            Box(Modifier.weight(1f).fillMaxWidth(), contentAlignment = androidx.compose.ui.Alignment.Center) {
                app.todotxt.ui.todo.EmptyStateArt()
            }
        } else {
            LazyVerticalGrid(
                columns = GridCells.Adaptive(minSize = 260.dp),
                modifier = Modifier.weight(1f),
                contentPadding = PaddingValues(4.dp),
                verticalArrangement = Arrangement.spacedBy(8.dp),
                horizontalArrangement = Arrangement.spacedBy(8.dp),
            ) {
                if (pinned.isNotEmpty()) {
                    item {
                        Text(
                            "Pinned",
                            style = MaterialTheme.typography.labelMedium,
                            fontWeight = FontWeight.Bold,
                            modifier = Modifier.padding(vertical = 6.dp),
                        )
                    }
                    items(pinned) { note -> NoteCard(note, onEdit = { editTarget = note }) }
                }
                if (unpinned.isNotEmpty()) {
                    item {
                        Text(
                            if (pinned.isEmpty()) "Active" else "Others",
                            style = MaterialTheme.typography.labelMedium,
                            fontWeight = FontWeight.Bold,
                            modifier = Modifier.padding(vertical = 6.dp),
                        )
                    }
                    items(unpinned) { note -> NoteCard(note, onEdit = { editTarget = note }) }
                }
                if (archived.isNotEmpty()) {
                    item {
                        Button(
                            onClick = { showArchived = !showArchived },
                            shape = RoundedCornerShape(20.dp),
                        ) {
                            Text("${if (showArchived) "Hide" else "Show"} archived (${archived.size})")
                        }
                    }
                    if (showArchived) {
                        items(archived) { note -> NoteCard(note, onEdit = { editTarget = note }) }
                    }
                }
            }
        }
    }

    editTarget?.let { note ->
        EditNoteDialog(
            note = note,
            onDismiss = { editTarget = null },
        )
    }
}

@Composable
private fun NoteCard(
    note: Note,
    onEdit: () -> Unit = {},
) {
    val color = remember(note.color) {
        val hex = note.color.hex.removePrefix("#")
        Color(hex.toLong(16) or 0xFF000000)
    }
    val foreground = remember(note.color) {
        val hex = DynamicContrast.chooseForeground(note.color.hex)
        val rgb = hex.removePrefix("#").toLong(16)
        Color(0xFF000000L or rgb)
    }
    var menuOpen by remember { mutableStateOf(false) }
    var confirmDelete by remember { mutableStateOf(false) }

    Card(
        modifier = Modifier
            .fillMaxWidth()
            .clickable(onClick = onEdit),
        shape = RoundedCornerShape(12.dp),
        colors = CardDefaults.cardColors(
            containerColor = color,
            contentColor = foreground,
        ),
        elevation = CardDefaults.cardElevation(defaultElevation = 1.dp),
    ) {
        Column(Modifier.padding(12.dp)) {
            Row(
                modifier = Modifier.fillMaxWidth(),
                verticalAlignment = androidx.compose.ui.Alignment.Top,
            ) {
                Text(
                    text = note.title.ifBlank { "Untitled note" },
                    style = MaterialTheme.typography.titleSmall,
                    fontWeight = FontWeight.Bold,
                    modifier = Modifier.weight(1f),
                    color = foreground,
                    overflow = TextOverflow.Clip,
                )
                Box {
                    IconButton(onClick = { menuOpen = true }) {
                        Icon(
                            Icons.Filled.MoreVert,
                            contentDescription = "Note actions",
                            tint = foreground,
                        )
                    }
                    DropdownMenu(
                        expanded = menuOpen,
                        onDismissRequest = { menuOpen = false },
                    ) {
                        DropdownMenuItem(
                            text = { Text("Edit note") },
                            leadingIcon = { Icon(Icons.Filled.Edit, contentDescription = null) },
                            onClick = {
                                menuOpen = false
                                onEdit()
                            },
                        )
                        DropdownMenuItem(
                            text = { Text(if (note.pinned) "Unpin note" else "Pin note") },
                            leadingIcon = { Icon(Icons.Filled.Star, contentDescription = null) },
                            onClick = {
                                menuOpen = false
                                Storage.updateNotes { list ->
                                    list.map { if (it.id == note.id) it.copy(pinned = !it.pinned) else it }
                                }
                            },
                        )
                        DropdownMenuItem(
                            text = { Text(if (note.archived) "Restore note" else "Archive note") },
                            leadingIcon = {
                                Icon(
                                    if (note.archived) Icons.Filled.Unarchive else Icons.Filled.Archive,
                                    contentDescription = null,
                                )
                            },
                            onClick = {
                                menuOpen = false
                                Storage.updateNotes { list ->
                                    list.map { if (it.id == note.id) it.copy(archived = !it.archived, pinned = if (it.archived) it.pinned else false) else it }
                                }
                            },
                        )
                        DropdownMenuItem(
                            text = { Text("Delete note", color = MaterialTheme.colorScheme.error) },
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
            Text(
                text = renderMarkdown(note.content, foreground),
                style = MaterialTheme.typography.bodySmall,
                modifier = Modifier.padding(top = 6.dp),
                maxLines = 6,
                overflow = TextOverflow.Ellipsis,
            )
        }
    }

    if (confirmDelete) {
        ConfirmDialog(
            title = "Delete note?",
            text = "This removes the note permanently.",
            confirmLabel = "Delete",
            destructive = true,
            onConfirm = {
                Storage.updateNotes { list -> list.filter { it.id != note.id } }
                confirmDelete = false
            },
            onDismiss = { confirmDelete = false },
        )
    }
}

/* ---------- Edit dialog with color picker (web parity: NoteCardEditor) ---------- */

@Composable
private fun EditNoteDialog(
    note: Note,
    onDismiss: () -> Unit,
) {
    var title by remember { mutableStateOf(note.title) }
    var color by remember { mutableStateOf(note.color) }
    var content by remember(note.id) { mutableStateOf(note.content) }
    AlertDialog(
        onDismissRequest = onDismiss,
        title = { Text("Edit note") },
        text = {
            Column {
                OutlinedTextField(
                    value = title,
                    onValueChange = { title = it },
                    singleLine = true,
                    modifier = Modifier.fillMaxWidth(),
                )
                OutlinedTextField(
                    value = content,
                    onValueChange = { content = it },
                    placeholder = { Text("Write a note…") },
                    modifier = Modifier.fillMaxWidth().height(180.dp),
                )
                MarkdownToolbar(
                    content = content,
                    onContentChange = { content = it },
                )
                ColorDotsRow(selected = color) { color = it }
            }
        },
        confirmButton = {
            TextButton(
                onClick = {
                    val now = app.todotxt.platform.nowMillis()
                    Storage.updateNotes { list ->
                        list.map {
                            if (it.id == note.id) it.copy(
                                title = title, content = content,
                                color = color, updatedAt = now,
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

/** Compact formatting actions shared by KMP note editors. */
@Composable
private fun MarkdownToolbar(
    content: String,
    onContentChange: (String) -> Unit,
) = app.todotxt.ui.components.MarkdownToolbar(content, onContentChange)

private fun insertMarkdown(content: String, prefix: String): String =
    app.todotxt.ui.components.insertMarkdown(content, prefix)

/** Color picker: the six web note colors, matching ColorDots.tsx. */
@Composable
private fun ColorDotsRow(
    selected: NoteColor,
    onSelect: (NoteColor) -> Unit,
) {
    Row(horizontalArrangement = Arrangement.spacedBy(6.dp)) {
        NoteColor.entries.forEach { color ->
            val hex = color.hex.removePrefix("#")
            IconButton(
                onClick = { onSelect(color) },
                modifier = Modifier.size(30.dp),
            ) {
                Box(
                    Modifier
                        .size(22.dp)
                        .background(Color(hex.toLong(16) or 0xFF000000), CircleShape),
                )
                if (color == selected) {
                    Box(
                        Modifier
                            .size(26.dp)
                            .background(
                                MaterialTheme.colorScheme.onSurface,
                                CircleShape,
                            ),
                    )
                }
            }
        }
    }
}

/** Notes export (web parity: `notesBackup.ts` JSON mirror shape). */
private fun exportNotes() {
    val notesJson = Storage.notes.value.renderNotesJson()
    exportTodoDocument(notesJson)
}

private fun List<Note>.renderNotesJson(): String {
    val items = joinToString(",") { note ->
        buildString {
            append("""{"id":""" + note.id.escapeJson() + """","title":""" + note.title.escapeJson() + """","content":""" + note.content.escapeJson() + """","color":""" + note.color.hex + """","pinned":""" + note.pinned + """","archived":""" + note.archived + """","createdAt":""" + note.createdAt + ""","updatedAt":""" + note.updatedAt + """}""")
        }
    }
    return """{"notes":[${items}],"updatedAt":""" + app.todotxt.platform.nowMillis() + """}"""
}

private fun String.escapeJson(): String =
    replace("\\", "\\\\").replace("\"", "\\\"").replace("\n", "\\n").replace("\r", "\\r")

private fun renderMarkdown(text: String, foreground: Color): AnnotatedString =
    app.todotxt.ui.components.renderMarkdown(text, foreground)
