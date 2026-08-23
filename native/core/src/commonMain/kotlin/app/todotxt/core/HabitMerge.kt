package app.todotxt.core

/**
 * Canonical habit merge used by every sync path (P2P WebSocket, Firebase,
 * and the JS exports). Semantics:
 *
 *  - Winner per habit id = newer [Habit.updatedAt] (remote wins ties).
 *  - `completedDates` are additive facts: always a sorted distinct union
 *    of BOTH sides, so no completion is ever lost to an older edit.
 *  - Resulting `updatedAt` = max of both sides.
 */
object HabitMerge {

    fun merge(local: List<Habit>, remote: List<Habit>): List<Habit> {
        val merged = LinkedHashMap<String, Habit>()
        local.forEach { merged[it.id] = it }
        remote.forEach { incoming ->
            val existing = merged[incoming.id]
            merged[incoming.id] = if (existing == null) {
                incoming
            } else {
                combine(existing, incoming)
            }
        }
        return merged.values.toList()
    }

    private fun combine(existing: Habit, incoming: Habit): Habit {
        val winner = if (incoming.updatedAt >= existing.updatedAt) incoming else existing
        return winner.copy(
            completedDates = (existing.completedDates + incoming.completedDates).distinct().sorted(),
            updatedAt = maxOf(existing.updatedAt, incoming.updatedAt),
        )
    }
}
