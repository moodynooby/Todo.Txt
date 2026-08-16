package app.todotxt.ui

import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.fillMaxHeight
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.padding
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Favorite
import androidx.compose.material.icons.filled.List
import androidx.compose.material.icons.filled.Edit
import androidx.compose.material.icons.filled.FavoriteBorder
import androidx.compose.material3.Icon
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.NavigationRail
import androidx.compose.material3.NavigationRailItem
import androidx.compose.material3.Scaffold
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.collectAsState
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Modifier
import androidx.compose.ui.text.font.FontWeight
import app.todotxt.persistence.Storage
import app.todotxt.theme.FieldNotesTheme
import app.todotxt.ui.ai.AiPage
import app.todotxt.ui.draw.DrawPage
import app.todotxt.ui.habits.HabitsPage
import app.todotxt.ui.notes.NotesPage
import app.todotxt.ui.timer.TimerPage
import app.todotxt.ui.todo.TodoPage

enum class Workspace(val title: String) {
    TODO("Todos"),
    HABITS("Habits"),
    NOTES("Notes"),
    DRAW("Draw"),
    TIMER("Timer"),
    AI("AI"),
}

@Composable
fun AppRoot(modifier: Modifier = Modifier) {
    FieldNotesTheme {
        var workspace by remember { mutableStateOf(Workspace.TODO) }

        Scaffold(modifier = modifier) { innerPadding ->
            Row(Modifier.fillMaxSize().padding(innerPadding)) {
                NavigationRail(
                    modifier = Modifier.fillMaxHeight(),
                    containerColor = MaterialTheme.colorScheme.surface,
                ) {
                    NavigationRailItem(
                        selected = workspace == Workspace.TODO,
                        onClick = { workspace = Workspace.TODO },
                        icon = { Icon(Icons.Filled.List, contentDescription = "Todos") },
                        label = { Text("Todos") },
                    )
                    NavigationRailItem(
                        selected = workspace == Workspace.HABITS,
                        onClick = { workspace = Workspace.HABITS },
                        icon = { Icon(Icons.Filled.Favorite, contentDescription = "Habits") },
                        label = { Text("Habits") },
                    )
                    NavigationRailItem(
                        selected = workspace == Workspace.NOTES,
                        onClick = { workspace = Workspace.NOTES },
                        icon = { Icon(Icons.Filled.Edit, contentDescription = "Notes") },
                        label = { Text("Notes") },
                    )
                    NavigationRailItem(
                        selected = workspace == Workspace.DRAW,
                        onClick = { workspace = Workspace.DRAW },
                        icon = { Icon(Icons.Filled.FavoriteBorder, contentDescription = "Draw") },
                        label = { Text("Draw") },
                    )
                    NavigationRailItem(
                        selected = workspace == Workspace.TIMER,
                        onClick = { workspace = Workspace.TIMER },
                        icon = { Icon(Icons.Filled.FavoriteBorder, contentDescription = "Timer") },
                        label = { Text("Timer") },
                    )
                    NavigationRailItem(
                        selected = workspace == Workspace.AI,
                        onClick = { workspace = Workspace.AI },
                        icon = { Icon(Icons.Filled.FavoriteBorder, contentDescription = "AI") },
                        label = { Text("AI") },
                    )
                }
                val content by Storage.content.collectAsState()
                val notes by Storage.notes.collectAsState()
                val habits by Storage.habits.collectAsState()

                when (workspace) {
                    Workspace.TODO -> TodoPage(content)
                    Workspace.HABITS -> HabitsPage(habits)
                    Workspace.NOTES -> NotesPage(notes)
                    Workspace.DRAW -> DrawPage()
                    Workspace.TIMER -> TimerPage()
                    Workspace.AI -> AiPage()
                }
            }
        }
    }
}
