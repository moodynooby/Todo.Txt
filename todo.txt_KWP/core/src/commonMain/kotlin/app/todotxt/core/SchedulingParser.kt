package app.todotxt.core

import kotlinx.datetime.DatePeriod
import kotlinx.datetime.LocalDate
import kotlinx.datetime.plus

/**
 * Field Notes Ritual scheduling parser — Kotlin Multiplatform port of
 * `src/utils/advancedParser.ts` (`parseRelativeDateExpression`,
 * `parseRecurringScheduleExpression`).
 *
 * Turns natural-language phrases into machine-readable schedules:
 *
 * - Relative dates: `in 3 days`, `in 2 weeks`, `in 1 month`, `in 1 year`
 * - Recurring schedules: `every Monday`, `every Tuesday, Thursday`,
 *   `every 2nd Tuesday`, `every 3 days`, `every Monday at 9:00`,
 *   `every 2nd Tuesday at 3pm rec:workdays`
 */
object SchedulingParser {

    /* ---------- Public API ---------- */

    /** A relative date result, e.g. "in 3 days" → a YYYY-MM-DD string. */
    data class RelativeDate(val date: String, val amount: Int, val unit: String)

    /** A recurring schedule rule, mirroring the web `RecurrenceRule`. */
    data class RecurrenceRule(
        val freq: String,            // daily | weekly | monthly | yearly
        val interval: Int = 1,
        val byDay: List<Int>? = null,           // 0=Sun..6=Sat
        val nthWeekday: NthWeekday? = null,     // e.g. 2nd Tuesday
        val time: String? = null,               // HH:MM
        val mode: String = "strict",            // strict | workdays | completion
    )

    data class NthWeekday(val n: Int, val day: Int)

    /** Result of parsing a scheduling phrase. */
    sealed class ScheduleResult {
        data class Relative(val relative: RelativeDate) : ScheduleResult()
        data class Recurrence(val rule: RecurrenceRule) : ScheduleResult()
        data class Error(val message: String) : ScheduleResult()
    }

    /**
     * Parse a natural-language scheduling phrase. Tries the relative-date
     * grammar first, then the recurrence grammar, and reports a failure if
     * neither matches.
     */
    fun parseSchedulingPhrase(text: String, today: String? = null): ScheduleResult {
        val base: String = today ?: TodoParser.today()
        parseRelativeDateExpression(text, base)?.let { return ScheduleResult.Relative(it) }
        parseRecurringScheduleExpression(text)?.let { return ScheduleResult.Recurrence(it) }
        return ScheduleResult.Error(
            "Try a relative date such as 'in 3 days' or a schedule such as " +
                "'every 2nd Tuesday at 3pm'.",
        )
    }

    /* ---------- Relative dates ---------- */

    private val RE_RELATIVE = Regex(
        """in\s+(\d+)\s+(day|days|week|weeks|month|months|year|years)""",
        RegexOption.IGNORE_CASE,
    )

    private fun parseRelativeDateExpression(
        text: String,
        today: String,
    ): RelativeDate? {
        val match = RE_RELATIVE.find(text.trim()) ?: return null
        val amount = match.groupValues[1].toIntOrNull() ?: return null
        val unit = match.groupValues[2].lowercase()
        val date = when {
            unit.startsWith("day") -> addDaysString(today, amount)
            unit.startsWith("week") -> addDaysString(today, amount * 7)
            unit.startsWith("month") -> addMonthsString(today, amount)
            unit.startsWith("year") -> addYearsString(today, amount)
            else -> return null
        }
        return RelativeDate(date, amount, unit)
    }

    /* ---------- Recurrence ---------- */

    private val RE_RECURRENCE = Regex(
        """every\s+([A-Za-z0-9\s,]+?)(?:\s+at\s+(\d{1,2}(?::\d{2})?\s*(?:am|pm)?))?(?:\s+rec:(strict|workdays|completion))?${'$'}""",
        RegexOption.IGNORE_CASE,
    )

    private val WEEKDAY_MAP = mapOf(
        "sunday" to 0, "monday" to 1, "tuesday" to 2, "wednesday" to 3,
        "thursday" to 4, "friday" to 5, "saturday" to 6,
    )

    private val RE_NTH_WEEKDAY = Regex("""^(\d+)(?:st|nd|rd|th)?\s+([A-Za-z]+)${'$'}""")
    private val RE_INTERVAL = Regex(
        """(\d+)?\s*(day|days|week|weeks|month|months|year|years)""",
        RegexOption.IGNORE_CASE,
    )

    private fun parseRecurringScheduleExpression(text: String): RecurrenceRule? =
        parseRecurringScheduleExpressionInternal(text)

    internal fun parseRecurringScheduleExpressionInternal(text: String): RecurrenceRule? {
        val match = RE_RECURRENCE.find(text.trim()) ?: return null
        val schedulePart = match.groupValues[1].trim()
        val timePart = match.groupValues[2].takeIf { it.isNotBlank() }
        val modePart = match.groupValues[3].lowercase().takeIf { it.isNotBlank() } ?: "strict"

        var freq = "weekly"
        var interval = 1
        var nthWeekday: NthWeekday? = null
        var byDay: List<Int>? = null

        val nthMatch = RE_NTH_WEEKDAY.find(schedulePart)
        if (nthMatch != null) {
            val n = nthMatch.groupValues[1].toIntOrNull()
            val dayName = nthMatch.groupValues[2].lowercase()
            val day = WEEKDAY_MAP[dayName]
            if (n != null && day != null) {
                freq = "monthly"
                nthWeekday = NthWeekday(n, day)
            }
        }
        if (nthWeekday == null) {
            val parts = schedulePart.split(",").map { it.trim().lowercase() }
            val matchedDays = parts.mapNotNull { WEEKDAY_MAP[it] }
            if (matchedDays.isNotEmpty()) {
                byDay = matchedDays
            } else {
                val intervalMatch = RE_INTERVAL.find(schedulePart) ?: return null
                interval = intervalMatch.groupValues[1].toIntOrNull() ?: 1
                val u = intervalMatch.groupValues[2].lowercase()
                freq = when {
                    u.startsWith("day") -> "daily"
                    u.startsWith("week") -> "weekly"
                    u.startsWith("month") -> "monthly"
                    u.startsWith("year") -> "yearly"
                    else -> return null
                }
            }
        }

        val time = timePart?.let { normaliseAmPmTime(it) }
        return RecurrenceRule(freq, interval, byDay, nthWeekday, time, modePart)
    }

    private fun normaliseAmPmTime(raw: String): String {
        val t = raw.lowercase()
        val isPm = "pm" in t
        val isAm = "am" in t
        val clean = t.replace(Regex("[ap]m"), "").trim()
        val parts = clean.split(":")
        var hh = parts[0].toIntOrNull() ?: 0
        val mm = parts.getOrNull(1)?.toIntOrNull() ?: 0
        if (isPm && hh in 1..11) hh += 12
        if (isAm && hh == 12) hh = 0
        return "${hh.toString().padStart(2, '0')}:${mm.toString().padStart(2, '0')}"
    }

    /* ---------- Calendar arithmetic (delegated to kotlinx-datetime) ---------- */

    /** Add whole months to a `YYYY-MM-DD` string, clamping the day via DatePeriod. */
    internal fun addMonthsString(base: String, months: Int): String = try {
        LocalDate.parse(base).plus(DatePeriod(months = months)).toString()
    } catch (_: Exception) { base }

    /** Add whole years to a `YYYY-MM-DD` string, clamping Feb-29 via DatePeriod. */
    internal fun addYearsString(base: String, years: Int): String = try {
        LocalDate.parse(base).plus(DatePeriod(years = years)).toString()
    } catch (_: Exception) { base }
}
