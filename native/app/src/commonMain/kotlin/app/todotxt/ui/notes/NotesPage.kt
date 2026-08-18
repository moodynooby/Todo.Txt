package app.todotxt.ui.notes

import androidx.compose.foundation.background
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.PaddingValues
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.lazy.grid.GridCells
import androidx.compose.foundation.lazy.grid.LazyVerticalGrid
import androidx.compose.foundation.lazy.grid.items
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Add
import androidx.compose.material.icons.filled.CheckCircle
import androidx.compose.material.icons.filled.Clear
import androidx.compose.material.icons.filled.Delete
import androidx.compose.material.icons.filled.Edit
import androidx.compose.material.icons.filled.Refresh
import androidx.compose.material.icons.filled.Search
import androidx.compose.material.icons.filled.Share
import androidx.compose.material.icons.filled.Star
import androidx.compose.material3.AlertDialog
import androidx.compose.material3.Button
import androidx.compose.material3.DropdownMenu
import androidx.compose.material3.DropdownMenuItem
import androidx.compose.material3.TextButton
import androidx.compose.material3.Card
import androidx.compose.material3.CardDefaults
import androidx.compose.material3.Icon
import androidx.compose.material3.IconButton
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
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.AnnotatedString
import androidx.compose.ui.text.SpanStyle
import androidx.compose.ui.text.buildAnnotatedString
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.withStyle
import androidx.compose.ui.unit.dp
import app.todotxt.domain.IdUtils
import app.todotxt.domain.Note
import app.todotxt.domain.NoteColor
import app.todotxt.persistence.Storage
import app.todotxt.persistence.exportTodoDocument
import androidx.compose.ui.text.font.FontStyle
import com.mohamedrejeb.richeditor.ui.material3.RichTextEditor
import com.mohamedrejeb.richeditor.model.rememberRichTextState
import com.mohamedrejeb.richeditor.annotation.ExperimentalRichTextApi
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.height

/** Notes workspace — colored cards with search, pin / archive / edit,
 * like the web board (NotesPage.tsx + NoteCard.tsx parity). */
@OptIn(ExperimentalRichTextApi::class)
@Composable
fun NotesPage(notes: List<Note>) {
    var showCreate by remember { mutableStateOf(false) }
    var draftTitle by remember { mutableStateOf("") }
    var draftColor by remember { mutableStateOf(NoteColor.entries.random()) }
    val draftState = rememberRichTextState()
    var searchQuery by remember { mutableStateOf("") }
    var showArchived by remember { mutableStateOf(false) }
    var editTarget by remember { mutableStateOf<Note?>(null) }
    var exportMenuOpen by remember { mutableStateOf(false) }

    Column(Modifier.fillMaxSize().padding(16.dp)) {
        Text(
            "Notes",
            style = MaterialTheme.typography.headlineMedium,
            fontWeight = FontWeight.Bold,
            modifier = Modifier.padding(bottom = 8.dp),
        )

        // Search + export, mirroring the web NotesPage search surface.
        Row(
            modifier = Modifier
                .fillMaxWidth()
                .padding(bottom = 8.dp),
            verticalAlignment = androidx.compose.ui.Alignment.CenterVertically,
        ) {
            OutlinedTextField(
                value = searchQuery,
                onValueChange = { searchQuery = it },
                placeholder = { Text("Search notes…") },
                leadingIcon = { Icon(Icons.Filled.Search, contentDescription = null) },
                trailingIcon = {
                    if (searchQuery.isNotEmpty()) {
                        IconButton(onClick = { searchQuery = "" }) {
                            Icon(Icons.Filled.Clear, contentDescription = "Clear search")
                        }
                    }
                },
                singleLine = true,
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
                // Tiptap-like rich editor: toolbar + WYSIWYG editing; persisted
                // as markdown so it round-trips through the plain `content` field.
                RichToolbar(draftState)
                RichTextEditor(
                    state = draftState,
                    placeholder = { Text("Rich content…") },
                    modifier = Modifier.fillMaxWidth().height(180.dp),
                )
                ColorDotsRow(selected = draftColor) { draftColor = it }
                Row {
                    Button(
                        onClick = {
                            val richMarkdown = draftState.toMarkdown()
                            if (draftTitle.isNotBlank() || richMarkdown.isNotBlank()) {
                                val now = System.currentTimeMillis()
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
                                draftState.setMarkdown("")
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

        LazyVerticalGrid(
            columns = GridCells.Fixed(2),
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
    Card(
        modifier = Modifier.fillMaxWidth(),
        shape = RoundedCornerShape(12.dp),
        colors = CardDefaults.cardColors(containerColor = color),
        elevation = CardDefaults.cardElevation(defaultElevation = 1.dp),
    ) {
        Column(Modifier.padding(10.dp)) {
            Row(modifier = Modifier.fillMaxWidth()) {
                Text(
                    note.title,
                    style = MaterialTheme.typography.titleSmall,
                    fontWeight = FontWeight.Bold,
                    modifier = Modifier.weight(1f),
                )
                IconButton(
                    onClick = onEdit,
                    modifier = Modifier.size(28.dp),
                ) {
                    Icon(Icons.Filled.Edit, contentDescription = "Edit", tint = MaterialTheme.colorScheme.onSurface)
                }
                IconButton(
                    onClick = { Storage.updateNotes { list ->
                        list.map { if (it.id == note.id) it.copy(pinned = !it.pinned) else it }
                    } },
                    modifier = Modifier.size(28.dp),
                ) {
                    Icon(
                        if (note.pinned) Icons.Filled.Star else Icons.Filled.Star,
                        contentDescription = "Pin",
                        tint = if (note.pinned) MaterialTheme.colorScheme.primary else MaterialTheme.colorScheme.onSurface
                    )
                }
                IconButton(
                    onClick = {
                        Storage.updateNotes { list ->
                            if (note.archived) {
                                list.map { if (it.id == note.id) it.copy(archived = false) else it }
                            } else {
                                list.map { if (it.id == note.id) it.copy(archived = true, pinned = false) else it }
                            }
                        }
                    },
                    modifier = Modifier.size(28.dp),
                ) {
                    Icon(
                        if (note.archived) Icons.Filled.Refresh else Icons.Filled.CheckCircle,
                        contentDescription = if (note.archived) "Restore" else "Archive",
                        tint = MaterialTheme.colorScheme.onSurface,
                    )
                }
                IconButton(
                    onClick = {
                        Storage.updateNotes { list -> list.filter { it.id != note.id } }
                    },
                    modifier = Modifier.size(28.dp),
                ) {
                    Icon(Icons.Filled.Delete, contentDescription = "Delete", tint = MaterialTheme.colorScheme.error)
                }
            }
            Text(
                text = renderMarkdown(note.content),
                style = MaterialTheme.typography.bodySmall,
                modifier = Modifier.padding(top = 4.dp)
            )
        }
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
    val richState = rememberRichTextState()
    LaunchedEffect(note.id) { richState.setMarkdown(note.content) }
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
                RichToolbar(richState)
                RichTextEditor(
                    state = richState,
                    placeholder = { Text("Rich content…") },
                    modifier = Modifier.fillMaxWidth().height(180.dp),
                )
                ColorDotsRow(selected = color) { color = it }
            }
        },
        confirmButton = {
            TextButton(
                onClick = {
                    val now = System.currentTimeMillis()
                    Storage.updateNotes { list ->
                        list.map {
                            if (it.id == note.id) it.copy(
                                title = title, content = richState.toMarkdown(),
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

/** Shared rich-text toolbar (Tiptap-style formatting actions). */
@OptIn(ExperimentalRichTextApi::class)
@Composable
private fun RichToolbar(state: com.mohamedrejeb.richeditor.model.RichTextState) {
    Row(horizontalArrangement = Arrangement.spacedBy(4.dp)) {
        val current = state.currentSpanStyle
        val isBold = current.fontWeight == FontWeight.Bold
        val isItalic = current.fontStyle == FontStyle.Italic
        androidx.compose.material3.IconButton(
            onClick = {
                state.toggleSpanStyle(
                    androidx.compose.ui.text.SpanStyle(
                        fontWeight = if (isBold) FontWeight.Normal else FontWeight.Bold,
                    ),
                )
            },
            modifier = Modifier.size(30.dp),
        ) {
            Text("B", style = MaterialTheme.typography.labelMedium)
        }
        androidx.compose.material3.IconButton(
            onClick = {
                state.toggleSpanStyle(
                    androidx.compose.ui.text.SpanStyle(
                        fontStyle = if (isItalic) FontStyle.Normal else FontStyle.Italic,
                    ),
                )
            },
            modifier = Modifier.size(30.dp),
        ) {
            Text("I", style = MaterialTheme.typography.labelMedium)
        }
        androidx.compose.material3.IconButton(
            onClick = { state.toggleUnorderedList() },
            modifier = Modifier.size(30.dp),
        ) {
            Text("•", style = MaterialTheme.typography.labelMedium)
        }
        androidx.compose.material3.IconButton(
            onClick = { state.toggleOrderedList() },
            modifier = Modifier.size(30.dp),
        ) {
            Text("1.", style = MaterialTheme.typography.labelMedium)
        }
    }
}

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
    return """{"notes":[${items}],"updatedAt":""" + System.currentTimeMillis() + """}"""
}

private fun String.escapeJson(): String =
    replace("\\", "\\\\").replace("\"", "\\\"").replace("\n", "\\n").replace("\r", "\\r")

private fun renderMarkdown(text: String): AnnotatedString {
    return buildAnnotatedString {
        val lines = text.split("\n")
        lines.forEachIndexed { index, line ->
            when {
                line.startsWith("# ") -> {
                    withStyle(SpanStyle(fontWeight = FontWeight.Bold, color = Color(0xFF2F6F61))) {
                        append(line)
                    }
                }
                line.startsWith("## ") -> {
                    withStyle(SpanStyle(fontWeight = FontWeight.Bold)) {
                        append(line)
                    }
                }
                line.startsWith("- ") || line.startsWith("* ") -> {
                    withStyle(SpanStyle(color = Color(0xFFD9784F))) {
                        append("• ")
                    }
                    append(line.substring(2))
                }
                else -> {
                    // Basic bold/italic search
                    var current = line
                    val boldRegex = Regex("""\*\*(.*?)\*\*""")
                    val italicRegex = Regex("""\*(.*?)\*""")
                    
                    // This is a simplified renderer for the experiment
                    append(line)
                }
            }
            if (index < lines.size - 1) append("\n")
        }
    }
}
