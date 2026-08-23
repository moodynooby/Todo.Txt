# Todo.Txt — Kotlin Native Experiment

Experimental native build of [Todo.Txt](https://github.com/moodynooby/Todo.Txt) on the
`native/kotlin-compose` branch. **Main is untouched** — this directory is a completely
separate Compose Multiplatform project that never touches the web app's pipeline.

## What this is

A Kotlin 2.1.21 + Compose Multiplatform 1.7.3 port of the web app, targeting:

- **Android** — `app/src/androidMain`, Gradle task `assembleDebug` → `app-debug.apk`
- **Desktop (Windows / Linux / macOS)** — `app/src/desktopMain`, packaged with jpackage
  (`packageDeb` / `packageMsi` / `packageDmg`)

The goal is full 1:1 feature parity with the web app while answering one question:
*do the native advantages (local file, OS reminders, widgets, instant start) feel as
good in practice as on paper?*

## Status

| Area | State |
| --- | --- |
| Domain layer (`Task`, `Habit`, `Note`, settings, parser, habit math) | Ported + unit tested |
| Field Notes Ritual M3 Expressive theme | Ported to `FieldNotesTheme` |
| Workspaces: Todos, Habits, Notes, Draw, Timer, AI, Sync | Implemented |
| AI tools (Groq) | Implemented (key stored locally) |
| Persistence | `expect/actual`: files on disk (desktop), DataStore (Android) |
| Notifications | Android habit/due reminders with Mark Done + Snooze actions |
| Widgets | Android Glance widgets: habit momentum, heatmap, quick-check toggle |
| P2P Sync | QR-based bidirectional CRDT sync (LWW Map) — works Android↔Desktop↔Web |
| Shared core | JVM + JS/IR targets — same logic across native and web |
| Tests | `commonTest` ports the web app's parser + habit utility suites — all green |

## Build

```bash
cd native
./gradlew :app:assembleDebug          # Android APK
./gradlew :app:compileKotlinDesktop   # Desktop compile check
./gradlew :app:packageDeb             # Linux .deb
./gradlew :app:test                   # Domain + habit utility tests
```

Requires JDK 21. `gradle/gradle-daemon-jvm.properties` pins the daemon JVM
criteria to 21, so any invocation launches Gradle on a detected JDK 21 even if
the shell default is newer (e.g. Temurin 25, whose version string crashes
Kotlin 2.1.x's version parser) — no `JAVA_HOME` override needed.

## What is deliberately out of scope

- **Rich notes editor** (Tiptap-equivalent): the Notes workspace uses a multi-line
  `TextField` for now; full rich-text with TipTap parity is planned
- **Excalidraw-equivalent drawing**: the Draw workspace keeps strokes in memory;
  full scene persistence and vector editing are the next iteration
- **iOS / macOS**: deliberately not targeted — Android + Desktop (Windows/Linux) only

## Architecture map

```
native/app/src/commonMain/kotlin/app/todotxt/
├── crdt/          LwwMap — shared P2P sync merge logic
├── domain/        Task, Habit, Note types + TodoParser, HabitUtils, IdUtils
├── keyboard/      expect/actual keyboard shortcuts (desktop only)
├── persistence/   expect/actual Storage + repository (multi-timer, undo stack)
├── service/       AlarmPermissionManager, DueReminderManager, P2pSyncManager
├── theme/         FieldNotesTheme (M3 Expressive)
├── ui/            AppRoot + workspace pages (todo, habits, notes, timer, draw, ai, sync)
└── widgets/       (androidMain) Glance habit widgets + toggle callback
```

The `domain` layer mirrors `src/types/` and `src/utils/` from the web repo one-to-one,
so the web vitest suites could be re-targeted here with minimal translation.

## License

Same as the parent repo.
