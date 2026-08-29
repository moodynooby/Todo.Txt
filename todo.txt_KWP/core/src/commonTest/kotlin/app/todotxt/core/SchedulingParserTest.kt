package app.todotxt.core

import kotlin.test.Test
import kotlin.test.assertEquals
import kotlin.test.assertNotNull
import kotlin.test.assertNull
import kotlin.test.assertTrue
import kotlin.test.assertIs

/**
 * Ports the web app's advancedParser relative-date / recurrence behaviour:
 * `in N days|weeks|months|years`, `every Monday`, `every Tuesday, Thursday`,
 * `every 2nd Tuesday`, `every 3 days`, am/pm time normalisation, and
 * `rec:` modes.
 */
class SchedulingParserTest {

    @Test
    fun parsesRelativeDays() {
        val result = SchedulingParser.parseSchedulingPhrase("in 3 days", today = "2026-08-18")
        assertIs<SchedulingParser.ScheduleResult.Relative>(result)
        assertEquals("2026-08-21", result.relative.date)
        assertEquals(3, result.relative.amount)
    }

    @Test
    fun parsesRelativeWeeksAndMonths() {
        val weeks = SchedulingParser.parseSchedulingPhrase("in 2 weeks", today = "2026-08-18")
        assertIs<SchedulingParser.ScheduleResult.Relative>(weeks)
        assertEquals("2026-09-01", weeks.relative.date)

        val months = SchedulingParser.parseSchedulingPhrase("in 1 month", today = "2026-08-18")
        assertIs<SchedulingParser.ScheduleResult.Relative>(months)
        assertEquals("2026-09-18", months.relative.date)
    }

    @Test
    fun parsesRelativeYearsAndClampFeb29() {
        val years = SchedulingParser.parseSchedulingPhrase("in 1 year", today = "2026-08-18")
        assertIs<SchedulingParser.ScheduleResult.Relative>(years)
        assertEquals("2027-08-18", years.relative.date)

        // Non-leap target clamps day 29 → 28.
        val feb = SchedulingParser.parseSchedulingPhrase("in 1 year", today = "2024-02-29")
        assertIs<SchedulingParser.ScheduleResult.Relative>(feb)
        assertEquals("2025-02-28", feb.relative.date)
    }

    @Test
    fun parsesRecurringWeekdays() {
        val result = SchedulingParser.parseSchedulingPhrase("every Monday")
        assertIs<SchedulingParser.ScheduleResult.Recurrence>(result)
        assertEquals("weekly", result.rule.freq)
        assertEquals(1, result.rule.interval)
        assertEquals(listOf(1), result.rule.byDay)
    }

    @Test
    fun parsesRecurringMultipleDaysWithTime() {
        val result = SchedulingParser.parseSchedulingPhrase("every Tuesday, Thursday at 9:00")
        assertIs<SchedulingParser.ScheduleResult.Recurrence>(result)
        assertEquals(listOf(2, 4), result.rule.byDay)
        assertEquals("09:00", result.rule.time)
    }

    @Test
    fun parsesNthWeekdayRecurrence() {
        val result = SchedulingParser.parseSchedulingPhrase("every 2nd Tuesday at 3pm")
        assertIs<SchedulingParser.ScheduleResult.Recurrence>(result)
        assertEquals("monthly", result.rule.freq)
        assertNotNull(result.rule.nthWeekday)
        assertEquals(2, result.rule.nthWeekday!!.n)
        assertEquals(2, result.rule.nthWeekday!!.day)
        assertEquals("15:00", result.rule.time)
    }

    @Test
    fun parsesIntervalRecurrence() {
        val result = SchedulingParser.parseSchedulingPhrase("every 3 days")
        assertIs<SchedulingParser.ScheduleResult.Recurrence>(result)
        assertEquals("daily", result.rule.freq)
        assertEquals(3, result.rule.interval)
    }

    @Test
    fun parsesRecMode() {
        val result = SchedulingParser.parseSchedulingPhrase("every Monday at 9am rec:workdays")
        assertIs<SchedulingParser.ScheduleResult.Recurrence>(result)
        assertEquals("workdays", result.rule.mode)
        assertEquals("09:00", result.rule.time)
    }

    @Test
    fun unknownPhraseReportsError() {
        val result = SchedulingParser.parseSchedulingPhrase("sometime later")
        assertIs<SchedulingParser.ScheduleResult.Error>(result)
    }

    @Test
    fun setTaskCompletedMatchesByRawText() {
        val content = "buy milk\n-[ ] walk the dog\n"
        val task = TodoParser.parseTodoLine("-[ ] walk the dog", id = 42)
        val updated = TodoParser.setTaskCompleted(content, task, completed = true)
        assertTrue("-[x] walk the dog" in updated)
        assertTrue("buy milk" in updated)
    }
}
