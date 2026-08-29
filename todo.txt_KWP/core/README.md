# `todotxt-core` — Frontend-Agnostic Todo.Txt Core

This module contains the pure business logic of Todo.Txt, independent of UI frameworks, platforms, persistence, and presentation. The active KMP application consumes it directly for Android, desktop JVM, and Kotlin/Wasm.

## Contents

| File | Responsibility |
| --- | --- |
| `Types.kt` | Serializable domain models: tasks, habits, notes, timers, settings, drawings, filters, and design tokens |
| `TodoParser.kt` | Todo.Txt grammar: checkbox markers, priorities, projects, contexts, due-date extensions, and completion formatting |
| `HabitUtils.kt` | Streaks, best streak, completion rate, momentum, heatmap grids, and date toggling |
| `SchedulingParser.kt` | Relative date/time parsing for due-date scheduling |
| `crdt/LwwMap.kt` | Last-Write-Wins CRDT for peer-to-peer sync merge |
| `Platform.kt` | Platform clock contract |
| `IdUtils.kt` | Identifier generation for notes and habits |

## Build and test

```bash
cd todo.txt_KWP
./gradlew :core:jvmTest --no-daemon --max-workers=1 --console=plain
./gradlew :core:build --no-daemon --max-workers=1 --console=plain
./gradlew :core:publishToMavenLocal --no-daemon --max-workers=1 --console=plain
```

## Design contract

This core is the source of truth for Todo.Txt grammar and habit semantics in the active KMP application. Platform UI, storage, reminders, widgets, and sync are layered on top of it. The frozen React app is intentionally not kept as a second live implementation; its vendored snapshot is a compatibility artifact rather than an active development target.

## What is not here

No UI, platform-specific Android API, filesystem, network, or persistence implementation belongs in this module.
