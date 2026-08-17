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
import androidx.compose.material.icons.filled.Delete
import androidx.compose.material.icons.filled.Star
import androidx.compose.material3.Button
import androidx.compose.material3.Card
import androidx.compose.material3.CardDefaults
import androidx.compose.material3.Icon
import androidx.compose.material3.IconButton
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.OutlinedTextField
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
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
import androidx.compose.ui.text.input.OffsetMapping
import androidx.compose.ui.text.input.TransformedText
import androidx.compose.ui.text.input.VisualTransformation
import androidx.compose.ui.text.font.FontStyle

/** Notes workspace — colored cards with pin / archive, like the web board. */
@Composable
fun NotesPage(notes: List<Note>) {
    var showCreate by remember { mutableStateOf(false) }
    var draftTitle by remember { mutableStateOf("") }
    var draftContent by remember { mutableStateOf("") }

    Column(Modifier.fillMaxSize().padding(16.dp)) {
        Text(
            "Notes",
            style = MaterialTheme.typography.headlineMedium,
            fontWeight = FontWeight.Bold,
            modifier = Modifier.padding(bottom = 8.dp),
        )

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
                    placeholder = { Text("Content (markdown)") },
                    modifier = Modifier.fillMaxWidth(),
                    visualTransformation = MarkdownVisualTransformation(),
                )
                Row {
                    Button(
                        onClick = {
                            if (draftTitle.isNotBlank() || draftContent.isNotBlank()) {
                                val now = System.currentTimeMillis()
                                val note = Note(
                                    id = IdUtils.newId(),
                                    title = draftTitle,
                                    content = draftContent,
                                    color = NoteColor.entries.random(),
                                    createdAt = now,
                                    updatedAt = now,
                                )
                                Storage.updateNotes { list -> list + note }
                                draftTitle = ""
                                draftContent = ""
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

        LazyVerticalGrid(
            columns = GridCells.Fixed(2),
            contentPadding = PaddingValues(4.dp),
            verticalArrangement = Arrangement.spacedBy(8.dp),
            horizontalArrangement = Arrangement.spacedBy(8.dp),
        ) {
            items(notes.filter { !it.archived }) { note ->
                NoteCard(note)
            }
        }
    }
}

@Composable
private fun NoteCard(note: Note) {
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
                    onClick = { Storage.updateNotes { list ->
                        list.map { if (it.id == note.id) it.copy(archived = true) else it }
                    } },
                    modifier = Modifier.size(28.dp),
                ) {
                    Icon(Icons.Filled.Delete, contentDescription = "Archive", tint = MaterialTheme.colorScheme.onSurface)
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

private class MarkdownVisualTransformation : VisualTransformation {
    override fun filter(text: AnnotatedString): TransformedText {
        return TransformedText(renderMarkdown(text.text), OffsetMapping.Identity)
    }
}

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
