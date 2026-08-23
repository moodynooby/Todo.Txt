package app.todotxt.core

import kotlin.test.Test
import kotlin.test.assertEquals
import kotlin.test.assertFalse
import kotlin.test.assertNull
import kotlin.test.assertTrue

/**
 * Tests for the shared widget projection consumed by both the Glance
 * widgets (native app) and the Tauri RemoteViews providers.
 */
class WidgetDataTest {

    private fun habit(
        id: String = "h1",
        name: String = "Meditate",
        completedDates: List<String> = emptyList(),
        archived: Boolean = false,
        reminderEnabled: Boolean = false,
    ) = Habit(
        id = id,
        name = name,
        color = HabitColor.EVERGREEN,
        reminderEnabled = reminderEnabled,
        completedDates = completedDates,
        archived = archived,
    )

    private fun task(id: Int, text: String, completed: Boolean = false, due: String? = null) =
        Task(id = id, text = text, raw = text, completed = completed, due = due)

    @Test
    fun projectsOpenTasksWithDue() {
        val payload = WidgetData.project(
            tasks = listOf(task(1, "call mom"), task(2, "old", completed = true), task(3, "pay rent", due = "2030-01-02")),
            habits = emptyList(),
            today = "2030-01-01",
        )
        assertEquals(3, payload.tasks.size)
        assertTrue(payload.tasks[0].done == false && payload.tasks[1].done)
        assertEquals(listOf("call mom", "old", "pay rent"), payload.tasks.map { it.text })
        assertEquals("2030-01-02", payload.tasks[2].due)
        assertEquals("2030-01-01", payload.date)
    }

    @Test
    fun openTasksFiltersDoneAndCaps() {
        val tasks = (1..5).map { task(it, "t$it", completed = it == 1) }
        val payload = WidgetData.project(tasks = tasks, habits = emptyList())
        assertEquals(listOf("t2", "t3", "t4", "t5"), WidgetData.openTasks(payload).map { it.text })
        assertEquals(listOf("t2"), WidgetData.openTasks(payload, limit = 1).map { it.text })
    }

    @Test
    fun habitProjectionComputesStreakFlagsAndRate() {
        val today = HabitUtils.today()
        val h = habit(completedDates = listOf(today, addDaysString(today, -1), addDaysString(today, -7)))
        val p = WidgetData.projectHabit(h, today)

        assertEquals(2, p.streak)
        assertEquals(2, p.bestStreak)
        assertTrue(p.completedToday)
        assertEquals(30, p.last30.size)
        assertTrue(p.last30[29])
        assertTrue(p.last7.last())
        assertFalse(p.last7.first())
        assertEquals(12, p.last12Weeks.size)
        p.last12Weeks.forEach { week -> assertEquals(7, week.size) }
        assertNull(p.reminderTime)
    }

    @Test
    fun reminderTimeOnlyWhenEnabled() {
        val today = HabitUtils.today()
        val on = habit(reminderEnabled = true).copy(reminderTime = "07:15")
        assertEquals("07:15", WidgetData.projectHabit(on, today).reminderTime)
        val off = on.copy(reminderEnabled = false)
        assertNull(WidgetData.projectHabit(off, today).reminderTime)
    }

    @Test
    fun momentumAggregatesAcrossActiveHabits() {
        val today = HabitUtils.today()
        val strong = habit(id = "a", name = "Run", completedDates = List(5) { addDaysString(today, -it) })
        val weak = habit(id = "b", name = "Read", completedDates = listOf(today))
        val archived = habit(id = "c", name = "Gone", completedDates = listOf(today), archived = true)

        val m = WidgetData.project(tasks = emptyList(), habits = listOf(strong, weak, archived), today = today).momentum
        assertEquals(5, m.bestStreak)
        assertEquals("Run", m.bestHabitName)
        assertEquals(2, m.habitsTotal)
        assertEquals(2, m.habitsDoneToday)
        assertTrue(m.avgRate28 in 0..100)
    }

    @Test
    fun momentumIsEmptyWithoutHabits() {
        val m = WidgetData.project(tasks = emptyList(), habits = emptyList()).momentum
        assertEquals(0, m.bestStreak)
        assertEquals("", m.bestHabitName)
        assertEquals(0, m.habitsTotal)
    }
}
