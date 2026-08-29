package app.todotxt.ui.todo

import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.padding
import androidx.compose.material3.AlertDialog
import androidx.compose.material3.Button
import androidx.compose.material3.Card
import androidx.compose.material3.CardDefaults
import androidx.compose.material3.ExperimentalMaterial3Api
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.OutlinedButton
import androidx.compose.material3.OutlinedTextField
import androidx.compose.material3.RadioButton
import androidx.compose.material3.Text
import androidx.compose.material3.TextButton
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.unit.dp
import app.todotxt.core.SchedulingParser
import app.todotxt.domain.Task
import app.todotxt.domain.TodoParser
import app.todotxt.persistence.ImportExportResult
import app.todotxt.persistence.Storage
import app.todotxt.persistence.exportTodoDocument
import app.todotxt.persistence.importTodoDocument

/**
 * Export-format dialog (web parity: `documentExport.ts` SaveFormat — text,
 * markdown, html). After picking a format the document is exported through
 * the platform picker / share sheet.
 */
@Composable
fun ExportFormatDialog(
    content: String,
    onDismiss: () -> Unit,
) {
    var format by remember { mutableStateOf("text") }
    AlertDialog(
        onDismissRequest = onDismiss,
        title = { Text("Export as") },
        text = {
            Column {
                Row(verticalAlignment = Alignment.CenterVertically) {
                    RadioButton(selected = format == "text", onClick = { format = "text" })
                    Text("Plain text (todo.txt)", modifier = Modifier.padding(start = 4.dp))
                }
                Row(verticalAlignment = Alignment.CenterVertically) {
                    RadioButton(selected = format == "markdown", onClick = { format = "markdown" })
                    Text("Markdown", modifier = Modifier.padding(start = 4.dp))
                }
                Row(verticalAlignment = Alignment.CenterVertically) {
                    RadioButton(selected = format == "html", onClick = { format = "html" })
                    Text("HTML", modifier = Modifier.padding(start = 4.dp))
                }
            }
        },
        confirmButton = {
            TextButton(
                onClick = {
                    val rendered = when (format) {
                        "markdown" -> content.renderTodoAsMarkdown()
                        "html" -> content.renderTodoAsHtml()
                        else -> content
                    }
                    exportTodoDocument(rendered)
                    onDismiss()
                },
            ) { Text("Export") }
        },
        dismissButton = {
            TextButton(onClick = onDismiss) { Text("Cancel") }
        },
    )
}

/**
 * Natural-language scheduling dialog (web parity: `AdvancedToolsDialog.tsx`).
 * Parses phrases like "in 3 days" or "every 2nd Tuesday at 3pm" and previews
 * the resulting todo.txt line with a `due:` tag.
 */
@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun SchedulingDialog(onDismiss: () -> Unit) {
    var phrase by remember { mutableStateOf("") }
    var preview by remember { mutableStateOf<String?>(null) }
    AlertDialog(
        onDismissRequest = onDismiss,
        title = { Text("Schedule a task") },
        text = {
            Column {
                OutlinedTextField(
                    value = phrase,
                    onValueChange = {
                        phrase = it
                        preview = runCatching {
                            when (val result = SchedulingParser.parseSchedulingPhrase(it)) {
                                is SchedulingParser.ScheduleResult.Relative ->
                                    "due:${result.relative.date} (in ${result.relative.amount} ${result.relative.unit})"
                                is SchedulingParser.ScheduleResult.Recurrence ->
                                    buildString {
                                        append("every ${result.rule.interval} ")
                                        append(result.rule.freq)
                                        result.rule.byDay?.let { days ->
                                            append(" on ${days.joinToString { dayName(it) }}")
                                        }
                                        result.rule.nthWeekday?.let { nwd ->
                                            append(" on the ${ordinal(nwd.n)} ${dayName(nwd.day)}")
                                        }
                                        result.rule.time?.let { append(" at ${it}") }
                                        append(" rec:${result.rule.mode}")
                                    }
                                is SchedulingParser.ScheduleResult.Error -> "— ${result.message}"
                            }
                        }.getOrDefault("— Unrecognised phrase.")
                    },
                    placeholder = { Text("e.g. in 3 days · every Monday at 9:00") },
                    singleLine = true,
                    modifier = Modifier.fillMaxWidth(),
                )
                preview?.let { text ->
                    Text(
                        text,
                        style = MaterialTheme.typography.bodyMedium,
                        color = if (text.startsWith("— ")) {
                            MaterialTheme.colorScheme.error
                        } else {
                            MaterialTheme.colorScheme.onSurfaceVariant
                        },
                        modifier = Modifier.padding(top = 8.dp),
                    )
                }
            }
        },
        confirmButton = {
            TextButton(onClick = onDismiss) { Text("Done") }
        },
        dismissButton = {
            TextButton(onClick = onDismiss) { Text("Close") }
        },
    )
}

/**
 * Inline task editor (web parity: TipTap line editing). Rewrites the task's
 * raw line in the todo.txt document, preserving the todo.txt grammar by
 * re-parsing the edited text into a fresh line through the parser.
 */
@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun EditTaskDialog(
    task: Task,
    onDismiss: () -> Unit,
) {
    var draft by remember { mutableStateOf(task.raw) }
    AlertDialog(
        onDismissRequest = onDismiss,
        title = { Text("Edit task") },
        text = {
            OutlinedTextField(
                value = draft,
                onValueChange = { draft = it },
                singleLine = true,
                modifier = Modifier.fillMaxWidth(),
            )
        },
        confirmButton = {
            TextButton(
                onClick = {
                    val trimmed = draft.trim()
                    if (trimmed.isEmpty() || trimmed == task.raw.trim()) {
                        onDismiss()
                        return@TextButton
                    }
                    var content = Storage.content.value
                    val lines = content.split("\n").toMutableList()
                    val index = lines.indexOfFirst { it.trim() == task.raw.trim() }
                    if (index >= 0) {
                        // Preserve completion state: rebuild the new line with
                        // the original checkbox/x marker if the task was done.
                        val rebuilt = if (task.completed) "-[x] $trimmed" else trimmed
                        lines[index] = rebuilt
                        Storage.setContent(lines.joinToString("\n"))
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

/* ---------- Renderers for the export formats ---------- */

internal fun String.renderTodoAsMarkdown(): String {
    val parsed = TodoParser.parseTodoContent(this)
    return buildString {
        appendLine("# todo.txt")
        appendLine()
        appendLine("## Active")
        appendLine()
        parsed.tasks.filter { !it.completed }.forEach { appendLine("- ${it.text}") }
        appendLine()
        appendLine("## Completed")
        appendLine()
        parsed.tasks.filter { it.completed }.forEach { appendLine("- ~~${it.text}~~") }
        if (parsed.projects.isNotEmpty()) {
            appendLine()
            appendLine("## Projects")
            appendLine()
            parsed.projects.keys.sorted().forEach { appendLine("- +$it") }
        }
        if (parsed.contexts.isNotEmpty()) {
            appendLine()
            appendLine("## Contexts")
            appendLine()
            parsed.contexts.keys.sorted().forEach { appendLine("- @$it") }
        }
    }
}

internal fun String.renderTodoAsHtml(): String {
    val parsed = TodoParser.parseTodoContent(this)
    return buildString {
        appendLine("<!doctype html>")
        appendLine("<html lang=\"en\"><head><meta charset=\"utf-8\">")
        appendLine("<title>todo.txt</title>")
        appendLine("<style>body{font-family:system-ui,sans-serif;max-width:48em;margin:2em auto;}")
        appendLine(".done{text-decoration:line-through;opacity:.6;}</style></head><body>")
        appendLine("<h1>todo.txt</h1><ul>")
        parsed.tasks.forEach {
            val cls = if (it.completed) " done" else ""
            appendLine("<li class=\"$cls\">${it.text.escapeHtml()}</li>")
        }
        appendLine("</ul></body></html>")
    }
}

private fun String.escapeHtml(): String =
    replace("&", "&amp;").replace("<", "&lt;").replace(">", "&gt;")

private fun ordinal(n: Int): String = when {
    n % 100 in 11..13 -> "${n}th"
    n % 10 == 1 -> "${n}st"
    n % 10 == 2 -> "${n}nd"
    n % 10 == 3 -> "${n}rd"
    else -> "${n}th"
}

private fun dayName(index: Int): String = when (index) {
    0 -> "Sunday"; 1 -> "Monday"; 2 -> "Tuesday"; 3 -> "Wednesday"
    4 -> "Thursday"; 5 -> "Friday"; 6 -> "Saturday"
    else -> "Day"
}
