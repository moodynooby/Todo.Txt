package app.todotxt.core

import kotlin.test.Test
import kotlin.test.assertEquals
import kotlin.test.assertTrue

class HabitMergeTest {

    private fun habit(id: String, updatedAt: Long, dates: List<String>, name: String = "H$id") =
        Habit(id = id, name = name, color = HabitColor.EVERGREEN, completedDates = dates, updatedAt = updatedAt)

    @Test
    fun keepsDisjointHabits() {
        val merged = HabitMerge.merge(listOf(habit("a", 1, listOf())), listOf(habit("b", 2, listOf())))
        assertEquals(setOf("a", "b"), merged.map { it.id }.toSet())
    }

    @Test
    fun newerSideWinsFieldsButDatesAlwaysUnion() {
        val local = habit("a", updatedAt = 10, dates = listOf("2030-01-01"), name = "LocalName")
        val remote = habit("a", updatedAt = 20, dates = listOf("2030-01-02"), name = "RemoteName")

        val m = HabitMerge.merge(listOf(local), listOf(remote)).single()
        // Remote is newer → its fields win…
        assertEquals("RemoteName", m.name)
        // …but neither side's completions are lost.
        assertEquals(listOf("2030-01-01", "2030-01-02"), m.completedDates)
        assertEquals(20, m.updatedAt)
    }

    @Test
    fun olderLocalStillKeepsItsDates() {
        // Regression: the old JS merge dropped the loser's unique dates.
        val local = habit("a", updatedAt = 5, dates = listOf("2030-03-01"))
        val remote = habit("a", updatedAt = 50, dates = listOf("2030-04-01"))

        val m = HabitMerge.merge(listOf(local), listOf(remote)).single()
        assertTrue(m.completedDates.containsAll(listOf("2030-03-01", "2030-04-01")))
    }

    @Test
    fun tieGoesToRemote() {
        val local = habit("a", updatedAt = 7, dates = emptyList(), name = "L")
        val remote = habit("a", updatedAt = 7, dates = emptyList(), name = "R")
        assertEquals("R", HabitMerge.merge(listOf(local), listOf(remote)).single().name)
    }

    @Test
    fun mergeIsCommutativeOnDates() {
        val a = habit("a", 1, listOf("2030-01-01"))
        val b = habit("a", 2, listOf("2030-01-02"))
        val ab = HabitMerge.merge(listOf(a), listOf(b)).single().completedDates
        val ba = HabitMerge.merge(listOf(b), listOf(a)).single().completedDates
        assertEquals(ab, ba)
    }
}
