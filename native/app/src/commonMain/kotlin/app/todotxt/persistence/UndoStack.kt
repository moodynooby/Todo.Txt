package app.todotxt.persistence

import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow

/**
 * Global undo stack for destructive document actions.
 *
 * Every destructive action (complete a task, clear completed, bulk delete,
 * archive, habit/notes edits) pushes an [UndoEntry] describing the old
 * document state. The most recent entry can be reversed via [undo], which
 * writes the restored content back through [Storage.setContent].
 *
 * Entries live in common code and expire after [MAX_AGE_MS] so undo is a
 * session affordance, not a history browser. Web app has no undo at all —
 * this is a native-exclusive UX upgrade.
 */
object UndoStack {

    /** Maximum time an undo stays reversible (ms). */
    private const val MAX_AGE_MS = 60_000L

    /** Maximum retained entries. */
    private const val MAX_ENTRIES = 25

    data class UndoEntry(
        /** Snapshot of the todo.txt content to restore. */
        val todoContent: String?,
        /** Human-readable description shown in the undo toast. */
        val description: String,
        /** Wall-clock time the entry was pushed. */
        val pushedAtMs: Long = currentTimeMillis(),
    )

    private val _pending = MutableStateFlow<UndoEntry?>(null)
    val pending: StateFlow<UndoEntry?> = _pending.asStateFlow()

    private val history = ArrayDeque<UndoEntry>(MAX_ENTRIES)

    fun push(
        todoContent: String? = null,
        description: String,
    ) {
        if (todoContent != null) {
            history.addLast(UndoEntry(todoContent, description))
            while (history.size > MAX_ENTRIES) history.removeFirst()
        }
        _pending.value = UndoEntry(todoContent, description)
    }

    /**
     * Reverse the most recent entry. Returns true if an undo was applied.
     * Restores the todo.txt snapshot when present, then clears the pending
     * entry so the toast dismisses.
     */
    fun undo(): Boolean {
        val entry = history.removeLastOrNull() ?: return false
        entry.todoContent?.let { Storage.setContent(it) }
        _pending.value = null
        return true
    }

    /** Dismiss the pending toast without undoing. */
    fun dismiss() {
        _pending.value = null
    }
}

internal fun currentTimeMillis(): Long = System.currentTimeMillis()
