package app.todotxt.core

import kotlin.js.JsExport
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

@JsExport
fun parseTodoContentJs(raw: String): String {
    val parsed = TodoParser.parseTodoContent(raw)
    return json.encodeToString(parsed)
}

// --- Habit utils ---

@JsExport
fun streakForHabitJs(habitJson: String): String {
    val habit = json.decodeFromString<Habit>(habitJson)
    val streak = HabitUtils.getHabitStreak(habit)
    return streak.toString()
}

@JsExport
fun momentumForHabitJs(habitJson: String): String {
    val habit = json.decodeFromString<Habit>(habitJson)
    val momentum = HabitUtils.getMomentum(habit)
    // Convert List<Pair<String, Boolean>> to JSON array
    return json.encodeToString(momentum.map { listOf(it.first, it.second) })
}

@JsExport
fun heatmapForHabitJs(habitJson: String): String {
    val habit = json.decodeFromString<Habit>(habitJson)
    val heatmap = HabitUtils.getHeatmap(habit)
    return json.encodeToString(heatmap)
}

@JsExport
fun toggleHabitDateJs(habitJson: String, date: String): String {
    val habit = json.decodeFromString<Habit>(habitJson)
    val toggled = HabitUtils.toggleDate(habit, date)
    return json.encodeToString(toggled)
}

// --- LWW Merge ---

@JsExport
fun mergeHabitsJs(localJson: String, remoteJson: String): String {
    val local = json.decodeFromString<List<Habit>>(localJson)
    val remote = json.decodeFromString<List<Habit>>(remoteJson)
    return json.encodeToString(HabitMerge.merge(local, remote))
}

// --- Shared widget projection ---

/**
 * Computes the shared home-screen-widget payload (same JSON contract as
 * `widget_data.json` in the Tauri shell) from serialized tasks + habits.
 */
@JsExport
fun widgetPayloadJs(tasksJson: String, habitsJson: String): String {
    val tasks = json.decodeFromString<List<Task>>(tasksJson)
    val habits = json.decodeFromString<List<Habit>>(habitsJson)
    return json.encodeToString(WidgetData.project(tasks, habits))
}

// --- Main for nodejs executable ---

fun main() {
    println("TodoTxt Core JS module loaded")
    println("Exports: parseTodoContentJs, streakForHabitJs, momentumForHabitJs, heatmapForHabitJs, mergeHabitsJs")
}
