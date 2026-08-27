package app.todotxt

import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.ui.Modifier
import androidx.compose.ui.ExperimentalComposeUiApi
import androidx.compose.ui.window.ComposeViewport
import app.todotxt.persistence.Storage
import app.todotxt.ui.AppRoot

@OptIn(ExperimentalComposeUiApi::class)
fun main() {
    Storage.load()
    ComposeViewport("root") {
        AppRoot(Modifier.fillMaxSize())
    }
}
