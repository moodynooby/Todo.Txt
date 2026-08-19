package app.todotxt.ui.todo

import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.widthIn
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Add
import androidx.compose.material3.Button
import androidx.compose.material3.FilterChip
import androidx.compose.material3.Icon
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.OutlinedTextField
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Modifier
import androidx.compose.ui.focus.focusRequester
import androidx.compose.ui.unit.dp
import androidx.compose.ui.focus.FocusRequester
import app.todotxt.domain.ParsedTodoContent
import app.todotxt.persistence.Storage
import app.todotxt.theme.Shapes

/**
 * Quick-add bar mirroring the web app's `QuickAddBar` + `SmartSuggestionChips`:
 * typing `+` surfaces existing projects, `@` surfaces contexts, and `due:`
 * surfaces quick relative dates (today / tomorrow / +7d / +30d). Tapping a
 * suggestion appends it to the draft text.
 */
@Composable
fun QuickAddBar(
    parsed: ParsedTodoContent,
    modifier: Modifier = Modifier,
    focusRequester: FocusRequester? = null,
    onAdd: (String) -> Unit = { draft ->
        if (draft.isNotBlank()) {
            val existing = Storage.content.value
            val append = if (existing.isBlank()) draft else "$existing\n$draft"
            Storage.setContent(append)
        }
    },
) {
    var draft by remember { mutableStateOf("") }
    var showSuggestions by remember { mutableStateOf(false) }

    val suggestions = remember(draft) { buildSuggestions(draft, parsed) }

    Column(modifier = modifier.fillMaxWidth()) {
        Row(verticalAlignment = androidx.compose.ui.Alignment.CenterVertically) {
            OutlinedTextField(
                value = draft,
                onValueChange = {
                    draft = it
                    showSuggestions = it.endsWith("+") || it.endsWith("@") ||
                        it.endsWith("due:") || it.contains(" due:")
                },
                placeholder = { Text("Add a todo… (+project @context due:today)") },
                modifier = Modifier
                    .weight(1f)
                    .then(if (focusRequester != null) Modifier.focusRequester(focusRequester) else Modifier),
                shape = RoundedCornerShape(Shapes.Xl),
                singleLine = true,
            )
            Button(
                onClick = {
                    onAdd(draft)
                    draft = ""
                    showSuggestions = false
                },
                shape = RoundedCornerShape(Shapes.Xl),
                modifier = Modifier.padding(start = 8.dp),
                contentPadding = androidx.compose.foundation.layout.PaddingValues(
                    horizontal = 14.dp,
                    vertical = 10.dp,
                ),
            ) {
                Icon(Icons.Filled.Add, contentDescription = "Add")
            }
        }

        if (showSuggestions && suggestions.isNotEmpty()) {
            Box(
                modifier = Modifier
                    .fillMaxWidth()
                    .padding(top = 4.dp)
                    .background(
                        MaterialTheme.colorScheme.surfaceVariant,
                        RoundedCornerShape(Shapes.Lg),
                    )
                    .border(
                        1.dp,
                        MaterialTheme.colorScheme.outlineVariant,
                        RoundedCornerShape(Shapes.Lg),
                    )
                    .padding(6.dp),
            ) {
                Column(verticalArrangement = Arrangement.spacedBy(4.dp)) {
                    suggestions.forEach { suggestion ->
                        FilterChip(
                            selected = false,
                            onClick = {
                                draft = suggestion
                                showSuggestions = false
                            },
                            label = { Text(suggestion) },
                            modifier = Modifier.fillMaxWidth(),
                        )
                    }
                }
            }
        }
    }
}

/** Build the suggestion list for the current draft tail. */
private fun buildSuggestions(
    draft: String,
    parsed: ParsedTodoContent,
): List<String> {
    val lastToken = draft.substringAfterLast(' ')
    return when {
        lastToken.endsWith("+") && lastToken.length > 1 ->
            parsed.projects.keys.map { "+$it" }
        lastToken.endsWith("@") && lastToken.length > 1 ->
            parsed.contexts.keys.map { "@$it" }
        lastToken == "due:" || lastToken.endsWith(" due:") ->
            listOf("due:today", "due:tomorrow", "due:+7d", "due:+30d")
        else -> emptyList()
    }
}
