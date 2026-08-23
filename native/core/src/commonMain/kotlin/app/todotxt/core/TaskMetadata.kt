package app.todotxt.core

import kotlinx.serialization.Serializable

/**
 * Dependency/recurrence metadata embedded in a todo line (`id:`, `after:`,
 * `blocks:`, `rec:` and natural-language "every ..." phrases). Kotlin port of
 * the web `advancedParser.ts` `parseTaskMetadata`, so web, native, and any
 * future surface share one grammar.
 */
@Serializable
data class TaskMetadata(
    val id: String? = null,
    val after: List<String> = emptyList(),
    val blocks: List<String> = emptyList(),
    /** Present when the line carries a recurrence phrase or bare `rec:` mode. */
    val recurrence: RecurrenceRuleDto? = null,
)

/** JSON-friendly recurrence rule mirroring the web `RecurrenceRule`. */
@Serializable
data class RecurrenceRuleDto(
    val freq: String,
    val interval: Int = 1,
    val byDay: List<Int>? = null,
    val nthWeekday: NthWeekdayDto? = null,
    val time: String? = null,
    val mode: String = "strict",
)

@Serializable
data class NthWeekdayDto(val n: Int, val day: Int)

object TaskMetadataParser {

    private val RE_ID = Regex("""\bid:([a-zA-Z0-9_-]+)""")
    private val RE_AFTER = Regex("""\bafter:([a-zA-Z0-9_,-]+)""")
    private val RE_BLOCKS = Regex("""\bblocks:([a-zA-Z0-9_,-]+)""")
    private val RE_MODE = Regex("""\brec:(strict|workdays|completion)""", RegexOption.IGNORE_CASE)

    fun parse(text: String): TaskMetadata {
        val id = RE_ID.find(text)?.groupValues?.get(1)
        val after = RE_AFTER.find(text)?.groupValues?.get(1)
            ?.split(",")?.map { it.trim() }?.filter { it.isNotEmpty() }
            ?: emptyList()
        val blocks = RE_BLOCKS.find(text)?.groupValues?.get(1)
            ?.split(",")?.map { it.trim() }?.filter { it.isNotEmpty() }
            ?: emptyList()

        val mode = RE_MODE.find(text)?.groupValues?.get(1)?.lowercase()
        val recurrence = if (text.contains("every")) {
            SchedulingParser.parseRecurringScheduleExpressionInternal(text)?.let { rule ->
                RecurrenceRuleDto(
                    freq = rule.freq,
                    interval = rule.interval,
                    byDay = rule.byDay,
                    nthWeekday = rule.nthWeekday?.let { NthWeekdayDto(it.n, it.day) },
                    time = rule.time,
                    mode = mode ?: rule.mode,
                )
            }
        } else if (mode != null) {
            RecurrenceRuleDto(freq = "weekly", interval = 1, mode = mode)
        } else {
            null
        }

        return TaskMetadata(id = id, after = after, blocks = blocks, recurrence = recurrence)
    }
}
