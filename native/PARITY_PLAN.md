# Kotlin Native Parity Plan

**Repository:** `moodynooby/Todo.Txt` · **Branch:** `native/kotlin-compose`
**Author:** Manus AI · **Date:** August 18, 2026

This document is the roadmap for bringing the Kotlin Compose Multiplatform
native app to full feature parity with the React/Vite web app, whose code has
been removed from the working copy of this branch. The web app's complete
feature inventory is preserved in `PARITY_NOTES.md`, which this plan draws on.

## 1. Current State of the Native App

The native app already matches the web app across its six workspaces at a
functional level. The Todo workspace supports the full todo.txt grammar
(priority, projects, contexts, due dates, checkboxes, completion toggling),
filters, and local file persistence. Habits provides streaks, best streaks,
completion rate, momentum, a twelve-week heatmap, date toggling, and Android
exact-alarm reminders. Notes offers markdown-ish editing with color coding and
tags. Draw provides a freehand canvas with stroke persistence. Timer runs
pomodoro-style sessions. AI tools call Groq through Ktor. On top of the
workspaces, the app ships Glance home-screen widgets for Todo and Habits, a
Desktop system tray, and a shared `todotxt-core` module that now compiles for
both the JVM (native app) and JS (web app).

## 2. Feature Gaps and Implementation Plan

The gaps below are ordered by user-facing impact. Each item references the web
app source it replaces, so implementation can start from a known-good
reference.

### Tier 1 — Core daily-use features

| # | Missing feature | Web app reference | Kotlin native approach |
|---|----------------|-------------------|------------------------|
| 1 | Quick-add bar with context-aware suggestions | `components/QuickAddBar.tsx`, `components/SmartSuggestionChips.tsx` | Compose text field with auto-complete dropdown fed by existing projects/contexts filters |
| 2 | Bulk actions (complete, delete, move) on task selection | `taskExtensions.ts`, TodoPage selection UI | Selection mode in TodoPage using the already-ported `setLineCompleted` core API |
| 3 | Drag-and-drop task reordering | TodoPage drag handlers | Compose `LazyColumn` reordering with `detectDragGestures` persisting new order to `todo.txt` |
| 4 | Import/export of todo.txt files and backups | `lib/documentExport.ts`, `lib/todoBackup.ts`, `file-saver` | Android: SAF picker + scoped storage; Desktop: JFileChooser; reuse `Storage.kt` serialization |

### Tier 2 — Editor and polish

| # | Missing feature | Web app reference | Kotlin native approach |
|---|----------------|-------------------|------------------------|
| 5 | Rich notes editing (TipTap-grade: task lists, markdown, placeholder) | `features/notes/*`, TipTap stack | Keep lightweight markdown editor now; evaluate `compose-richtext` or a WebView-based TipTap bridge later |
| 6 | Timer sound and fullscreen mode | `lib/beep.ts`, `lib/fullscreen.ts` | Kotlin `SoundPool`/`MediaPlayer` for beep; Android immersive + Desktop fullscreen API |
| 7 | Advanced parser coverage | `utils/advancedParser.ts` | Extend `TodoParser.kt` in the shared core (JS consumers benefit automatically) |
| 8 | Notes backup/restore | `lib/notesBackup.ts`, `lib/habitsBackup.ts` | Mirror the export formats in `Storage.kt`-backed backup dialogs |

### Tier 3 — Platform integration (already partially done, worth extending)

| # | Missing feature | Web app reference | Kotlin native approach |
|---|----------------|-------------------|------------------------|
| 9 | Desktop deep links and global shortcuts | `@tauri-apps/plugin-deep-link`, `plugin-global-shortcut` | Java AWT `Desktop` APIs / platform-specific registration; Compose Desktop `Window` focus management |
| 10 | System notifications from habits/notes | `@tauri-apps/plugin-notification` | Android `NotificationManager`; Desktop via `java.awt.SystemTray` displayMessage or notify-send on Linux |

## 3. Deliberately Not Carried Over

Several web app capabilities map poorly to a local-first native app and are
excluded by design rather than deferred. Firebase authentication and Firestore
synchronization (`src/lib/firebase.ts`, `firestoreClient.ts`) are replaced by
local files and DataStore; if multi-device sync is wanted later, a plain
file-over-cloud option (e.g., syncing the `todo.txt` file via the OS cloud
folder) is far simpler than re-hosting Firestore. The Tauri desktop shell
(`src-tauri/`) is superseded by Compose Desktop, which already delivers the
system tray and native windows. PWA, service worker, and share targets exist
only in a browser context and have no native equivalent. Finally, the
Excalidraw canvas dependency is web-only; the native Draw workspace keeps its
lightweight custom canvas, and a full vector editor would be a large,
low-value undertaking.

## 4. The Shared Core as a Parity Accelerator

The conversion of `native/core/` to Kotlin Multiplatform (JVM + JS) is the
single biggest parity asset. The todo.txt parser and all habit math now live
in one codebase consumed by both apps: the JVM artifact feeds the native app
directly, and the JS bundle (`native/core/npm/`, package `todotxt-core`) is
available to any TypeScript consumer via `globalThis.todotxtCore` or a
`file:` npm dependency. Every parser bug fix or habit-math change now ships to
both platforms simultaneously, which means Tier 2 item 7 (advanced parser
coverage) is implemented once and distributed twice.

## 5. Suggested Execution Order

Work through the tiers in order, one workspace at a time, verifying both
`compileKotlinDesktop` and `compileDebugKotlinAndroid` after each feature
lands. Tier 1 items 1 and 2 are the highest-impact changes and touch only the
app module's UI layer, not the shared core. After Tier 1, the app will feel
complete for daily use; Tiers 2 and 3 are polish and platform depth that can
be picked up incrementally.
