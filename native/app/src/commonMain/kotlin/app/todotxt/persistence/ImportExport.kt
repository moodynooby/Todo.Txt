package app.todotxt.persistence

/**
 * Platform-level import/export of the todo.txt document. Desktop resolves the
 * result synchronously via file dialogs; Android resolves it asynchronously
 * through document-picker launchers wired by `AndroidImportExportControls`,
 * so callers await results via `ImportExportBridge`.
 */

sealed class ImportExportResult {
    data class Imported(val content: String) : ImportExportResult()
    data object Shared : ImportExportResult()
    data object Cancelled : ImportExportResult()
}

expect fun importTodoDocument(): ImportExportResult
expect fun exportTodoDocument(content: String): ImportExportResult

/** Bridge that delivers asynchronous Android results to the UI. */
object ImportExportBridge {
    var onImported: ((String) -> Unit)? = null
    var onExportShared: (() -> Unit)? = null
}
