package net.todotxt.app.plugins.widgetdata

import android.content.Context
import org.json.JSONArray
import org.json.JSONObject
import java.io.File

/**
 * Mirrors the JS `WidgetPayload` projection from `widgetDataBridge.ts`.
 * Kept as plain POJOs with JSON serialization so both the Kotlin plugin
 * (writer) and the `AppWidgetProvider`s (readers) share exactly one
 * format without any extra library dependency.
 */
data class WidgetTask(
    val id: Long,
    val text: String,
    val done: Boolean,
    val due: String? = null,
)

data class WidgetHabit(
    val id: String,
    val name: String,
    val color: String,
    val streak: Int,
    val bestStreak: Int,
    val rate28: Int,
    val last30: List<Boolean>,
    val last7: List<Boolean>,
    val completedToday: Boolean,
    val reminderTime: String? = null,
)

data class WidgetPayload(
    val date: String,
    val tasks: List<WidgetTask>,
    val habits: List<WidgetHabit>,
)

/**
 * JSON file store under the app's files directory (`widget_data.json`).
 * The file is rewritten atomically on every push; widget providers read
 * it synchronously on demand (the payload is a few KB at most).
 */
internal class WidgetDataStore(context: Context) {

    private val file: File = File(context.filesDir, FILE_NAME)

    fun write(payload: WidgetPayload) {
        synchronized(this) {
            val json = JSONObject().apply {
                put("date", payload.date)
                put("tasks", JSONArray().apply {
                    payload.tasks.forEach { task ->
                        put(JSONObject().apply {
                            put("id", task.id)
                            put("text", task.text)
                            put("done", task.done)
                            task.due?.let { put("due", it) }
                        })
                    }
                })
                put("habits", JSONArray().apply {
                    payload.habits.forEach { habit ->
                        put(JSONObject().apply {
                            put("id", habit.id)
                            put("name", habit.name)
                            put("color", habit.color)
                            put("streak", habit.streak)
                            put("bestStreak", habit.bestStreak)
                            put("rate28", habit.rate28)
                            put("last30", JSONArray().apply {
                                habit.last30.forEach { put(it) }
                            })
                            put("last7", JSONArray().apply {
                                habit.last7.forEach { put(it) }
                            })
                            put("completedToday", habit.completedToday)
                            habit.reminderTime?.let { put("reminderTime", it) }
                        })
                    }
                })
            }
            val temp = File(file.parentFile, "$FILE_NAME.tmp")
            temp.writeText(json.toString())
            temp.renameTo(file)
        }
    }

    fun read(): WidgetPayload {
        synchronized(this) {
            if (!file.exists()) return emptyPayload()
            val root = JSONObject(file.readText())
            return WidgetPayload(
                date = root.optString("date", ""),
                tasks = root.optJSONArray("tasks")?.toList {
                    WidgetTask(
                        id = it.optLong("id"),
                        text = it.optString("text", ""),
                        done = it.optBoolean("done"),
                        due = if (it.has("due")) it.optString("due") else null,
                    )
                } ?: emptyList(),
                habits = root.optJSONArray("habits")?.toList {
                    WidgetHabit(
                        id = it.optString("id", ""),
                        name = it.optString("name", ""),
                        color = it.optString("color", "#888888"),
                        streak = it.optInt("streak"),
                        bestStreak = it.optInt("bestStreak"),
                        rate28 = it.optInt("rate28"),
                        last30 = it.optJSONArray("last30")?.toBoolList() ?: emptyList(),
                        last7 = it.optJSONArray("last7")?.toBoolList() ?: emptyList(),
                        completedToday = it.optBoolean("completedToday"),
                        reminderTime = if (it.has("reminderTime")) it.optString("reminderTime") else null,
                    )
                } ?: emptyList(),
            )
        }
    }

    private fun JSONObject.toBoolList(): List<Boolean> =
        (0 until length()).map { optBoolean(it) }

    private inline fun <T> JSONArray.toList(transform: (JSONObject) -> T): List<T> =
        (0 until length()).map { transform(optJSONObject(it)) }

    companion object {
        private const val FILE_NAME = "widget_data.json"

        fun emptyPayload(): WidgetPayload =
            WidgetPayload(date = "", tasks = emptyList(), habits = emptyList())
    }
}
