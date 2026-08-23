# Agent Guidelines for Todo.Txt

This repo ships **three surfaces** on `main`, all sharing one core:

1. **Native app (`native/`)** — the frontrunner. Kotlin Compose Multiplatform (Android + Desktop JVM; no iOS/macOS). Compose UI, CameraX + ML Kit QR scanning, seven Glance widgets fed by the shared core projection, Ktor QR-based P2P sync with LWW-CRDT core (continuous WebSocket), notification actions (Mark Done / Snooze), multi-timer. Kotlin 2.1.21, CMP 1.7.3, AGP 8.7.3.
2. **Web app** (repo root — `src/`, `package.json`) — browser/PWA; also embeddable in the Tauri shell below. React 19 + Vite + TypeScript, Mantine 9 UI, TipTap 3 editor (Markdown ext), Excalidraw drawing, Firebase Auth + Firestore sync, GROQ AI (`@ai-sdk/groq`), PWA via vite-plugin-pwa.
3. **Tauri shell (`src-tauri/`)** — optional Rust wrapper around the same web UI for desktop + an Android build (`tauri android`), with its own RemoteViews widget stack (Todo/Momentum/Streaks/Heatmap/Week-Grid) fed by the shared `WidgetData` JSON contract. Not built by default; no `@tauri-apps/*` npm deps are installed (add them back only when building this target).

**Shared core (`native/core/`)**: a KMP module with JVM + JS/IR targets — habit merge (`HabitMerge`), streaks/heatmap math (`HabitUtils`), scheduling parsing, and the shared widget projection (`WidgetData`, consumed by BOTH Android widget stacks: native Glance widgets and the Tauri shell's RemoteViews providers). The web app consumes the Kotlin/JS bundle as a local dependency (`file:native/core/npm-package`). The bundle IS committed to git (Netlify has no Gradle toolchain and never regenerates it): after changing core code run `cd native && ./rebuild-npm-package.sh` and commit the regenerated `native/core/npm-package/` files.

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

- **Use pnpm** for installs. `pnpm-workspace.yaml` gates postinstall scripts: new deps with build scripts must be added to `allowBuilds` there (currently `@firebase/util`, `protobufjs`).
- Copy `.env.example` → `.env` (gitignored) with `VITE_FIREBASE_*` values or the app runs local-only (no sign-in/sync); it still works via localStorage backups.
- **Move files with `git mv`**, never plain `mv`.
- Firestore offline persistence is enabled via `initializeFirestore(app, { cacheSizeBytes })` (src/lib/firebase.ts). Do NOT switch to `enableIndexedDbPersistence()` — deprecated.
- Biome: tabs, double quotes, organize-imports on write. TypeScript is strict with `noUnusedLocals`/`noUnusedParameters` — typecheck fails on unused code.
- Hosted on Netlify (no CI in repo).

## Architecture

- Entry: `src/index.tsx` → `src/context/MantineProvider.tsx` → `src/App.tsx` (provider tree + view switch: todo / notes / habits / excalidraw / sync). Path alias `@/` → `src/`.
- **Sync**: `useSyncedDocument` (src/lib/useSyncedDocument.ts) is the ONLY sync API. To sync a new feature: add a doc path in `src/lib/syncPaths.ts` and a `useSyncedX` adapter in `src/lib/syncAdapters.ts` (mounted by `SyncFeatures`). Never import Firestore / build `doc(db, ...)` paths in feature code. Documents live at `users/{uid}/{collection}/{id}`; `updatedAt` (server timestamp) drives conflict resolution; writes are debounced (1s) and batched; features buffer to localStorage (`localKey`, shape `{data, updatedAt}`) for offline start.
- Timers sync only idle snapshots: `beforeWrite` drops running timers, `afterRead` force-resets remote ones to idle (per-device runtime state).
- GROQ API key is user-entered in-app (AI tools dialog) and synced at `settings/groq` — not an env var.
- Firestore security rules (`firestore.rules`): each user may only read/write their own `users/{uid}/**`.

## Design system

Read `DESIGN.md` before visual changes. Theme is Material 3 Expressive: semantic tokens in `src/theme/m3Theme.ts` + CSS vars in `src/styles/App.css`. Use shared `.app-*` classes and Mantine theme colors (`var(--mantine-color-evergreen-7)` etc.) — never inline hex. Update theme tokens before styling a workspace.

## Refactor status (post-audit)

Phase 1 — done:
- Full Tauri shell tracked on `main`; `@todotxt/core` bundle committed with working `@JsExport` exports; dep path is repo-relative.
- `core/WidgetData.kt`: single projection feeding every widget on both Android stacks (+ tests).
- Seven Glance widgets registered + live-refreshed via `WidgetRefresher`; boot receiver re-arms alarms.
- `HabitMerge` canonical in core (native P2P, web P2P view, JS exports all call it); parser accepts `due:+Nd`.
- Web: Sync tab wired (lazy chunk), dead files/`qrcode` removed, biome ignores the generated core bundle.

Deferred (do next, in this order):
1. Route web parsing/streaks through `@todotxt/core` and delete `src/utils/todoParser.ts` / `advancedParser.ts` / `habitUtils.ts` duplicates (~630 LOC); fix highlighter regex drift by consuming parser output.
2. Unify web sync normalization: startup reconciliation should reuse adapter `encode/decode/afterRead` instead of its own copy.
3. Native UI atoms (search field ×3, page header ×8, swatch row, confirm dialog) and `SyncSnapshot` ≅ `BackupSnapshot` merge.
4. Remaining native dead code (`Fullscreen`, `NativeActionIcons`, `lastUsedVersion`, desktop tray no-ops).

Doc style: write what code does, not how; explain non-obvious decisions; never restate code verbatim.