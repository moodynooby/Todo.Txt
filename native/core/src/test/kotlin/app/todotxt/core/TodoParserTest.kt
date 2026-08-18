package app.todotxt.core

import kotlin.test.Test
import kotlin.test.assertEquals
import kotlin.test.assertNull
import kotlin.test.assertTrue
import kotlin.test.assertFalse

/**
 * Ports the web app's todoParser.test.ts suite: checkboxes, x-prefix
 * completion, priority, +projects, @contexts, letter-first rules, and
 * due: date forms (today/tomorrow/yesterday/now/ISO/T-time/@-time).
 */
class TodoParserTest {

    @Test
    fun parsesOpenCheckbox() {
        val line = "-[ ] buy groceries"
        val task = TodoParser.parseTodoLine(line)
        assertFalse(task.completed)
        assertTrue(task.text.contains("buy groceries"))
    }

    @Test
    fun parsesCompletedCheckbox() {
        val line = "-[x] buy groceries"
        val task = TodoParser.parseTodoLine(line)
        assertTrue(task.completed)
        assertTrue(task.text.contains("buy groceries"))
    }

    @Test
    fun parsesXPrefixAsCompleted() {
        val line = "x buy groceries"
        val task = TodoParser.parseTodoLine(line)
        assertTrue(task.completed)
        assertTrue(task.text.contains("buy groceries"))
    }

    @Test
    fun parsesPriority() {
        val line = "(A) call dentist"
        val task = TodoParser.parseTodoLine(line)
        assertEquals("A", task.priority)
        assertTrue(task.text.contains("call dentist"))
    }

    @Test
    fun parsesProjects() {
        val line = "+work finish the report"
        val task = TodoParser.parseTodoLine(line)
        assertEquals(listOf("work"), task.projects)
        assertTrue(task.text.contains("finish the report"))
    }

    @Test
    fun parsesContexts() {
        val line = "call dentist @phone"
        val task = TodoParser.parseTodoLine(line)
        assertEquals(listOf("phone"), task.contexts)
    }

    @Test
    fun projectsAndContextsMustStartWithLetters() {
        // Digits/symbols mid-word do not start new project/context tokens
        val line = "+1project @9place +Work @Home"
        val task = TodoParser.parseTodoLine(line)
        assertEquals(listOf("Work"), task.projects)
        assertEquals(listOf("Home"), task.contexts)
        assertTrue(task.text.contains("1project"))
        assertTrue(task.text.contains("9place"))
    }

    @Test
    fun parsesMultipleProjectsAndContexts() {
        val line = "+work +urgent call @phone @office"
        val task = TodoParser.parseTodoLine(line)
        assertEquals(listOf("work", "urgent"), task.projects)
        assertEquals(listOf("phone", "office"), task.contexts)
    }

    @Test
    fun parsesDueToday() {
        val task = TodoParser.parseTodoLine("review PR due:today")
        assertEquals(TodoParser.today(), task.due)
        assertTrue(task.text.contains("review PR"))
    }

    @Test
    fun parsesDueTomorrowAndYesterday() {
        assertEquals(TodoParser.tomorrow(), TodoParser.parseTodoLine("a due:tomorrow").due)
        assertEquals(TodoParser.yesterday(), TodoParser.parseTodoLine("a due:yesterday").due)
    }

    @Test
    fun parsesDueNow() {
        assertEquals(TodoParser.today(), TodoParser.parseTodoLine("a due:now").due)
    }

    @Test
    fun parsesDueISOString() {
        assertEquals("2026-08-20", TodoParser.parseTodoLine("a due:2026-08-20").due)
        assertEquals(null, TodoParser.parseTodoLine("a due:2026-08-20").dueTime)
    }

    @Test
    fun parsesDueTTimeAndATTime() {
        // `due:T` and `due:@` forms hand their clock time to dueTime
        val tTask = TodoParser.parseTodoLine("a due:T15:30")
        assertEquals(TodoParser.today(), tTask.due)
        assertEquals("15:30", tTask.dueTime)
        val aTask = TodoParser.parseTodoLine("a due:@15:30")
        assertEquals(TodoParser.today(), aTask.due)
        assertEquals("15:30", aTask.dueTime)
    }

    @Test
    fun setLineCompletedMarksDone() {
        val content = "-[ ] buy groceries +errands"
        val done = TodoParser.setLineCompleted(content, 0, true)
        assertTrue(done.contains("[x]"))
        val undone = TodoParser.setLineCompleted(done, 0, false)
        assertTrue(undone.contains("[ ]"))
    }

    @Test
    fun setLineCompletedConvertsXPrefix() {
        val content = "x buy groceries"
        val undone = TodoParser.setLineCompleted(content, 0, false)
        assertFalse(TodoParser.parseTodoLine(undone).completed)
    }

    @Test
    fun preservesMetadataOnCompletion() {
        val content = "(A) +work due:today finish report"
        val done = TodoParser.setLineCompleted(content, 0, true)
        val reparsed = TodoParser.parseTodoLine(done)
        assertTrue(reparsed.completed)
        assertEquals(listOf("work"), reparsed.projects)
    }

    @Test
    fun addsCheckboxToPlainLineOnCompletion() {
        val content = "buy groceries"
        val done = TodoParser.setLineCompleted(content, 0, true)
        assertTrue(done.contains("-[x] buy groceries"))
    }

    @Test
    fun parsesPlainTextWithNoMetadata() {
        val task = TodoParser.parseTodoLine("just a normal note")
        assertFalse(task.completed)
        assertNull(task.priority)
        assertTrue(task.projects.isEmpty())
        assertTrue(task.contexts.isEmpty())
        assertNull(task.due)
        assertEquals("just a normal note", task.text)
    }

    @Test
    fun parseTodoContentBuildsIndexes() {
        val content = "-[ ] +work call @phone\n-[x] buy groceries\n(A) finish report due:2026-08-20"
        val parsed = TodoParser.parseTodoContent(content)
        assertEquals(3, parsed.tasks.size)
        assertEquals(1, parsed.completedCount)
        // Indexes only cover active (non-completed) tasks
        assertEquals(1, parsed.projects["work"]?.size)
        assertEquals(1, parsed.contexts["phone"]?.size)
        assertEquals(1, parsed.dueDates["2026-08-20"]?.size)
    }
}
