package app.todotxt.core

/** Field Notes Ritual: lightweight, local-date helpers for daily habit rhythm. */
object HabitUtils {

    fun formatLocalDate(date: String): String = date

    fun today(): String = todayString()

    /** The last [count] dates, oldest first, like the web `getLastDays`. */
    fun getLastDays(count: Int): List<String> {
        val today = todayString()
        return (count - 1 downTo 0).map { addDaysString(today, -it) }
    }

    fun isHabitCompleteOn(habit: Habit, date: String): Boolean =
        habit.completedDates.contains(date)

    /**
     * Current streak: walk backwards from today (or yesterday if today is
     * incomplete) counting consecutive completed days.
     */
    fun getHabitStreak(habit: Habit): Int {
        val completed: Set<String> = habit.completedDates.toSet()
        var cursor = todayString()
        if (!completed.contains(cursor)) cursor = addDaysString(cursor, -1)
        var streak = 0
        while (completed.contains(cursor)) {
            streak += 1
            cursor = addDaysString(cursor, -1)
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
        var previous: String? = null
        for (date in dates) {
            current = if (previous == null) {
                1
            } else if (daysBetween(previous, date) == 1) {
                current + 1
            } else {
                1
            }
            if (current > best) best = current
            previous = date
        }
        return best
    }

    /** Completion rate over the last [days] days, as a 0..100 percentage. */
    fun getCompletionRate(habit: Habit, days: Int = 28): Int {
        val dates = getLastDays(days)
        val hits = dates.count { habit.completedDates.contains(it) }
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
            names[dayOfWeek(date)] to habit.completedDates.contains(date)
        }
    }

    /**
     * Heatmap grid: 12 weeks x 7 days (rows), oldest column first, matching
     * the web habits heatmap orientation. Each cell is the ISO date string
     * or null for future dates (they stay empty).
     */
    fun getHeatmap(habit: Habit, weeks: Int = 12): List<List<String?>> {
        val today = todayString()
        val start = addDaysString(today, -(weeks * 7 - 1))
        val completed = habit.completedDates.toSet()
        return (0 until weeks).map { week: Int ->
            (0 until 7).map { day: Int ->
                val date = addDaysString(start, week * 7 + day)
                if (date > today) null else date
            }
        }
    }

    fun toggleDate(habit: Habit, date: String): Habit {
        val dates = habit.completedDates.toMutableList()
        if (dates.contains(date)) dates.remove(date) else dates.add(date)
        return habit.copy(completedDates = dates, updatedAt = currentTimeMillis())
    }
}

/** Days between two ISO date strings (a <= b); works in pure string math. */
internal fun daysBetween(a: String, b: String): Int {
    fun julian(date: String): Int {
        val parts = date.split("-")
        val year = parts[0].toInt()
        val month = parts[1].toInt()
        val day = parts[2].toInt()
        // Rata Die day number (simplified)
        val y = year - if (month <= 2) 1 else 0
        val m = (month + 9) % 12
        val c = y / 100
        val yy = y % 100
        return 365 * y + yy / 4 - c / 4 + c * 3652425 / 10000 +
            (m * 979 + 29) / 30 + day
    }
    return julian(b) - julian(a)
}

/** 0 = Monday .. 6 = Sunday, derived from the ISO date string. */
internal fun dayOfWeek(isoDate: String): Int {
    val parts = isoDate.split("-")
    val year = parts[0].toInt()
    val month = parts[1].toInt()
    val day = parts[2].toInt()
    val m = if (month <= 2) month + 12 else month
    val y = if (month <= 2) year - 1 else year
    val k = y % 100
    val j = y / 100
    // Zeller's congruence gives 0=Saturday..6=Friday; shift to Mon..Sun
    val zeller = (day + (26 * (m + 1)) / 10 + k + k / 4 + j / 4 + 5 * j) % 7
    return (zeller + 5) % 7
}
