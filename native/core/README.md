# `todotxt-core` — Frontend-Agnostic Todo.Txt Core

This module contains the **pure business logic** of the Todo.Txt application, completely independent of any UI framework, platform, or presentation layer. It compiles to **JVM** (native app) and **JS/IR** (web app via `@todotxt/core`), ensuring identical parsing and habit math across all platforms.

Consumed by:
- The **Compose Multiplatform native app** (Android + Desktop via JVM target)
- The **React web app** (via JS bundle built from the JS target)
- Any other Kotlin consumer via the published Maven artifact

## Contents

| File | Responsibility |
| --- | --- |
| `Types.kt` | Serializable domain models: `Task`, `Habit`, `Note`, `TimerState`, `GroqSettings`, `Drawing`, plus `Filter`/`FilterType` and the `HabitColor`/`NoteColor` design tokens |
| `TodoParser.kt` | The full `todo.txt` grammar: checkbox markers, priority, `+projects`, `@contexts`, `due:` relative + `T`/`@` time forms, `setLineCompleted` completion formatting |
| `HabitUtils.kt` | Habit math: streaks, best streak, completion rate, momentum, 12-week heatmap grid, date toggling |
| `SchedulingParser.kt` | Relative date/time parsing for due-date scheduling |
| `crdt/LwwMap.kt` | Last-Write-Wins CRDT for P2P sync merge |
| `Platform.kt` | `expect fun currentTimeMillis()` — platform clock |
| `IdUtils.kt` | `newId()` generator for notes/habits |
| `CoreEntry.kt` (jsMain) | JS export entry: `parseTodoContentJs`, `mergeHabitsJs`, `streakForHabitJs`, `heatmapForHabitJs`, `toggleHabitDateJs` |

## Build and test

```bash
./gradlew :core:test            # run the domain test suite
./gradlew :core:build           # compile + test + JAR
./gradlew :core:publishToMavenLocal   # publish JAR to ~/.m2 as app.todotxt:todotxt-core:1.0.0
```

## Consuming the published artifact

In any Kotlin project:

```kotlin
repositories { mavenCentral(); mavenLocal() }
dependencies { implementation("app.todotxt:todotxt-core:1.0.0") }
```

## Design contract

This core is the **source of truth for the todo.txt grammar and habit semantics**. The React web app (`src/utils/todoParser.ts`, `src/utils/habitUtils.ts`) and the native app (`core/`) must stay in sync. When changing parsing rules or streak math, update BOTH copies and re-run both test suites — the core's tests were ported from the web app's vitest suites and encode the canonical behavior.

## What is NOT here

Nothing UI-related, platform-specific, or persistence-related lives in this module. No Compose, no Android APIs, no filesystem, no network. Storage, reminders, widgets, and sync are implemented per-platform on top of this core.
