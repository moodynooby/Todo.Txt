package app.todotxt.core

import kotlin.js.JsExport
import kotlinx.serialization.encodeToString
import kotlinx.serialization.json.Json
import kotlinx.serialization.json.JsonPrimitive
import kotlinx.serialization.json.buildJsonObject
import kotlinx.serialization.json.put

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

/** Parse one todo.txt line (same grammar as [parseTodoContentJs]). */
@JsExport
fun parseTodoLineJs(raw: String, id: Int): String =
    json.encodeToString(TodoParser.parseTodoLine(raw.trim(), id))

// --- Scheduling / dependency metadata ---

/**
 * Natural-language scheduling phrase → JSON
 * `{kind:"relative",date,amount,unit}` | `{kind:"recurrence",rule}` |
 * `{kind:"error",message}`.
 */
@JsExport
fun parseSchedulingPhraseJs(text: String): String = when (val result =
    SchedulingParser.parseSchedulingPhrase(text)) {
    is SchedulingParser.ScheduleResult.Relative -> json.encodeToString(
        buildJsonObject {
            put("kind", "relative")
            put("date", result.relative.date)
            put("amount", result.relative.amount)
            put("unit", result.relative.unit)
        },
    )
    is SchedulingParser.ScheduleResult.Recurrence -> json.encodeToString(
        buildJsonObject {
            put("kind", "recurrence")
            put("rule", result.rule.toJson())
        }
    )
    is SchedulingParser.ScheduleResult.Error -> json.encodeToString(
        buildJsonObject {
            put("kind", "error")
            put("message", result.message)
        }
    )
}

/** Line-embedded dependency/recurrence metadata (`id:` `after:` `blocks:`). */
@JsExport
fun parseTaskMetadataJs(text: String): String =
    json.encodeToString(TaskMetadataParser.parse(text))

private fun SchedulingParser.RecurrenceRule.toJson() = buildJsonObject {
    put("freq", freq)
    put("interval", interval)
    byDay?.let { days -> put("byDay", kotlinx.serialization.json.JsonArray(days.map { JsonPrimitive(it) })) }
    nthWeekday?.let { nth ->
        put("nthWeekday", buildJsonObject {
            put("n", nth.n)
            put("day", nth.day)
        })
    }
    time?.let { put("time", it) }
    put("mode", mode)
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

/** Longest recorded consecutive-day run, as a decimal string. */
@JsExport
fun bestStreakForHabitJs(habitJson: String): String =
    HabitUtils.getBestStreak(json.decodeFromString<Habit>(habitJson)).toString()

/** Completion rate over the last [days] days (default 28), as a percentage string. */
@JsExport
fun completionRateForHabitJs(habitJson: String, days: Int): String =
    HabitUtils.getCompletionRate(json.decodeFromString<Habit>(habitJson), days).toString()

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
    println(
        "Exports: parseTodoContentJs, parseTodoLineJs, parseSchedulingPhraseJs, " +
            "parseTaskMetadataJs, streakForHabitJs, bestStreakForHabitJs, " +
            "completionRateForHabitJs, momentumForHabitJs, heatmapForHabitJs, " +
            "toggleHabitDateJs, mergeHabitsJs, widgetPayloadJs",
    )
}
