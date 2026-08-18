@file:Suppress("unused")

package app.todotxt.domain

// Re-export of the frontend-agnostic core module so existing app code
// (Storage, UI pages, services) keeps compiling without import changes.
// All domain types, the todo.txt parser, and habit math now live in
// `app.todotxt.core` (the :core Gradle module, also published to Maven).

typealias Task = app.todotxt.core.Task
typealias ParsedTodoContent = app.todotxt.core.ParsedTodoContent
typealias FilterType = app.todotxt.core.FilterType
typealias Filter = app.todotxt.core.Filter
typealias Habit = app.todotxt.core.Habit
typealias HabitColor = app.todotxt.core.HabitColor
typealias Note = app.todotxt.core.Note
typealias NoteColor = app.todotxt.core.NoteColor
typealias TimerState = app.todotxt.core.TimerState
typealias GroqSettings = app.todotxt.core.GroqSettings

typealias TodoParser = app.todotxt.core.TodoParser
typealias HabitUtils = app.todotxt.core.HabitUtils
typealias IdUtils = app.todotxt.core.IdUtils
