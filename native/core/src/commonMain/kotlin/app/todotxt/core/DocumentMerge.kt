package app.todotxt.core

/**
 * Merge imported todo.txt lines before the current document, matching the
 * existing Android import behavior while keeping the rule shared by every
 * platform.
 */
fun mergeImportedTodo(existing: String, imported: String): String = when {
    existing.isBlank() -> imported
    imported.isBlank() -> existing
    else -> "$imported\n$existing"
}
