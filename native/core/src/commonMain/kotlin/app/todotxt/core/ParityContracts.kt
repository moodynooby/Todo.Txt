package app.todotxt.core

/** Explicit capability state used instead of silent platform no-ops. */
sealed class PlatformCapability {
    data object Supported : PlatformCapability()
    data class Adapted(val explanation: String) : PlatformCapability()
    data class Unavailable(val explanation: String) : PlatformCapability()
}

/** Pure timer transitions shared by every UI surface. */
object TimerRuntime {
    fun elapsedAt(timer: TimerState, nowMillis: Long): Long {
        if (!timer.isActive || timer.startedAt == null) return timer.elapsed.coerceAtLeast(0L)
        return (timer.elapsed + (nowMillis - timer.startedAt).coerceAtLeast(0L)).coerceAtLeast(0L)
    }

    fun remainingAt(timer: TimerState, nowMillis: Long): Long? {
        if (timer.durationMs <= 0L) return null
        return (timer.durationMs - elapsedAt(timer, nowMillis)).coerceAtLeast(0L)
    }

    fun start(timer: TimerState, nowMillis: Long): TimerState =
        if (timer.isActive) timer else timer.copy(isActive = true, startedAt = nowMillis)

    fun pause(timer: TimerState, nowMillis: Long): TimerState =
        if (!timer.isActive) timer
        else timer.copy(
            isActive = false,
            elapsed = elapsedAt(timer, nowMillis),
            startedAt = null,
        )

    fun reset(timer: TimerState): TimerState = timer.copy(
        elapsed = 0L,
        isActive = false,
        startedAt = null,
    )

    fun advance(timer: TimerState, nowMillis: Long): TimerState {
        val remaining = remainingAt(timer, nowMillis) ?: return timer
        return if (timer.isActive && remaining <= 0L) {
            timer.copy(isActive = false, elapsed = timer.durationMs, startedAt = null)
        } else {
            timer
        }
    }
}

/** WCAG-oriented color helpers that operate on actual runtime surfaces. */
object DynamicContrast {
    private val hexPattern = Regex("^[0-9a-fA-F]+$")

    fun parseRgb(hex: String): Triple<Int, Int, Int>? {
        val value = hex.trim().removePrefix("#")
        if (!hexPattern.matches(value)) return null
        val expanded = when (value.length) {
            3 -> value.map { "$it$it" }.joinToString("")
            6 -> value
            8 -> value.takeLast(6)
            else -> return null
        }
        return Triple(
            expanded.substring(0, 2).toIntOrNull(16) ?: return null,
            expanded.substring(2, 4).toIntOrNull(16) ?: return null,
            expanded.substring(4, 6).toIntOrNull(16) ?: return null,
        )
    }

    fun relativeLuminance(hex: String): Double? {
        val rgb = parseRgb(hex) ?: return null
        fun channel(value: Int): Double {
            val normalized = value / 255.0
            return if (normalized <= 0.03928) normalized / 12.92
            else ((normalized + 0.055) / 1.055).let { it * it * it }
        }
        return 0.2126 * channel(rgb.first) +
            0.7152 * channel(rgb.second) +
            0.0722 * channel(rgb.third)
    }

    fun contrastRatio(first: String, second: String): Double? {
        val firstLum = relativeLuminance(first) ?: return null
        val secondLum = relativeLuminance(second) ?: return null
        val lighter = maxOf(firstLum, secondLum)
        val darker = minOf(firstLum, secondLum)
        return (lighter + 0.05) / (darker + 0.05)
    }

    fun chooseForeground(
        background: String,
        darkCandidate: String = "#111827",
        lightCandidate: String = "#FFFFFF",
    ): String {
        val darkRatio = contrastRatio(background, darkCandidate)
        val lightRatio = contrastRatio(background, lightCandidate)
        return when {
            darkRatio == null && lightRatio == null -> darkCandidate
            lightRatio == null -> darkCandidate
            darkRatio == null -> lightCandidate
            lightRatio >= darkRatio -> lightCandidate
            else -> darkCandidate
        }
    }
}

/** Shared AI tool metadata used by native and legacy web adapters. */
data class AiToolSpec(
    val id: String,
    val label: String,
    val instruction: String,
    val localOnly: Boolean = false,
    val destructive: Boolean = false,
)

object SharedAiTools {
    val all = listOf(
        AiToolSpec("shorten", "Shorten", "Make each task concise while preserving its meaning."),
        AiToolSpec("reduce", "Reduce", "Remove duplicates and non-essential tasks without inventing replacements."),
        AiToolSpec("reformat", "Reformat", "Normalize priorities, projects, contexts, and due: metadata without changing task meaning."),
        AiToolSpec("reorganize", "Reorganize", "Group tasks by priority and project while preserving every task."),
        AiToolSpec("cleanup", "Cleanup Done", "Remove completed tasks.", localOnly = true, destructive = true),
        AiToolSpec("grammar", "Fix Grammar", "Fix spelling and grammar in task text without changing metadata."),
    )
}

data class TodoValidation(
    val valid: Boolean,
    val normalized: String,
    val error: String? = null,
)

/** Conservative full-document guard for AI/import results. */
object TodoDocumentValidator {
    fun validate(raw: String): TodoValidation {
        val normalized = raw.replace("\r\n", "\n").trim()
        if (normalized.isBlank()) return TodoValidation(false, normalized, "The result is empty.")
        if (normalized.contains("```")) {
            return TodoValidation(false, normalized, "Markdown code fences are not valid Todo.Txt output.")
        }
        val lines = normalized.split('\n')
        if (lines.any { it.trimStart().startsWith("#") }) {
            return TodoValidation(false, normalized, "Markdown headings are not valid Todo.Txt output.")
        }
        val parsed = TodoParser.parseTodoContent(normalized)
        if (parsed.tasks.size != lines.count { it.isNotBlank() }) {
            return TodoValidation(false, normalized, "At least one output line could not be interpreted as a task.")
        }
        return TodoValidation(true, normalized)
    }
}
