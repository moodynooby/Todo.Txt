package app.todotxt.core

import java.time.LocalDate
import java.time.format.DateTimeFormatter

/** Field Notes Ritual: lightweight, local-date helpers for daily habit rhythm. */
object HabitUtils {

    fun formatLocalDate(date: LocalDate): String =
        date.format(DateTimeFormatter.ISO_LOCAL_DATE)

    fun todayString(): String = formatLocalDate(LocalDate.now())

    /** The last [count] dates, oldest first, like `getLastDays`. */
    fun getLastDays(count: Int): List<String> =
        (count - 1 downTo 0).map { index: Int ->
            LocalDate.now().minusDays(index.toLong())
        }.map { date: LocalDate -> formatLocalDate(date) }

    fun isHabitCompleteOn(habit: Habit, date: String): Boolean =
        date in habit.completedDates

    /**
     * Current streak: walk backwards from today (or yesterday if today is
     * incomplete) counting consecutive completed days.
     */
    fun getHabitStreak(habit: Habit): Int {
        val completed: Set<String> = habit.completedDates.toSet()
        var cursor = LocalDate.now()
        if (!completed.contains(formatLocalDate(cursor))) cursor = cursor.minusDays(1)
        var streak = 0
        while (completed.contains(formatLocalDate(cursor))) {
            streak += 1
            cursor = cursor.minusDays(1)
        }
        return streak
    }

    /**
     * Longest consecutive completed-day run ever recorded. Walks the sorted
     * completed dates forward, counting runs separated by exactly one day.
     */
    fun getBestStreak(habit: Habit): Int {
        val dates = habit.completedDates.sorted()
        var best = 0
        var current = 0
        var previous: LocalDate? = null
        for (date in dates) {
            val parsed = LocalDate.parse(date)
            current = if (previous == null) {
                1
            } else if (java.time.temporal.ChronoUnit.DAYS.between(previous, parsed) == 1L) {
                current + 1
            } else {
                1
            }
            if (current > best) best = current
            previous = parsed
        }
        return best
    }

    /** Completion rate over the last [days] days, as a 0..100 percentage. */
    fun getCompletionRate(habit: Habit, days: Int = 28): Int {
        val dates = getLastDays(days)
        val hits = dates.count { it in habit.completedDates }
        return (hits.toDouble() / days * 100).toInt()
    }

    /**
     * Momentum view for the habit list: last 7 days with a per-day flag and
     * the weekday name, like the web `getMomentum` helper.
     */
    fun getMomentum(habit: Habit): List<Pair<String, Boolean>> {
        val days = getLastDays(7)
        val names = listOf("Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun")
        return days.mapIndexed { index, date ->
            val name = names[LocalDate.parse(date).dayOfWeek.value - 1]
            name to (date in habit.completedDates)
        }
    }

    /**
     * Heatmap grid: 12 weeks x 7 days (rows), oldest column first, matching
     * the web habits heatmap orientation. Each cell is the ISO date string
     * or null for future dates (they stay empty).
     */
    fun getHeatmap(habit: Habit, weeks: Int = 12): List<List<String?>> {
        val today = LocalDate.now()
        val start = today.minusDays((weeks * 7 - 1).toLong())
        val completed = habit.completedDates.toSet()
        return (0 until weeks).map { week: Int ->
            (0 until 7).map { day: Int ->
                val date = start.plusDays((week * 7 + day).toLong())
                if (date.isAfter(today)) null else formatLocalDate(date)
            }
        }
    }

    fun toggleDate(habit: Habit, date: String): Habit {
        val dates = habit.completedDates.toMutableList()
        if (dates.contains(date)) dates.remove(date) else dates.add(date)
        return habit.copy(completedDates = dates, updatedAt = System.currentTimeMillis())
    }
}
