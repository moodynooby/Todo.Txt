package app.todotxt.ui

import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.verticalScroll
import androidx.compose.material3.AlertDialog
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
import androidx.compose.ui.unit.dp
import app.todotxt.persistence.ThemeMode

@Composable
fun CommandPaletteDialog(
    onDismiss: () -> Unit,
    onWorkspaceSelected: (Workspace) -> Unit,
    onThemeSelected: (ThemeMode) -> Unit,
) {
    var query by remember { mutableStateOf("") }
    val matches = remember(query) {
        val normalized = query.trim().lowercase()
        Workspace.entries.filter { normalized.isBlank() || it.title.lowercase().contains(normalized) }
    }
    AlertDialog(
        onDismissRequest = onDismiss,
        title = { Text("Command palette") },
        text = {
            Column(
                modifier = Modifier
                    .fillMaxWidth()
                    .verticalScroll(rememberScrollState()),
                verticalArrangement = Arrangement.spacedBy(4.dp),
            ) {
                OutlinedTextField(
                    value = query,
                    onValueChange = { query = it },
                    placeholder = { Text("Search workspaces and actions…") },
                    singleLine = true,
                    modifier = Modifier.fillMaxWidth(),
                )
                matches.forEach { workspace ->
                    TextButton(
                        onClick = {
                            onWorkspaceSelected(workspace)
                            onDismiss()
                        },
                        modifier = Modifier.fillMaxWidth(),
                    ) { Text("Open ${workspace.title}") }
                }
                if (matches.isEmpty()) {
                    Text(
                        "No matching workspace.",
                        color = MaterialTheme.colorScheme.onSurfaceVariant,
                        modifier = Modifier.padding(vertical = 8.dp),
                    )
                }
                Text(
                    "Appearance",
                    style = MaterialTheme.typography.labelLarge,
                    modifier = Modifier.padding(top = 8.dp),
                )
                ThemeMode.entries.forEach { mode ->
                    TextButton(
                        onClick = {
                            onThemeSelected(mode)
                            onDismiss()
                        },
                        modifier = Modifier.fillMaxWidth(),
                    ) { Text("Use ${mode.name.lowercase().replaceFirstChar { it.uppercase() }} theme") }
                }
            }
        },
        confirmButton = { TextButton(onClick = onDismiss) { Text("Close") } },
    )
}
