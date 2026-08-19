package app.todotxt.ui.editor

import androidx.compose.material.icons.Icons
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.verticalScroll
import androidx.compose.material.icons.filled.ArrowBack
import androidx.compose.material3.FilledTonalButton
import androidx.compose.material3.Icon
import androidx.compose.material3.IconButton
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.OutlinedTextField
import androidx.compose.material3.Text

import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.text.font.FontFamily
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import app.todotxt.persistence.Storage

/**
 * Raw content editor — Compose parity of the web app's `Editor` writing
 * surface. The structured task list covers most workflows, but the web app
 * also exposes todo.txt as a plain free-form document (TipTap-backed
 * markdown editor); this page provides the same affordance natively: every
 * line is editable text, changes are batched into a single save.
 *
 * The document stays authoritative — `Storage.setContent` writes the raw
 * todo.txt and re-arms due-date reminders as usual.
 */
@Composable
fun EditorPage(
    initialContent: String,
    onBack: () -> Unit,
    modifier: Modifier = Modifier,
) {
    var draft by remember { mutableStateOf(initialContent) }
    var dirty by remember(initialContent) { mutableStateOf(false) }

    Column(modifier = modifier.fillMaxSize().padding(16.dp)) {
        Row(
            modifier = Modifier.fillMaxWidth(),
            verticalAlignment = Alignment.CenterVertically,
        ) {
            IconButton(onClick = onBack) {
                Icon(Icons.Filled.ArrowBack, contentDescription = "Back")
            }
            Text(
                "Editor",
                style = MaterialTheme.typography.headlineMedium,
                fontWeight = FontWeight.Bold,
                modifier = Modifier.weight(1f),
            )
            FilledTonalButton(
                onClick = {
                    Storage.setContent(draft)
                    dirty = false
                },
                enabled = dirty,
            ) {
                Text("Save")
            }
        }
        Text(
            "Edit todo.txt line by line — one task per line.",
            style = MaterialTheme.typography.bodySmall,
            color = MaterialTheme.colorScheme.onSurfaceVariant,
            modifier = Modifier.padding(vertical = 8.dp),
        )
        OutlinedTextField(
            value = draft,
            onValueChange = {
                draft = it
                dirty = it != initialContent
            },
            modifier = Modifier
                .fillMaxWidth()
                .weight(1f)
                .verticalScroll(rememberScrollState()),
            placeholder = {
                Text("Buy groceries due:tomorrow\n- [ ] Reply to emails @work")
            },
            textStyle = MaterialTheme.typography.bodyMedium.copy(
                fontFamily = FontFamily.Monospace,
            ),
            minLines = 12,
            maxLines = Int.MAX_VALUE,
        )
        if (dirty) {
            Text(
                "Unsaved changes",
                style = MaterialTheme.typography.labelSmall,
                color = MaterialTheme.colorScheme.primary,
                modifier = Modifier.padding(vertical = 4.dp),
            )
        }
    }
}
