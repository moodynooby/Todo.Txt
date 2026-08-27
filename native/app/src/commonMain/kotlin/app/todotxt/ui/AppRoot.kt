package app.todotxt.ui

import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.BoxWithConstraints
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxHeight
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.navigationBarsPadding
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.layout.width
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Check
import androidx.compose.material.icons.filled.MoreVert
import androidx.compose.material.icons.filled.Search
import androidx.compose.material.icons.filled.Settings
import androidx.compose.material3.AlertDialog
import androidx.compose.material3.Button
import androidx.compose.material3.DropdownMenu
import androidx.compose.material3.DropdownMenuItem
import androidx.compose.material3.ExperimentalMaterial3Api
import androidx.compose.material3.HorizontalDivider
import androidx.compose.material3.CircularProgressIndicator
import androidx.compose.material3.Icon
import androidx.compose.material3.ListItem
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.ModalBottomSheet
import androidx.compose.material3.NavigationBar
import androidx.compose.material3.NavigationBarItem
import androidx.compose.material3.NavigationRail
import androidx.compose.material3.NavigationRailItem
import androidx.compose.material3.Scaffold
import androidx.compose.material3.Text
import androidx.compose.material3.TextButton
import androidx.compose.material3.rememberModalBottomSheetState
import androidx.compose.runtime.Composable
import androidx.compose.runtime.DisposableEffect
import androidx.compose.runtime.LaunchedEffect
import androidx.compose.runtime.collectAsState
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.input.key.Key
import androidx.compose.ui.input.key.KeyEventType
import androidx.compose.ui.input.key.isCtrlPressed
import androidx.compose.ui.input.key.isMetaPressed
import androidx.compose.ui.input.key.onPreviewKeyEvent
import androidx.compose.ui.input.key.type
import androidx.compose.ui.input.key.key
import androidx.compose.ui.unit.dp
import app.todotxt.persistence.Storage
import app.todotxt.persistence.ThemeMode
import app.todotxt.theme.FieldNotesTheme
import app.todotxt.ui.ai.AiPage
import app.todotxt.ui.capture.CapturePage
import app.todotxt.ui.draw.ExcalidrawDrawPage
import app.todotxt.ui.editor.EditorPage
import app.todotxt.ui.habits.HabitsPage
import app.todotxt.ui.notes.NotesPage
import app.todotxt.ui.sync.AccountSyncPage
import app.todotxt.ui.timer.TimerPage
import app.todotxt.ui.todo.TodoPage
import app.todotxt.update.AppRelease
import app.todotxt.update.ReleaseUpdate
import app.todotxt.update.UpdateStatus
import app.todotxt.update.checkForReleaseUpdate
import app.todotxt.update.openReleaseUrl
import kotlinx.coroutines.launch

enum class Workspace(val title: String) {
    CAPTURE("Home"),
    TODO("Todos"),
    HABITS("Habits"),
    NOTES("Notes"),
    DRAW("Draw"),
    TIMER("Timer"),
    AI("AI"),
    EDITOR("Editor"),
    SYNC("Sync"),
}

private val primaryWorkspaces = listOf(
    Workspace.CAPTURE,
    Workspace.TODO,
    Workspace.HABITS,
    Workspace.NOTES,
    Workspace.DRAW,
)

private val secondaryWorkspaces = listOf(
    Workspace.TIMER,
    Workspace.AI,
    Workspace.EDITOR,
    Workspace.SYNC,
)

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun AppRoot(modifier: Modifier = Modifier) {
    val settings by Storage.settings.collectAsState()
    val darkTheme = when (settings.themeMode) {
        ThemeMode.LIGHT -> false
        ThemeMode.DARK -> true
        ThemeMode.SYSTEM -> androidx.compose.foundation.isSystemInDarkTheme()
    }
    FieldNotesTheme(darkTheme = darkTheme) {
        var workspace by remember { mutableStateOf(Workspace.CAPTURE) }
        var moreOpen by remember { mutableStateOf(false) }
        var commandOpen by remember { mutableStateOf(false) }
        var updateStatus by remember { mutableStateOf<UpdateStatus>(UpdateStatus.Idle) }
        val updateScope = androidx.compose.runtime.rememberCoroutineScope()
        LaunchedEffect(Unit) {
            updateStatus = UpdateStatus.Checking
            updateStatus = checkForReleaseUpdate()
        }
        val moreSheetState = rememberModalBottomSheetState(skipPartiallyExpanded = true)
        val content by Storage.content.collectAsState()
        val notes by Storage.notes.collectAsState()
        val habits by Storage.habits.collectAsState()

        BoxWithConstraints(
            modifier = modifier
                .fillMaxSize()
                .onPreviewKeyEvent { event ->
                    if (event.type == KeyEventType.KeyDown &&
                        event.key == Key.K &&
                        (event.isCtrlPressed || event.isMetaPressed)
                    ) {
                        commandOpen = true
                        true
                    } else {
                        false
                    }
                },
        ) {
            val compact = maxWidth < 720.dp
            Scaffold(
                modifier = Modifier.fillMaxSize(),
                bottomBar = {
                    if (compact) {
                        MobileNavigationBar(
                            workspace = workspace,
                            onWorkspaceSelected = { workspace = it },
                            onMore = { moreOpen = true },
                        )
                    }
                },
            ) { innerPadding ->
                Row(
                    Modifier
                        .fillMaxSize()
                        .padding(innerPadding),
                ) {
                    if (!compact) {
                        DesktopNavigationRail(
                            workspace = workspace,
                            onWorkspaceSelected = { workspace = it },
                            onCommandPalette = { commandOpen = true },
                        )
                    }
                    Box(
                        Modifier
                            .weight(1f)
                            .fillMaxHeight(),
                    ) {
                        when (workspace) {
                            Workspace.CAPTURE -> CapturePage(onOpen = { workspace = it })
                            Workspace.TODO -> TodoPage(content)
                            Workspace.HABITS -> HabitsPage(habits)
                            Workspace.NOTES -> NotesPage(notes)
                            Workspace.DRAW -> ExcalidrawDrawPage()
                            Workspace.TIMER -> TimerPage()
                            Workspace.AI -> AiPage()
                            Workspace.EDITOR -> EditorPage(
                                initialContent = content,
                                onBack = { workspace = Workspace.CAPTURE },
                            )
                            Workspace.SYNC -> AccountSyncPage()
                        }
                    }
                }
            }

            if (moreOpen) {
                ModalBottomSheet(
                    onDismissRequest = { moreOpen = false },
                    sheetState = moreSheetState,
                    modifier = Modifier.navigationBarsPadding(),
                ) {
                                            MoreToolsSheet(
                            current = workspace,
                            settings = settings.themeMode,
                            updateStatus = updateStatus,
                            onOpenCommandPalette = {
                                commandOpen = true
                                moreOpen = false
                            },

                        onWorkspaceSelected = {
                            workspace = it
                            moreOpen = false
                        },
                                                    onThemeSelected = { mode ->
                                Storage.updateSettings { it.copy(themeMode = mode) }
                            },
                            onCheckForUpdates = {
                                moreOpen = false
                                updateScope.launch {
                                    updateStatus = UpdateStatus.Checking
                                    updateStatus = checkForReleaseUpdate()
                                }
                            },

                    )
                }
            }

            if (commandOpen) {
                CommandPaletteDialog(
                    onDismiss = { commandOpen = false },
                    onWorkspaceSelected = { workspace = it },
                    onThemeSelected = { mode -> Storage.updateSettings { it.copy(themeMode = mode) } },
                )
            }

            when (val status = updateStatus) {
                is UpdateStatus.Available -> UpdateDialog(
                    release = status.release,
                    onLater = { updateStatus = UpdateStatus.UpToDate },
                )
                UpdateStatus.Checking -> Unit
                is UpdateStatus.Failed -> Unit
                UpdateStatus.Idle -> Unit
                UpdateStatus.UpToDate -> Unit
            }
        }
    }
}

@Composable
private fun UpdateDialog(
    release: ReleaseUpdate,
    onLater: () -> Unit,
) {
    AlertDialog(
        onDismissRequest = onLater,
        title = { Text("Update available") },
        text = {
            Column(verticalArrangement = Arrangement.spacedBy(8.dp)) {
                Text(release.name, style = MaterialTheme.typography.titleMedium)
                Text("Todo.Txt ${release.version} is ready. You are using ${AppRelease.currentVersion}.")
                if (release.notes.isNotBlank()) {
                    Text(
                        release.notes,
                        style = MaterialTheme.typography.bodySmall,
                        maxLines = 8,
                        overflow = androidx.compose.ui.text.style.TextOverflow.Ellipsis,
                    )
                }
            }
        },
        confirmButton = {
            Button(onClick = { openReleaseUrl(release.url); onLater() }) {
                Text("View release")
            }
        },
        dismissButton = {
            TextButton(onClick = onLater) { Text("Later") }
        },
    )
}

@Composable
private fun MobileNavigationBar(
    workspace: Workspace,
    onWorkspaceSelected: (Workspace) -> Unit,
    onMore: () -> Unit,
) {
    NavigationBar(
        modifier = Modifier.fillMaxWidth(),
        containerColor = MaterialTheme.colorScheme.surface,
    ) {
        primaryWorkspaces.forEach { destination ->
            NavigationBarItem(
                selected = workspace == destination,
                onClick = { onWorkspaceSelected(destination) },
                icon = {
                    WorkspaceIcon(
                        workspace = destination,
                        size = 28.dp,
                        contentDescription = destination.title,
                    )
                },
                label = { Text(destination.title) },
            )
        }
        NavigationBarItem(
            selected = workspace in secondaryWorkspaces,
            onClick = onMore,
            icon = {
                Icon(
                    Icons.Filled.MoreVert,
                    contentDescription = "More tools",
                    modifier = Modifier.size(24.dp),
                )
            },
            label = { Text("More") },
        )
    }
}

@Composable
private fun DesktopNavigationRail(
    workspace: Workspace,
    onWorkspaceSelected: (Workspace) -> Unit,
    onCommandPalette: () -> Unit,
) {
    NavigationRail(
        modifier = Modifier.fillMaxHeight(),
        containerColor = MaterialTheme.colorScheme.surface,
    ) {
        androidx.compose.material3.IconButton(onClick = onCommandPalette) {
            Icon(Icons.Filled.Search, contentDescription = "Command palette")
        }
        primaryWorkspaces.forEach { destination ->
            NavigationRailItem(
                selected = workspace == destination,
                onClick = { onWorkspaceSelected(destination) },
                icon = {
                    WorkspaceIcon(
                        workspace = destination,
                        size = 28.dp,
                        contentDescription = destination.title,
                    )
                },
                label = { Text(destination.title) },
            )
        }
        Spacer(Modifier.weight(1f))
        secondaryWorkspaces.forEach { destination ->
            NavigationRailItem(
                selected = workspace == destination,
                onClick = { onWorkspaceSelected(destination) },
                icon = { WorkspaceDestinationIcon(destination) },
                label = { Text(destination.title) },
            )
        }
        ThemeModeMenu()
    }
}

@Composable
private fun MoreToolsSheet(
    current: Workspace,
    settings: ThemeMode,
    updateStatus: UpdateStatus,
    onOpenCommandPalette: () -> Unit,
    onWorkspaceSelected: (Workspace) -> Unit,
    onThemeSelected: (ThemeMode) -> Unit,
    onCheckForUpdates: () -> Unit,
) {
    Column(
        modifier = Modifier
            .fillMaxWidth()
            .padding(horizontal = 20.dp)
            .navigationBarsPadding(),
        verticalArrangement = Arrangement.spacedBy(4.dp),
    ) {
        Text(
            "More tools",
            style = MaterialTheme.typography.headlineSmall,
            color = MaterialTheme.colorScheme.onSurface,
            modifier = Modifier.padding(bottom = 8.dp),
        )
        TextButton(
            onClick = onOpenCommandPalette,
            modifier = Modifier.fillMaxWidth(),
        ) { Text("Command palette") }
        secondaryWorkspaces.forEach { destination ->
            ListItem(
                headlineContent = { Text(destination.title) },
                leadingContent = { WorkspaceDestinationIcon(destination, size = 28.dp) },
                trailingContent = {
                    if (current == destination) {
                        Icon(Icons.Filled.Check, contentDescription = "Selected")
                    }
                },
                modifier = Modifier.fillMaxWidth(),
            )
            TextButton(
                onClick = { onWorkspaceSelected(destination) },
                modifier = Modifier.fillMaxWidth(),
            ) {
                Text("Open ${destination.title}")
            }
        }
        HorizontalDivider(modifier = Modifier.padding(vertical = 12.dp))
        TextButton(
            onClick = onCheckForUpdates,
            modifier = Modifier.fillMaxWidth(),
        ) {
            when (updateStatus) {
                UpdateStatus.Checking -> {
                    CircularProgressIndicator(modifier = Modifier.size(18.dp), strokeWidth = 2.dp)
                    Text("  Checking for updates…")
                }
                is UpdateStatus.Available -> Text("Update available: ${updateStatus.release.version}")
                is UpdateStatus.Failed -> Text("Check for updates")
                else -> Text("Check for updates")
            }
        }
        Text(
            "Todo.Txt ${AppRelease.currentVersion}",
            style = MaterialTheme.typography.bodySmall,
            color = MaterialTheme.colorScheme.onSurfaceVariant,
            modifier = Modifier.padding(bottom = 8.dp),
        )
        Text(
            "Appearance",
            style = MaterialTheme.typography.labelLarge,
            color = MaterialTheme.colorScheme.onSurfaceVariant,
        )
        ThemeMode.entries.forEach { mode ->
            TextButton(
                onClick = { onThemeSelected(mode) },
                modifier = Modifier.fillMaxWidth(),
            ) {
                Text(
                    text = if (settings == mode) "✓ ${mode.name.lowercase().replaceFirstChar { it.uppercase() }}"
                    else mode.name.lowercase().replaceFirstChar { it.uppercase() },
                )
            }
        }
    }
}

@Composable
private fun ThemeModeMenu() {
    var expanded by remember { mutableStateOf(false) }
    val settings by Storage.settings.collectAsState()
    Box {
        androidx.compose.material3.IconButton(
            onClick = { expanded = true },
        ) {
            Icon(Icons.Filled.Settings, contentDescription = "Appearance settings")
        }
        DropdownMenu(
            expanded = expanded,
            onDismissRequest = { expanded = false },
        ) {
            ThemeMode.entries.forEach { mode ->
                DropdownMenuItem(
                    text = { Text(mode.name.lowercase().replaceFirstChar { it.uppercase() }) },
                    onClick = {
                        Storage.updateSettings { it.copy(themeMode = mode) }
                        expanded = false
                    },
                    leadingIcon = {
                        if (settings.themeMode == mode) {
                            Icon(Icons.Filled.Check, contentDescription = "Selected")
                        }
                    },
                )
            }
        }
    }
}
