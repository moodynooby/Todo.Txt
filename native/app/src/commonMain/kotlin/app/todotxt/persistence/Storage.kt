package app.todotxt.persistence

import app.todotxt.domain.GroqSettings
import app.todotxt.domain.Habit
import app.todotxt.domain.Note
import app.todotxt.domain.Drawing
import app.todotxt.domain.TimerState
import app.todotxt.domain.TodoParser
import app.todotxt.service.DueReminderManager
import app.todotxt.service.ReminderManager
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

    private val _timers = MutableStateFlow<List<TimerState>>(emptyList())
    val timers: StateFlow<List<TimerState>> = _timers.asStateFlow()

    private val _groq = MutableStateFlow(GroqSettings())
    val groq: StateFlow<GroqSettings> = _groq.asStateFlow()

    private val _settings = MutableStateFlow(AppSettings())
    val settings: StateFlow<AppSettings> = _settings.asStateFlow()

    private val _drawings = MutableStateFlow(emptyList<Drawing>())
    val drawings: StateFlow<List<Drawing>> = _drawings.asStateFlow()

    fun load() {
        scope.launch {
            _content.value = PlatformStorage.readString("todo.txt") ?: ""
            _notes.value = readNotesFile()
            _habits.value = readHabitsFile()
            _timers.value = readTimersFile()
            _groq.value = readGroqFile()
            _settings.value = readSettingsFile()
            _drawings.value = readDrawingsFile()
            // Arm due-date reminders on launch so overdue tasks nudge
            // immediately (web: fire on every parse while the app is open).
            DueReminderManager.scheduleDueReminders(TodoParser.parseTodoContent(_content.value))
        }
    }

    fun setContent(value: String) {
        _content.value = value
        scope.launch { PlatformStorage.writeString("todo.txt", value) }
        // Due-date reminders (web `useDueRemindersNative` parity): re-arm on
        // every document change so the OS nudge reflects the latest content.
        DueReminderManager.scheduleDueReminders(TodoParser.parseTodoContent(value))
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
            ReminderManager.scheduleReminders(_habits.value)
        }
    }

    fun updateTimers(transform: (List<TimerState>) -> List<TimerState>) {
        _timers.value = transform(_timers.value)
        scope.launch {
            PlatformStorage.writeString("timer.json", json.encodeToString(_timers.value))
        }
    }

    fun updateGroq(transform: (GroqSettings) -> GroqSettings) {
        _groq.value = transform(_groq.value)
        scope.launch {
            PlatformStorage.writeString("groq.json", json.encodeToString(_groq.value))
        }
    }

    fun updateSettings(transform: (AppSettings) -> AppSettings) {
        _settings.value = transform(_settings.value)
        scope.launch {
            PlatformStorage.writeString("settings.json", json.encodeToString(_settings.value))
        }
    }

    fun updateDrawings(transform: (List<Drawing>) -> List<Drawing>) {
        _drawings.value = transform(_drawings.value)
        scope.launch {
            PlatformStorage.writeString("drawings.json", json.encodeToString(_drawings.value))
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

    private fun readTimersFile(): List<TimerState> = runCatching {
        PlatformStorage.readString("timer.json")?.takeIf { it.isNotBlank() && it != "null" }
            ?.let { json.decodeFromString<List<TimerState>>(it) }
    }.getOrDefault(emptyList()) ?: emptyList()

    private fun readSettingsFile(): AppSettings = runCatching {
        PlatformStorage.readString("settings.json")?.takeIf { it.isNotBlank() }
            ?.let { json.decodeFromString<AppSettings>(it) } ?: AppSettings()
    }.getOrDefault(AppSettings())

    private fun readGroqFile(): GroqSettings = runCatching {
        PlatformStorage.readString("groq.json")?.takeIf { it.isNotBlank() }
            ?.let { json.decodeFromString<GroqSettings>(it) } ?: GroqSettings()
    }.getOrDefault(GroqSettings())

    private fun readDrawingsFile(): List<Drawing> = runCatching {
        PlatformStorage.readString("drawings.json")?.takeIf { it.isNotBlank() }
            ?.let { json.decodeFromString<List<Drawing>>(it) } ?: emptyList()
    }.getOrDefault(emptyList())
}

expect object PlatformStorage {
    fun readString(name: String): String?
    fun writeString(name: String, value: String)
}
