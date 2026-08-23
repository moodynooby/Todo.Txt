# Agent Guidelines for Todo.Txt

This repo ships **three surfaces** on `main`, all sharing one core:

1. **Native app (`native/`)** — the frontrunner. Kotlin Compose Multiplatform (Android + Desktop JVM; no iOS/macOS). Compose UI, CameraX + ML Kit QR scanning, seven Glance widgets fed by the shared core projection, Ktor QR-based P2P sync with LWW-CRDT core (continuous WebSocket), notification actions (Mark Done / Snooze), multi-timer. Kotlin 2.1.21, CMP 1.7.3, AGP 8.7.3.
2. **Web app** (repo root — `src/`, `package.json`) — browser/PWA; also embeddable in the Tauri shell below. React 19 + Vite + TypeScript, Mantine 9 UI, TipTap 3 editor (Markdown ext), Excalidraw drawing, Firebase Auth + Firestore sync, GROQ AI (`@ai-sdk/groq`), PWA via vite-plugin-pwa.
3. **Tauri shell (`src-tauri/`)** — optional Rust wrapper around the same web UI for desktop + an Android build (`tauri android`), with its own RemoteViews widget stack (Todo/Momentum/Streaks/Heatmap/Week-Grid) fed by the shared `WidgetData` JSON contract. Not built by default; no `@tauri-apps/*` npm deps are installed (add them back only when building this target).

**Shared core (`native/core/`)**: a KMP module with JVM + JS/IR targets — todo.txt parsing (`TodoParser`), habit merge (`HabitMerge`), streaks/heatmap math (`HabitUtils`), scheduling + dependency-metadata grammar (`SchedulingParser`, `TaskMetadataParser`), and the shared widget projection (`WidgetData`, consumed by BOTH Android widget stacks: native Glance widgets and the Tauri shell's RemoteViews providers). The web consumes all of this through the typed bridge `src/lib/core.ts` (the only file allowed to import `@todotxt/core`; it converts JSON-string results into web types and maps hex ↔ Kotlin enum colors). The bundle IS committed to git (Netlify has no Gradle toolchain and never regenerates it): after changing core code run `cd native && ./rebuild-npm-package.sh`, then `pnpm install` at the root (pnpm copies `file:` deps into its store) and commit the regenerated `native/core/npm-package/` files.

**Widgets**: seven Glance widgets ship in the native app (Todo, Habits list, Momentum, Heatmap, Quick-Check, Streaks, Week-Grid), all fed by `WidgetData.project(...)` — never compute streaks/rates/grid flags inline in a composable. All receivers are registered in `AndroidManifest.xml`; refresh goes through `WidgetRefresher` only (flow observer re-renders on data change). The Tauri shell's RemoteViews providers read the same JSON contract from `widget_data.json`.

**Sync**: habit merging everywhere (native P2P, web P2P view, JS exports) goes through `core/HabitMerge.kt`. Completed dates are always unioned — never drop the loser side's dates when picking the newer record.

## Commands

| Action | Command |
|--------|---------|
| native typecheck + build (both targets) | `cd native && ./gradlew :app:compileKotlinDesktop :app:compileDebugKotlinAndroid --no-daemon --console=plain` |
| native core tests | `cd native && ./gradlew :core:jvmTest --no-daemon` |
| rebuild shared core JS bundle | `cd native && ./rebuild-npm-package.sh` — then COMMIT `native/core/npm-package/` (Netlify cannot rebuild it) |
| web dev server | `cd . && npm run dev` (port 5173) |
| web build | `cd . && npm run build` |
| web preview | `cd . && npm run preview` (port 4173) |
| web lint + fix | `cd . && npm run lint` (biome check --write — rewrites files) |
| web format | `cd . && npm run format` |
| web typecheck | `cd . && npm run typecheck` (tsc --noEmit) |
| web full check | `cd . && npm run check` (lint + typecheck) — run before finishing |

## Setup & gotchas

- **Use pnpm** for installs. `pnpm-workspace.yaml` gates postinstall scripts: new deps with build scripts must be added to `allowBuilds` there (currently `@firebase/util`, `protobufjs`, `@tauri-apps/cli`).
- Copy `.env.example` → `.env` (gitignored) with `VITE_FIREBASE_*` values or the app runs local-only (no sign-in/sync); it still works via localStorage backups.
- **Move files with `git mv`**, never plain `mv`.
- Firestore offline persistence is enabled via `initializeFirestore(app, { cacheSizeBytes })` (src/lib/firebase.ts). Do NOT switch to `enableIndexedDbPersistence()` — deprecated.
- Biome: tabs, double quotes, organize-imports on write. TypeScript is strict with `noUnusedLocals`/`noUnusedParameters` — typecheck fails on unused code.
- Hosted on Netlify (no CI in repo).
- Native Gradle builds self-select JDK 21 via `native/gradle/gradle-daemon-jvm.properties` (daemon JVM criteria) — no `JAVA_HOME` override even on hosts whose default JVM is newer; a JDK 21 just has to be discoverable (CI runners have one preinstalled).

## Architecture

- Entry: `src/index.tsx` → `src/context/MantineProvider.tsx` → `src/App.tsx` (provider tree + view switch: todo / notes / habits / excalidraw / sync). Path alias `@/` → `src/`.
- **Core bridge**: parsing, habit stats, scheduling phrases, dependency metadata, and habit merging all come from `@todotxt/core` via `src/lib/core.ts`. Never reimplement token extraction, streak math, or the highlighter's regexes — consume parser output (the editor chips in `taskExtensions.ts` locate spans by literal search for parser-extracted tokens only).
- **Sync**: `useSyncedDocument` (src/lib/useSyncedDocument.ts) is the ONLY sync API. To sync a new feature: add a doc path in `src/lib/syncPaths.ts`, a `SyncCodec` in `src/lib/syncAdapters.ts` (wire shape + decode/afterRead rules), and a `useSyncedX` adapter (mounted by `SyncFeatures`). Startup reconciliation in `SyncContext.connect()` runs through the same codecs (`normalizeFieldValue`) — there is exactly one set of normalization rules per document. Never import Firestore / build `doc(db, ...)` paths in feature code. Documents live at `users/{uid}/{collection}/{id}`; `updatedAt` (server timestamp) drives conflict resolution; writes are debounced (1s) and batched; features buffer to localStorage for offline start.
- Timers sync only idle snapshots: `beforeWrite` drops running timers, `TIMERS_CODEC.afterRead` force-resets remote ones to idle (per-device runtime state).
- GROQ API key is user-entered in-app (AI tools dialog) and synced at `settings/groq` — not an env var.
- Firestore security rules (`firestore.rules`): each user may only read/write their own `users/{uid}/**`.

**Native UI**: shared atoms live in `native/.../ui/Common.kt` — every page header is a `PageHeader`, searches use `SearchField`, color picking uses `ColorSwatchRow`, destructive confirms use `ConfirmDialog`. Full-app snapshots (cloud sync + local/portable backups) are one class, `persistence/BackupManager.kt`'s `FullSnapshot` (constructed only through `BackupManager.capture`), with dual timestamp fields kept for wire compatibility.

**PWA chunking**: `vite.config.js` pins `@todotxt/core` into its own chunk via `manualChunks`; index must stay under workbox's 2 MiB per-file precache limit — check `npm run build` output if you add heavy imports to the main chunk.

## Design system

Read `DESIGN.md` before visual changes. Theme is Material 3 Expressive: semantic tokens in `src/theme/m3Theme.ts` + CSS vars in `src/styles/App.css`. Use shared `.app-*` classes and Mantine theme colors (`var(--mantine-color-evergreen-7)` etc.) — never inline hex. Update theme tokens before styling a workspace.

## Refactor status (post-audit)

The audit follow-ups are **COMPLETE** — do not redo any of this:
1. Web parsing/streaks route through `@todotxt/core` via `src/lib/core.ts`; duplicates `src/utils/todoParser.ts` / `advancedParser.ts` / `habitUtils.ts` (+ tests) deleted (~630 LOC); the highlighter consumes parser output tokens instead of its own regexes.
2. Web sync normalization is unified: per-document `SyncCodec`s + `normalizeFieldValue` in `src/lib/syncAdapters.ts`, and `SyncContext.connect()` startup reconciliation uses those same codecs.
3. Native UI atoms live in `native/.../ui/Common.kt` (`PageHeader`, `SearchField`, `ColorSwatchRow`, `ConfirmDialog`); the former `SyncSnapshot`/`BackupSnapshot` merged into one `persistence/BackupManager.kt`'s `FullSnapshot` (constructed only via `BackupManager.capture`, dual timestamps kept for wire compatibility).
4. Remaining native dead code removed: platform `Fullscreen` expect/actual (+ `AppRoot` call), `NativeActionIcons` object, `lastUsedVersion` from `AppSettings`, desktop tray no-ops in `Main.kt`.

Doc style: write what code does, not how; explain non-obvious decisions; never restate code verbatim.