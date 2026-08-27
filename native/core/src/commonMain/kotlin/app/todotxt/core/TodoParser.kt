package app.todotxt.core

/** Common date helpers, resolved per platform (JVM uses java.time, JS uses the
 * browser `Date` API). Kept deliberately minimal so the parser core stays
 * framework-agnostic. */
expect fun todayString(): String

expect fun addDaysString(base: String, days: Int): String

/**
 * Field Notes Ritual todo.txt parser.
 *
 * Faithful port of `src/utils/todoParser.ts` + `src/lib/todoLineCompletion.ts`:
 *
 * - Checkbox marker `- [ ]` / `- [x]` (any single flag char in brackets; `x`/`X`
 *   means complete), and `x task` prefix style
 * - Priority `(A)`, projects `+project`, contexts `@context` (letter-first,
 *   lookbehind-style, so `me@work.com` and `+2kg` are NOT tokens)
 * - `due:` with `YYYY-MM-DD`, `today`/`tomorrow`/`yesterday`/`now`, optional
 *   `T`-time (`due:2026-08-16T14:30`) and `@`-relative forms (`due:today@17:00`)
 */
object TodoParser {

    private val RE_IS_DATE = Regex("""^\d{4}-\d{2}-\d{2}$""")
    private val RE_RELATIVE_DAYS = Regex("""([+-]\d+)d?""")
    private val RE_IS_TIME = Regex("""^\d{1,2}:\d{2}(:\d{2})?$""")
    private val RE_CHECKBOX_MARKER = Regex("""^-?\[[ xX]\]\s""")
    private val RE_CHECKED_MARKER = Regex("""^-?\[x\]\s""", RegexOption.IGNORE_CASE)
    private val RE_X_PREFIX = Regex("""^x\s""", RegexOption.IGNORE_CASE)
    private val RE_PRIORITY = Regex("""^\(([A-Z])\)\s""")

    /* Fix F8 spec compliance: projects and contexts must start with a letter.
     * Kotlin lookbehinds replicate the JS `(?<!\w)\+...` guards. */
    private val RE_PROJECTS = Regex("""(?<!\w)\+([A-Za-z][\w.-]*)""")
    private val RE_CONTEXTS = Regex("""(?<![\w.])@([A-Za-z][\w.-]*)""")

    /* Fix F7: `due:YYYY-MM-DDTHH:MM` hands the clock time to group 2; the
     * `@`-relative form keeps its time in group 4. */
    private val RE_DUE = Regex(
        """due:([^\sT@]+)(?:T(\d{1,2}:\d{2}(?::\d{2})?))?""" +
            """(?:@([A-Za-z][\w-]*))?(?:@(\d{1,2}:\d{2}(?::\d{2})?))?"""
    )
    private val RE_DUE_FALLBACK = Regex("""due:(\S+)""")
    private val RE_DUE_TIME_ONLY = Regex("""due:[T@](\d{1,2}:\d{2}(?::\d{2})?)""")

    fun today(): String = todayString()
    fun tomorrow(): String = addDaysString(today(), 1)
    fun yesterday(): String = addDaysString(today(), -1)

    /** Normalise `14:3`, `9:05`, or `14:30:00` into `HH:MM`. */
    fun normaliseTime(raw: String): String {
        val parts = raw.split(":")
        if (parts.size < 2) return raw
        val hh = parts[0].toIntOrNull()?.toString()?.padStart(2, '0') ?: return raw
        val mm = parts[1].toIntOrNull()?.toString()?.padStart(2, '0') ?: return raw
        return "$hh:$mm"
    }

    private fun parseRelativeDate(
        value: String,
        today: String,
        tomorrow: String,
        yesterday: String,
    ): String? = when {
        value == "today" || value == "now" -> today
        value == "tomorrow" -> tomorrow
        value == "yesterday" -> yesterday
        RE_IS_DATE.containsMatchIn(value) -> value
        // Relative offsets like +7d / -3d (also bare +7 / -3), as suggested by Quick Add.
        else -> RE_RELATIVE_DAYS.matchEntire(value)?.let { match ->
            addDaysString(today, match.groupValues[1].toInt())
        }
    }

    fun parseTodoLine(trimmed: String, id: Int = 0): Task {
        val hasCheckboxMarker = RE_CHECKBOX_MARKER.containsMatchIn(trimmed)
        val isChecked = hasCheckboxMarker && RE_CHECKED_MARKER.containsMatchIn(trimmed)
        val hasXPrefix = !hasCheckboxMarker && RE_X_PREFIX.containsMatchIn(trimmed)
        val cleanText = if (hasCheckboxMarker) {
            RE_CHECKBOX_MARKER.replaceFirst(trimmed, "")
        } else {
            trimmed
        }
        val completed = isChecked || hasXPrefix
        var task = Task(
            id = id,
            text = cleanText,
            raw = trimmed,
            completed = completed,
        )

        if (cleanText.startsWith("(")) {
            RE_PRIORITY.find(cleanText)?.groupValues?.getOrNull(1)?.takeIf { it.isNotBlank() }
                ?.let { task = task.copy(priority = it) }
        }
        if (cleanText.contains('+')) {
            task = task.copy(projects = RE_PROJECTS.findAll(cleanText)
                .map { it.groupValues[1] }.toSet().toList())
        }
        if (cleanText.contains('@')) {
            task = task.copy(contexts = RE_CONTEXTS.findAll(cleanText)
                .map { it.groupValues[1] }.toSet().toList())
        }
        if (cleanText.contains("due:")) {
            val dueMatch = RE_DUE.find(cleanText)
            if (dueMatch != null) {
                val value = dueMatch.groupValues[1].lowercase()
                val timeRaw = dueMatch.groupValues[2].ifBlank { dueMatch.groupValues[4] }
                val today = today()
                val tomorrow = tomorrow()
                val yesterday = yesterday()
                val due = parseRelativeDate(value, today, tomorrow, yesterday)
                if (due != null) {
                    task = task.copy(due = due)
                    if (timeRaw.isNotBlank() && RE_IS_TIME.containsMatchIn(timeRaw)) {
                        task = task.copy(dueTime = normaliseTime(timeRaw))
                    } else if (value == "now" && timeRaw.isNotBlank()) {
                        task = task.copy(dueTime = normaliseTime(timeRaw))
                    }
                } else if (RE_IS_TIME.containsMatchIn(value)) {
                    task = task.copy(due = today, dueTime = normaliseTime(value))
                }
            }
            if (task.due == null) {
                RE_DUE_FALLBACK.find(cleanText)?.groupValues?.get(1)
                    ?.lowercase()?.trimEnd(',', ';')?.takeIf { RE_IS_TIME.containsMatchIn(it) }
                    ?.let { task = task.copy(due = today(), dueTime = normaliseTime(it)) }
            }
        }
        // `due:T15:30` / `due:@15:30` — time-only relative forms: `T` and `@`
        // followed directly by a clock time (group 1 of RE_DUE is empty there).
        if (task.due == null) {
            RE_DUE_TIME_ONLY.find(cleanText)?.groupValues?.getOrNull(1)
                ?.takeIf { RE_IS_TIME.containsMatchIn(it) }
                ?.let { task = task.copy(due = today(), dueTime = normaliseTime(it)) }
        }
        return task
    }

    /** Parse a full todo.txt document into [ParsedTodoContent]. */
    fun parseTodoContent(content: String): ParsedTodoContent {
        val tasks = content.split("\n")
            .mapIndexed { index, line -> parseTodoLine(line, index) }
            .filter { it.text.isNotBlank() }
        val active = tasks.filter { !it.completed }
        return ParsedTodoContent(
            tasks = tasks,
            priorities = active.groupBy { it.priority ?: "" },
            projects = active.flatMap { it.projects }.distinct()
                .associateWith { project -> active.filter { project in it.projects } },
            contexts = active.flatMap { it.contexts }.distinct()
                .associateWith { context -> active.filter { context in it.contexts } },
            dueDates = active.filter { it.due != null }
                .groupBy({ it.due!! }, { it }),
            completedCount = tasks.count { it.completed },
        )
    }

    /**
     * Rewrite the line at `lineIndex` so it is marked complete (or undone).
     * Port of `setLineCompleted` — used by native notification actions.
     */
    /**
     * Rewrite the line carrying [task] so it is marked complete (or undone),
     * resolving the line by matching the task's raw text against the *current*
     * document. Unlike [setLineCompleted] (which trusts a line index), this
     * survives reorders, insertions, and deletions that happened after the
     * task was parsed — important for UI flows that keep a stale [Task] around.
     */
    fun setTaskCompleted(content: String, task: Task, completed: Boolean): String {
        val lines = content.split("\n").toMutableList()
        val index = lines.indexOfFirst { it.trim() == task.raw.trim() }
        if (index < 0) return content
        return setLineCompleted(content, index, completed)
    }

    fun setLineCompleted(content: String, lineIndex: Int, completed: Boolean): String {
        val lines = content.split("\n").toMutableList()
        if (lineIndex < 0 || lineIndex >= lines.size) return content
        val line: String = lines[lineIndex]
        if (RE_CHECKBOX_MARKER.containsMatchIn(line)) {
            lines[lineIndex] = line.replace(Regex("""\[[ xX]\]"""), if (completed) "[x]" else "[ ]")
        } else if (RE_X_PREFIX.containsMatchIn(line)) {
            if (!completed) lines[lineIndex] = RE_X_PREFIX.replaceFirst(line, "")
        } else if (completed && line.isNotBlank()) {
            // Canonical todo.txt completion marker. Checkbox markers remain
            // supported above as an explicit app extension, but plain lines
            // must use the standard `x ` prefix when marked complete.
            lines[lineIndex] = "x ${line.trim()}"
        }
        return lines.joinToString("\n")
    }
}
