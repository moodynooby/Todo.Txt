package app.todotxt.core

import kotlinx.serialization.Serializable

/**
 * One line of the todo.txt document, parsed into structured fields.
 * Mirrors `src/types/todo.ts` and the grammar in `src/utils/todoParser.ts`.
 */
@Serializable
data class Task(
    val id: Int,
    val text: String,
    val raw: String,
    val completed: Boolean,
    val priority: String? = null,
    val projects: List<String> = emptyList(),
    val contexts: List<String> = emptyList(),
    val due: String? = null,
    val dueTime: String? = null,
)

/** Aggregates produced by [parseTodoContent] from a whole todo.txt document. */
@Serializable
data class ParsedTodoContent(
    val tasks: List<Task>,
    val priorities: Map<String, List<Task>> = emptyMap(),
    val projects: Map<String, List<Task>> = emptyMap(),
    val contexts: Map<String, List<Task>> = emptyMap(),
    val dueDates: Map<String, List<Task>> = emptyMap(),
    val completedCount: Int = 0,
)

enum class FilterType { PRIORITY, PROJECT, CONTEXT, DUE, COMPLETION }

data class Filter(val type: FilterType, val value: String)

/** Field Notes Ritual habit record. Mirrors `src/types/habits.ts`. */
@Serializable
data class Habit(
    val id: String,
    val name: String,
    val color: HabitColor,
    val reminderEnabled: Boolean = false,
    val reminderTime: String = "09:00",
    val completedDates: List<String> = emptyList(),
    val archived: Boolean = false,
    val createdAt: Long = 0L,
    val updatedAt: Long = 0L,
)

/** M3-friendly habit accent color, mirroring HABIT_COLORS. */
@Serializable
enum class HabitColor(val hex: String, val red: Int, val green: Int, val blue: Int) {
    EVERGREEN("#2f6f61", 47, 111, 97),
    TERRACOTTA("#d9784f", 217, 120, 79),
    MOSS("#748f6c", 116, 143, 108),
    CLAY("#9f6a4d", 159, 106, 77),
    SLATE("#536d8d", 83, 109, 141),
    LILAC("#9a7fbd", 154, 127, 189);

    companion object {
        val DEFAULTS = entries.toList()
    }
}

/** Note card record. Mirrors `src/types/notes.ts`. */
@Serializable
data class Note(
    val id: String,
    val title: String,
    val content: String,
    val color: NoteColor,
    val pinned: Boolean = false,
    val archived: Boolean = false,
    val createdAt: Long = 0L,
    val updatedAt: Long = 0L,
)

@Serializable
enum class NoteColor(val hex: String) {
    LEMON("#fff475"),
    MINT("#a7ffeb"),
    ICE("#cbf0f8"),
    LILAC("#d7aefb"),
    ROSE("#fdcfe8"),
    SKY("#c2e7ff"),
}

/** Floating stopwatch/pomodoro timer. Mirrors the web `TimerState` shape. */
@Serializable
data class TimerState(
    val id: String = "default",
    val title: String? = null,
    val elapsed: Long = 0L,
    val isActive: Boolean = false,
    val startedAt: Long? = null,
    val durationMs: Long = 0L,
    val createdAt: Long = 0L,
)

/** User-entered GROQ AI settings (stored at settings/groq on the web). */
@Serializable
data class GroqSettings(
    val apiKey: String? = null,
    val model: String = "llama-3.3-70b-versatile",
)

/** Vector drawing sketch. Mirrors the Excalidraw scene persistence. */
@Serializable
data class Drawing(
    val id: String,
    val name: String,
    val strokes: List<DrawingStroke> = emptyList(),
    val createdAt: Long = 0L,
)

@Serializable
data class DrawingStroke(
    val points: List<DrawingPoint>,
    val colorHex: String,
    val thickness: Float,
    /** Shape semantics shared by both platforms: pen, line, rect, circle,
     *  triangle, arrow. Legacy strokes without one render as pen. */
    val tool: String? = null,
)

@Serializable
data class DrawingPoint(val x: Float, val y: Float)
