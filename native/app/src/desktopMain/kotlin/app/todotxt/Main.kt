package app.todotxt

import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.ui.Alignment
import androidx.compose.ui.ExperimentalComposeUiApi
import androidx.compose.ui.Modifier
import androidx.compose.ui.input.key.Key
import androidx.compose.ui.unit.DpSize
import androidx.compose.ui.unit.dp
import androidx.compose.ui.window.MenuBar
import androidx.compose.ui.window.Window
import androidx.compose.ui.window.WindowPosition
import androidx.compose.ui.window.application
import androidx.compose.ui.window.rememberWindowState
import app.todotxt.persistence.Storage
import app.todotxt.ui.AppRoot

@OptIn(ExperimentalComposeUiApi::class)
fun main() = application {
    Storage.load()
    val windowState = rememberWindowState(
        size = DpSize(1180.dp, 780.dp),
        position = WindowPosition(Alignment.Center),
    )

    Window(
        onCloseRequest = ::exitApplication,
        state = windowState,
        title = "T0do.TxT",
    ) {
        MenuBar {
            Menu("File", mnemonic = 'F') {
                Item("Quit", onClick = ::exitApplication)
            }
            Menu("Help", mnemonic = 'H') {
                Item("About T0do.TxT", onClick = {})
            }
        }
        AppRoot(Modifier.fillMaxSize())
    }
}
