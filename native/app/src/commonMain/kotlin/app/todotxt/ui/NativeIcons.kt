package app.todotxt.ui

import androidx.compose.foundation.Image
import androidx.compose.foundation.layout.size
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.AutoAwesome
import androidx.compose.material.icons.filled.Home
import androidx.compose.material.icons.filled.MoreVert
import androidx.compose.material.icons.filled.NoteAlt
import androidx.compose.material.icons.filled.Sync
import androidx.compose.material.icons.filled.Timer
import androidx.compose.material3.Icon
import androidx.compose.runtime.Composable
import androidx.compose.ui.Modifier
import androidx.compose.ui.unit.Dp
import androidx.compose.ui.unit.dp
import androidx.compose.ui.layout.ContentScale
import androidx.compose.ui.semantics.contentDescription
import androidx.compose.ui.semantics.semantics
import org.jetbrains.compose.resources.DrawableResource
import org.jetbrains.compose.resources.painterResource
import todotxt_native.app.generated.resources.Res
import todotxt_native.app.generated.resources.icon_workspace_draw
import todotxt_native.app.generated.resources.icon_workspace_habits
import todotxt_native.app.generated.resources.icon_workspace_notes
import todotxt_native.app.generated.resources.icon_workspace_todo

/** Shared workspace identity icons. These are the same 3D assets used by web navigation. */
@Composable
fun WorkspaceIcon(
    workspace: Workspace,
    size: Dp = 28.dp,
    contentDescription: String? = null,
    modifier: Modifier = Modifier,
) {
    if (workspace == Workspace.CAPTURE) {
        Icon(
            Icons.Filled.Home,
            contentDescription = contentDescription,
            modifier = modifier.size(size),
        )
    } else {
        val resource: DrawableResource = when (workspace) {
            Workspace.TODO -> Res.drawable.icon_workspace_todo
            Workspace.HABITS -> Res.drawable.icon_workspace_habits
            Workspace.NOTES -> Res.drawable.icon_workspace_notes
            Workspace.DRAW -> Res.drawable.icon_workspace_draw
            else -> Res.drawable.icon_workspace_todo
        }
        Image(
            painter = painterResource(resource),
            contentDescription = contentDescription,
            contentScale = ContentScale.Fit,
            modifier = modifier.size(size).then(
                if (contentDescription == null) Modifier else Modifier.semantics {
                    this.contentDescription = contentDescription
                },
            ),
        )
    }
}

@Composable
fun WorkspaceDestinationIcon(workspace: Workspace, size: Dp = 26.dp) {
    if (workspace == Workspace.TODO || workspace == Workspace.HABITS ||
        workspace == Workspace.NOTES || workspace == Workspace.DRAW
    ) {
        WorkspaceIcon(workspace = workspace, size = size)
    } else {
        val icon = when (workspace) {
            Workspace.CAPTURE -> Icons.Filled.Home
            Workspace.TIMER -> Icons.Filled.Timer
            Workspace.AI -> Icons.Filled.AutoAwesome
            Workspace.EDITOR -> Icons.Filled.NoteAlt
            Workspace.SYNC -> Icons.Filled.Sync
            else -> Icons.Filled.MoreVert
        }
        Icon(icon, contentDescription = workspace.title, modifier = Modifier.size(size))
    }
}
