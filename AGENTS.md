# Agent Guidelines for Todo.Txt

Single-page todo.txt app: React 19 + Vite + TypeScript, Mantine 9 UI, TipTap 3 editor (Markdown ext), Excalidraw drawing, Firebase Auth + Firestore sync, GROQ AI (`@ai-sdk/groq`), PWA via vite-plugin-pwa. No test framework.

## Commands

| Action | Command |
|--------|---------|
| dev server | `npm run dev` (port 5173) |
| build | `npm run build` |
| preview | `npm run preview` (port 4173) |
| lint + fix | `npm run lint` (biome check --write — rewrites files) |
| format | `npm run format` |
| typecheck | `npm run typecheck` (tsc --noEmit) |
| full check | `npm run check` (lint + typecheck) — run before finishing |

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