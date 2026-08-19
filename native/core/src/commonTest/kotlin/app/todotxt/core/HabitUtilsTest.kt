package app.todotxt.core

import kotlin.test.Test
import kotlin.test.assertEquals
import kotlin.test.assertFalse
import kotlin.test.assertTrue

/**
 * Ports the web app's habitUtils.test.ts suite: streaks, best streak,
 * completion rate, momentum names, and heatmap grid geometry. All tests use
 * the common (expect/actual) date helpers so they run on JVM and JS.
 */
class HabitUtilsTest {

    private fun habit(completedDates: List<String>) = Habit(
        id = "h1",
        name = "Meditate",
        color = HabitColor.EVERGREEN,
        completedDates = completedDates,
    )

    @Test
    fun streakIsZeroWithNoCompletions() {
        assertEquals(0, HabitUtils.getHabitStreak(habit(emptyList())))
    }

    @Test
    fun streakCountsConsecutiveDaysEndingToday() {
        val today = HabitUtils.today()
        val yesterday = addDaysString(today, -1)
        val twoAgo = addDaysString(today, -2)
        assertEquals(3, HabitUtils.getHabitStreak(habit(listOf(twoAgo, yesterday, today))))
    }

    @Test
    fun streakBreaksOnGap() {
        val today = HabitUtils.today()
        // Completed today and 2 days ago, but not yesterday — streak resets
        val twoAgo = addDaysString(today, -2)
        assertEquals(1, HabitUtils.getHabitStreak(habit(listOf(twoAgo, today))))
    }

    @Test
    fun bestStreakCapturesLongestRun() {
        val today = HabitUtils.today()
        val d1 = addDaysString(today, -10)
        val d2 = addDaysString(today, -9)
        val d3 = addDaysString(today, -8)
        assertEquals(3, HabitUtils.getBestStreak(habit(listOf(d1, d2, d3))))
    }

    @Test
    fun completionRateOver28Days() {
        val dates = HabitUtils.getLastDays(28)
        assertEquals(100, HabitUtils.getCompletionRate(habit(dates), 28))
        assertEquals(50, HabitUtils.getCompletionRate(habit(dates.take(14)), 28))
    }

    @Test
    fun heatmapGridIs12WeeksBy7Days() {
        val grid = HabitUtils.getHeatmap(habit(emptyList()))
        assertEquals(12, grid.size)
        grid.forEach { week -> assertEquals(7, week.size) }
    }

    @Test
    fun heatmapCovers12WeeksEndingToday() {
        val grid = HabitUtils.getHeatmap(habit(emptyList()))
        val flat = grid.flatten()
        // Grid covers exactly 84 days (12 weeks x 7), ending on today,
        // and future dates (none here) would be represented as null
        assertEquals(84, flat.size)
        assertEquals(HabitUtils.today(), flat.last())
        flat.filterNotNull().forEach { date ->
            assertTrue(date <= HabitUtils.today())
        }
    }

    @Test
    fun toggleDateAddsAndRemoves() {
        val today = HabitUtils.today()
        val h0 = habit(emptyList())
        val h1 = HabitUtils.toggleDate(h0, today)
        assertEquals(listOf(today), h1.completedDates)
        val h2 = HabitUtils.toggleDate(h1, today)
        assertTrue(h2.completedDates.isEmpty())
    }

    @Test
    fun lastDaysReturnsOrderedRecents() {
        val days = HabitUtils.getLastDays(7)
        assertEquals(7, days.size)
        // Oldest first: ends on today
        assertEquals(HabitUtils.today(), days.last())
    }

    @Test
    fun momentumReturnsSevenDayWindows() {
        val momentum = HabitUtils.getMomentum(habit(emptyList()))
        assertEquals(7, momentum.size)
        assertTrue(momentum.all { it.first.isNotBlank() })
    }

    @Test
    fun isHabitCompleteOn() {
        val today = HabitUtils.today()
        val h = habit(listOf(today))
        assertTrue(HabitUtils.isHabitCompleteOn(h, today))
        assertFalse(HabitUtils.isHabitCompleteOn(h, addDaysString(today, -1)))
    }

    @Test
    fun formatLocalDateProducesISOFormat() {
        val s = HabitUtils.formatLocalDate(HabitUtils.today())
        val parts = s.split("-")
        assertEquals(3, parts.size)
        assertEquals(4, parts[0].length)
    }
}
