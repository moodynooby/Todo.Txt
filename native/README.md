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
| Workspaces: Todos, Habits, Notes, Draw, Timer | Implemented |
| AI tools (Groq) | Implemented (key stored locally) |
| Persistence | `expect/actual`: files on disk (desktop), DataStore (Android) |
| Tests | `commonTest` ports the web app's parser + habit utility suites — all green |
| Build outputs | Android debug APK + Debian package both produced |

## Build

```bash
cd native
./gradlew :app:assembleDebug          # Android APK
./gradlew :app:compileKotlinDesktop   # Desktop compile check
./gradlew :app:packageDeb             # Linux .deb
./gradlew :app:test                   # Domain + habit utility tests
```

Requires JDK 21 and Android SDK (platform 35, build-tools) with `ANDROID_HOME` set.

## What is deliberately out of scope

- Notes editor (Tiptap) and Excalidraw scenes: the Draw workspace keeps strokes
  in memory for now; full rich-text and scene persistence are the next iteration
- Firebase/Firestore sync: local-first only, as the experiment intends
- AlarmManager exact alarms, home-screen widgets, and iOS surfaces: next phases

## Architecture map

```
native/app/src/
├── commonMain/kotlin/app/todotxt/
│   ├── domain/      Task, Habit, Note types + TodoParser, HabitUtils, IdUtils
│   ├── theme/       FieldNotesTheme (M3 Expressive tokens from the web app)
│   ├── persistence/ expect Storage + common repository
│   └── ui/          AppRoot + todo, habits, notes, timer, draw, ai pages
├── androidMain/     MainActivity, Application, Android file storage actual
└── desktopMain/     Swing main, menu bar, desktop file storage actual
```

The `domain` layer mirrors `src/types/` and `src/utils/` from the web repo one-to-one,
so the web vitest suites could be re-targeted here with minimal translation.

## License

Same as the parent repo.
