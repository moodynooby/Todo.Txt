package app.todotxt.update

import android.content.Intent
import android.net.Uri
import app.todotxt.TodoTxtApp

actual fun openReleaseUrl(url: String): Boolean = runCatching {
    val intent = Intent(Intent.ACTION_VIEW, Uri.parse(url)).apply {
        addFlags(Intent.FLAG_ACTIVITY_NEW_TASK)
    }
    TodoTxtApp.instance.startActivity(intent)
    true
}.getOrDefault(false)
