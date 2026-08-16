package app.todotxt.persistence

import app.todotxt.domain.GroqSettings
import app.todotxt.domain.Habit
import app.todotxt.domain.Note
import app.todotxt.domain.TimerState
import kotlinx.coroutines.CoroutineScope
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.IO
import kotlinx.coroutines.SupervisorJob
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.launch
import kotlinx.serialization.encodeToString
import kotlinx.serialization.json.Json

/**
 * Local-first persistence. Mirrors the web architecture where the document
 * content is authoritative and backups mirror it: every workspace keeps a
 * plain-text/JSON store on disk that is the single source of truth.
 */

object Storage {

    private val json = Json {
        ignoreUnknownKeys = true
        encodeDefaults = true
        prettyPrint = false
    }

    private val scope = CoroutineScope(SupervisorJob() + Dispatchers.IO)

    // In-memory authoritative state, populated from disk at launch.
    private val _content = MutableStateFlow("")
    val content: StateFlow<String> = _content.asStateFlow()

    private val _notes = MutableStateFlow(emptyList<Note>())
    val notes: StateFlow<List<Note>> = _notes.asStateFlow()

    private val _habits = MutableStateFlow(emptyList<Habit>())
    val habits: StateFlow<List<Habit>> = _habits.asStateFlow()

    private val _timers = MutableStateFlow<TimerState?>(null)
    val timers: StateFlow<TimerState?> = _timers.asStateFlow()

    private val _groq = MutableStateFlow(GroqSettings())
    val groq: StateFlow<GroqSettings> = _groq.asStateFlow()

    fun load() {
        scope.launch {
            _content.value = PlatformStorage.readString("todo.txt") ?: ""
            _notes.value = readNotesFile()
            _habits.value = readHabitsFile()
            _timers.value = readTimersFile()
            _groq.value = readGroqFile()
        }
    }

    fun setContent(value: String) {
        _content.value = value
        scope.launch { PlatformStorage.writeString("todo.txt", value) }
    }

    fun updateNotes(transform: (List<Note>) -> List<Note>) {
        _notes.value = transform(_notes.value)
        scope.launch {
            PlatformStorage.writeString("notes.json", json.encodeToString(_notes.value))
        }
    }

    fun updateHabits(transform: (List<Habit>) -> List<Habit>) {
        _habits.value = transform(_habits.value)
        scope.launch {
            PlatformStorage.writeString("habits.json", json.encodeToString(_habits.value))
        }
    }

    fun updateTimer(value: TimerState?) {
        _timers.value = value
        scope.launch {
            val raw = if (value == null) "null" else json.encodeToString(value)
            PlatformStorage.writeString("timer.json", raw)
        }
    }

    fun updateGroq(transform: (GroqSettings) -> GroqSettings) {
        _groq.value = transform(_groq.value)
        scope.launch {
            PlatformStorage.writeString("groq.json", json.encodeToString(_groq.value))
        }
    }

    private fun readNotesFile(): List<Note> = runCatching {
        PlatformStorage.readString("notes.json")?.takeIf { it.isNotBlank() }
            ?.let { json.decodeFromString<List<Note>>(it) } ?: emptyList()
    }.getOrDefault(emptyList())

    private fun readHabitsFile(): List<Habit> = runCatching {
        PlatformStorage.readString("habits.json")?.takeIf { it.isNotBlank() }
            ?.let { json.decodeFromString<List<Habit>>(it) } ?: emptyList()
    }.getOrDefault(emptyList())

    private fun readTimersFile(): TimerState? = runCatching {
        PlatformStorage.readString("timer.json")?.takeIf { it.isNotBlank() && it != "null" }
            ?.let { json.decodeFromString<TimerState>(it) }
    }.getOrDefault(null)

    private fun readGroqFile(): GroqSettings = runCatching {
        PlatformStorage.readString("groq.json")?.takeIf { it.isNotBlank() }
            ?.let { json.decodeFromString<GroqSettings>(it) } ?: GroqSettings()
    }.getOrDefault(GroqSettings())
}

expect object PlatformStorage {
    fun readString(name: String): String?
    fun writeString(name: String, value: String)
}
