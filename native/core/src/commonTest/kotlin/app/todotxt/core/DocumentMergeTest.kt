package app.todotxt.core

import kotlin.test.Test
import kotlin.test.assertEquals

class DocumentMergeTest {
    @Test
    fun importedDocumentIsPrependedToExistingContent() {
        assertEquals(
            "imported task\nexisting task",
            mergeImportedTodo("existing task", "imported task"),
        )
    }

    @Test
    fun emptyExistingDocumentReturnsImportedContent() {
        assertEquals("imported task", mergeImportedTodo("", "imported task"))
    }

    @Test
    fun emptyImportedDocumentLeavesExistingContentUntouched() {
        assertEquals("existing task", mergeImportedTodo("existing task", ""))
    }
}
