package app.todotxt

import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.ui.Alignment
import androidx.compose.ui.ExperimentalComposeUiApi
import androidx.compose.ui.Modifier
import androidx.compose.ui.unit.DpSize
import androidx.compose.ui.unit.dp
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.res.painterResource
import androidx.compose.ui.window.MenuBar
import androidx.compose.ui.window.Tray
import androidx.compose.ui.window.Window
import androidx.compose.ui.window.WindowPosition
import androidx.compose.ui.window.application
import androidx.compose.ui.window.rememberWindowState
import app.todotxt.persistence.Storage
import app.todotxt.sync.AccountSyncManager
import app.todotxt.sync.FirebaseSyncManager
import app.todotxt.ui.AppRoot

@OptIn(ExperimentalComposeUiApi::class)
fun main() = application {
    Storage.load()
    // Desktop never ran the legacy relay; account sync (web-compatible) is
    // the only cloud engine here.
    AccountSyncManager.start()
    var isOpen by remember { mutableStateOf(true) }
    val windowState = rememberWindowState(
        size = DpSize(1180.dp, 780.dp),
        position = WindowPosition(Alignment.Center),
    )

    val icon = painterResource("icon.png")

    Tray(
        icon = icon,
        menu = {
            Item("Show Window", onClick = { isOpen = true })
            Separator()
            Item("Quit", onClick = ::exitApplication)
        }
    )

    if (isOpen) {
        Window(
            onCloseRequest = { isOpen = false },
            state = windowState,
            title = "T0do.TxT",
            icon = icon,
        ) {
            MenuBar {
                Menu("File", mnemonic = 'F') {
                    Item("Hide", onClick = { isOpen = false })
                    Item("Quit", onClick = ::exitApplication)
                }
            }
            AppRoot(Modifier.fillMaxSize())
        }
    }
}
