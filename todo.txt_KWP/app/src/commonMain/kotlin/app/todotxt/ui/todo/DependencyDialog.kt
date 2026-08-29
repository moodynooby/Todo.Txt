package app.todotxt.ui.todo

import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.verticalScroll
import androidx.compose.material3.AlertDialog
import androidx.compose.material3.Card
import androidx.compose.material3.CardDefaults
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Text
import androidx.compose.material3.TextButton
import androidx.compose.runtime.Composable
import androidx.compose.runtime.remember
import androidx.compose.ui.Modifier
import androidx.compose.ui.unit.dp
import app.todotxt.core.DependencyAnalyzer
import app.todotxt.core.DependencyStatus
import app.todotxt.domain.Task

@Composable
fun DependencyDialog(
    tasks: List<Task>,
    onDismiss: () -> Unit,
) {
    val report = remember(tasks) { DependencyAnalyzer.build(tasks) }
    AlertDialog(
        onDismissRequest = onDismiss,
        title = { Text("Task dependencies") },
        text = {
            Column(
                modifier = Modifier
                    .fillMaxWidth()
                    .verticalScroll(rememberScrollState()),
                verticalArrangement = Arrangement.spacedBy(8.dp),
            ) {
                Text(
                    when {
                        report.hasCycle -> "Cycle detected"
                        report.missingReferences.isNotEmpty() -> "Missing task references"
                        else -> "Graph valid"
                    },
                    color = if (report.hasCycle) {
                        MaterialTheme.colorScheme.error
                    } else {
                        MaterialTheme.colorScheme.primary
                    },
                    style = MaterialTheme.typography.titleSmall,
                )
                if (report.hasCycle) {
                    Text(
                        report.cyclePath.joinToString(" → "),
                        color = MaterialTheme.colorScheme.error,
                    )
                }
                if (report.missingReferences.isNotEmpty()) {
                    Text(
                        "Missing: ${report.missingReferences.joinToString(", ")}",
                        color = MaterialTheme.colorScheme.error,
                    )
                }
                if (report.nodes.isEmpty()) {
                    Text("No tasks in the current document.")
                }
                report.nodes.forEach { node ->
                    val status = report.statuses[node.id] ?: DependencyStatus.ACTIVE
                    Card(
                        modifier = Modifier.fillMaxWidth(),
                        colors = CardDefaults.cardColors(
                            containerColor = when (status) {
                                DependencyStatus.COMPLETED -> MaterialTheme.colorScheme.surfaceVariant
                                DependencyStatus.BLOCKED -> MaterialTheme.colorScheme.errorContainer
                                DependencyStatus.ACTIVE -> MaterialTheme.colorScheme.primaryContainer
                            },
                        ),
                    ) {
                        Column(Modifier.padding(10.dp)) {
                            Text(node.id, style = MaterialTheme.typography.labelLarge)
                            Text(node.taskText, style = MaterialTheme.typography.bodyMedium)
                            Text(
                                status.name.lowercase().replaceFirstChar { it.uppercase() },
                                style = MaterialTheme.typography.labelSmall,
                            )
                            if (node.after.isNotEmpty()) {
                                Text("After: ${node.after.joinToString(", ")}")
                            }
                            if (node.blocks.isNotEmpty()) {
                                Text("Blocks: ${node.blocks.joinToString(", ")}")
                            }
                        }
                    }
                }
            }
        },
        confirmButton = { TextButton(onClick = onDismiss) { Text("Close") } },
    )
}
