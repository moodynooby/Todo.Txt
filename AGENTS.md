# Agent Guidelines for Todo.Txt

This repo now ships **two products** on the `native/kotlin-compose` branch:

1. **Native app (`native/`)** — the frontrunner. Kotlin Compose Multiplatform (Android + Desktop JVM; no iOS/macOS). Compose UI, CameraX + ML Kit QR scanning, Glance habit widgets (Momentum / Heatmap / Quick-Check), Ktor QR-based P2P sync with LWW-CRDT core (continuous WebSocket), notification actions (Mark Done / Snooze), multi-timer. Kotlin 2.1.21, CMP 1.7.3, AGP 8.7.3.
2. **Web app** (repo root — `src/`, `package.json`) — browser/PWA only (Tauri removed). React 19 + Vite + TypeScript, Mantine 9 UI, TipTap 3 editor (Markdown ext), Excalidraw drawing, Firebase Auth + Firestore sync, GROQ AI (`@ai-sdk/groq`), PWA via vite-plugin-pwa.

**Shared core (`native/core/`)**: a KMP module with JVM + JS/IR targets — habit merge, streaks, heatmap, scheduling parsing (LwwMap CRDT + SchedulingParser + CoreEntry JS exports). The web app consumes the Kotlin/JS bundle as a local `@todotxt/core` dependency (`file:../Todo.Txt/native/core/npm-package`, gitignored — rebuild with `./gradlew :core:jsBrowserProductionWebpack` and copy output to `npm-package/`).

## Commands

| Action | Command |
|--------|---------|
| native typecheck + build (both targets) | `cd native && ./gradlew :app:compileKotlinDesktop :app:compileDebugKotlinAndroid --no-daemon --console=plain` |
| native core tests | `cd native && ./gradlew :core:jvmTest --no-daemon` |
| rebuild shared core JS bundle | `cd native && ./gradlew :core:jsBrowserProductionWebpack` (copy output to `native/core/npm-package/`) |
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

- Entry: `src/index.tsx` → `src/context/MantineProvider.tsx` → `src/App.tsx` (provider tree + view switch: todo / notes / habits / excalidraw). Path alias `@/` → `src/`.
- **Sync**: `useSyncedDocument` (src/lib/useSyncedDocument.ts) is the ONLY sync API. To sync a new feature: add a doc path in `src/lib/syncPaths.ts` and a `useSyncedX` adapter in `src/lib/syncAdapters.ts` (mounted by `SyncFeatures`). Never import Firestore / build `doc(db, ...)` paths in feature code. Documents live at `users/{uid}/{collection}/{id}`; `updatedAt` (server timestamp) drives conflict resolution; writes are debounced (1s) and batched; features buffer to localStorage (`localKey`, shape `{data, updatedAt}`) for offline start.
- Timers sync only idle snapshots: `beforeWrite` drops running timers, `afterRead` force-resets remote ones to idle (per-device runtime state).
- GROQ API key is user-entered in-app (AI tools dialog) and synced at `settings/groq` — not an env var.
- Firestore security rules (`firestore.rules`): each user may only read/write their own `users/{uid}/**`.

## Design system

Read `DESIGN.md` before visual changes. Theme is Material 3 Expressive: semantic tokens in `src/theme/m3Theme.ts` + CSS vars in `src/styles/App.css`. Use shared `.app-*` classes and Mantine theme colors (`var(--mantine-color-evergreen-7)` etc.) — never inline hex. Update theme tokens before styling a workspace.