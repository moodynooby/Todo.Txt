package app.todotxt.ui.todo

import app.todotxt.core.Filter
import app.todotxt.core.FilterType
import app.todotxt.core.TodoParser
import kotlin.test.Test
import kotlin.test.assertEquals
import kotlin.test.assertTrue

class TodoParityTest {
    private val content = """
        (A) plan release +work @office due:2026-09-01
        -[x] publish notes +docs @home
        review <script> output
    """.trimIndent()

    @Test
    fun filtersMatchLegacyMetadataAndCompletionSemantics() {
        val parsed = TodoParser.parseTodoContent(content)

        assertEquals(3, filteredTasks(parsed, null, "", true).size)
        assertEquals(2, filteredTasks(parsed, null, "", false).size)
        assertEquals(1, filteredTasks(parsed, Filter(FilterType.PRIORITY, "A"), "", true).size)
        assertEquals(1, filteredTasks(parsed, Filter(FilterType.PROJECT, "work"), "", true).size)
        assertEquals(1, filteredTasks(parsed, Filter(FilterType.CONTEXT, "home"), "", true).size)
        assertEquals(1, filteredTasks(parsed, Filter(FilterType.DUE, "2026-09-01"), "", true).size)
        assertEquals(1, filteredTasks(parsed, Filter(FilterType.COMPLETION, "done"), "", true).size)
        assertEquals(1, filteredTasks(parsed, null, "release", true).size)
    }

    @Test
    fun markdownExportKeepsActiveAndCompletedSections() {
        val markdown = content.renderTodoAsMarkdown()

        assertTrue(markdown.contains("## Active"))
        assertTrue(markdown.contains("plan release"))
        assertTrue(markdown.contains("## Completed"))
        assertTrue(markdown.contains("~~publish notes +docs @home~~"))
        assertTrue(markdown.contains("## Projects"))
        assertTrue(markdown.contains("- +work"))
    }

    @Test
    fun htmlExportEscapesTaskTextAndMarksCompletedRows() {
        val html = content.renderTodoAsHtml()

        assertTrue(html.contains("class=\" done\""))
        assertTrue(html.contains("&lt;script&gt;"))
        assertTrue(!html.contains("<script>"))
    }
}
