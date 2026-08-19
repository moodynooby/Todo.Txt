package app.todotxt.core

import kotlinx.serialization.encodeToString
import kotlinx.serialization.json.Json

/**
 * JS entry point — exports core functions as a module usable from TypeScript.
 *
 * Usage from JS/TS:
 *   import { parseTodoContent, parseHabits, HabitUtils } from '@todotxt/core'
 */

// JSON instance for serialization
private val json = Json { ignoreUnknownKeys = true }

// --- Todo parsing ---

fun parseTodoContentJs(raw: String): String {
    val parsed = TodoParser.parseTodoContent(raw)
    return json.encodeToString(parsed)
}

// --- Habit utils ---

fun streakForHabitJs(habitJson: String): String {
    val habit = json.decodeFromString<Habit>(habitJson)
    val streak = HabitUtils.getHabitStreak(habit)
    return streak.toString()
}

fun momentumForHabitJs(habitJson: String): String {
    val habit = json.decodeFromString<Habit>(habitJson)
    val momentum = HabitUtils.getMomentum(habit)
    // Convert List<Pair<String, Boolean>> to JSON array
    return json.encodeToString(momentum.map { listOf(it.first, it.second) })
}

fun heatmapForHabitJs(habitJson: String): String {
    val habit = json.decodeFromString<Habit>(habitJson)
    val heatmap = HabitUtils.getHeatmap(habit)
    return json.encodeToString(heatmap)
}

fun toggleHabitDateJs(habitJson: String, date: String): String {
    val habit = json.decodeFromString<Habit>(habitJson)
    val toggled = HabitUtils.toggleDate(habit, date)
    return json.encodeToString(toggled)
}

// --- LWW Merge ---

fun mergeHabitsJs(localJson: String, remoteJson: String): String {
    val local = json.decodeFromString<List<Habit>>(localJson)
    val remote = json.decodeFromString<List<Habit>>(remoteJson)
    val map = mutableMapOf<String, Habit>()
    for (h in local) {
        map[h.id] = h
    }
    for (h in remote) {
        val existing = map[h.id]
        if (existing == null || h.updatedAt > existing.updatedAt) {
            // LWW: remote wins if newer
            map[h.id] = h
        } else {
            // Local is newer — but merge completedDates (union)
            val mergedDates = (existing.completedDates + h.completedDates).distinct()
            map[h.id] = existing.copy(completedDates = mergedDates.sorted())
        }
    }
    return json.encodeToString(map.values.toList())
}

// --- Main for nodejs executable ---

fun main() {
    println("TodoTxt Core JS module loaded")
    println("Exports: parseTodoContentJs, streakForHabitJs, momentumForHabitJs, heatmapForHabitJs, mergeHabitsJs")
}
