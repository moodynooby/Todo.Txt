package app.todotxt.core

import kotlin.test.Test
import kotlin.test.assertEquals
import kotlin.test.assertTrue

class DependencyAnalyzerTest {
    @Test
    fun reportsCompletedAndBlockedTasks() {
        val report = DependencyAnalyzer.build(
            listOf(
                TodoParser.parseTodoLine("-[x] foundation id:base"),
                TodoParser.parseTodoLine("-[ ] ship feature id:feature after:base"),
                TodoParser.parseTodoLine("-[ ] publish id:publish after:feature"),
            ),
        )

        assertEquals(DependencyStatus.COMPLETED, report.statuses["base"])
        assertEquals(DependencyStatus.ACTIVE, report.statuses["feature"])
        assertEquals(DependencyStatus.BLOCKED, report.statuses["publish"])
        assertTrue(report.missingReferences.isEmpty())
    }

    @Test
    fun reportsMissingReferencesAsBlocked() {
        val report = DependencyAnalyzer.build(
            listOf(TodoParser.parseTodoLine("-[ ] task id:task after:missing")),
        )

        assertEquals(listOf("missing"), report.missingReferences)
        assertEquals(DependencyStatus.BLOCKED, report.statuses["task"])
    }

    @Test
    fun detectsCyclesThroughAfterAndBlocksEdges() {
        val report = DependencyAnalyzer.build(
            listOf(
                TodoParser.parseTodoLine("-[ ] first id:first after:second"),
                TodoParser.parseTodoLine("-[ ] second id:second after:first"),
            ),
        )

        assertTrue(report.hasCycle)
        assertEquals(listOf("first", "second", "first"), report.cyclePath)
    }

    @Test
    fun assignsStableLineIdsWhenMetadataIsAbsent() {
        val report = DependencyAnalyzer.build(
            TodoParser.parseTodoContent("-[ ] first\n-[ ] second").tasks,
        )

        assertEquals(listOf("line-1", "line-2"), report.nodes.map { it.id })
    }
}
