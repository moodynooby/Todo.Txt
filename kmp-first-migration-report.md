# KMP-First Migration and Impact Report

**Branch:** `kmp-first-parity`
**Product goal:** Make the Compose Multiplatform application the primary Todo.Txt product across desktop, Android, and browser/Wasm while preserving the Todo, Notes, and Draw models.

## Executive outcome

The native Compose Multiplatform application is now the primary browser product path as well as the native desktop and Android path. `native/app` targets desktop JVM, Android, and Kotlin/Wasm; `native/core` targets JVM, Kotlin/JS IR, and Kotlin/Wasm. The root `pnpm run build` command now produces the KMP/Wasm browser distribution, while the former React/Vite application remains available explicitly as `pnpm run build:legacy` for rollback and compatibility.

The common UI opens on a Google Keep-style **Home / Capture** workspace. Tasks and notes share a fast capture entry point and recent previews, but their underlying Todo.txt, rich-note, and Draw scene models remain separate. This delivers a unified product experience without coupling incompatible parsing, editor, persistence, synchronization, or undo semantics.

## Changes and impact

| Area | Implementation | Impact |
|---|---|---|
| Primary architecture | Added Wasm targets and a Compose browser launcher, HTML shell, and production bundle path. | One common UI/domain architecture now serves desktop, Android, and browser instead of treating the browser as a separate React product. |
| Unified UX | Added `Workspace.CAPTURE`, `CapturePage`, Home navigation, task/note capture controls, and previews for tasks, notes, and drawings. | Reduces navigation friction while preserving specialized editors and data models. |
| Shared domain behavior | Added Wasm clock/date actuals and a shared `mergeImportedTodo` rule with JVM regression tests. | Keeps import and time behavior consistent across platforms and avoids duplicated edge-case rules. |
| Browser capabilities | Added localStorage persistence, browser file-picker import, encoded text export, injected Firebase public configuration, Notification API reminders, keyboard/release/device/beep adapters, and explicit portable-backup status. | Closes major compile/runtime parity gaps without pretending browser APIs are native OS services. |
| Correctness | Fixed Draw drag release to commit the final moved scene. Fixed sync queue identity to include `collection/id`, preventing `todos/main` and `notes/main` from merging. | Prevents silent data loss or surprising cross-document overwrites in two high-risk workflows. |
| Performance and maintainability | Retained earlier single-pass core/todo/habit/note derivations and lazy AI dialog loading; centralized common sync/import rules. | Reduces repeated scans and startup work while keeping feature behavior intact. |
| Deployment | KMP build script copies production output to `dist`, injects JSON-safe Firebase values, removes the public source map, and Netlify uses frozen pnpm plus Java 21. | Netlify and release artifacts now use the same KMP-first production path. |
| Release confidence | Added push/PR CI for Biome, tests, typecheck, legacy build, KMP core tests, desktop compile, and Wasm source compile. Updated release desktop jobs to JDK 21. | Separates continuous validation from tag/manual releases and aligns all native Gradle jobs with the required toolchain. |

## Validation evidence

The following checks passed on the dedicated branch during this completion pass:

| Check | Result |
|---|---|
| `pnpm install --frozen-lockfile` | Passed earlier and remains the deployment install contract. |
| `pnpm test` | Passed: 7 files, 41 tests. |
| `pnpm typecheck` | Passed. |
| `pnpm exec biome check src scripts package.json` | Passed: 90 files checked. |
| `pnpm run build:legacy` | Passed, preserving the React/Vite rollback build. |
| `native/:core:jvmTest` | Passed. |
| `native/:app:compileKotlinDesktop` | Passed. |
| `native/:app:compileKotlinWasmJs` | Passed. |
| `native/:app:wasmJsBrowserProductionWebpack` | Passed with the corrected generated JavaScript interop blocks. |
| Exact `FIREBASE_API_KEY=test FIREBASE_PROJECT_ID=test-project pnpm run build:kmp` | Passed; produced `dist/index.html`, `app.js`, and two Wasm binaries. |
| Dist configuration assertions | Passed; assignments were emitted as `window.__TODO_TXT_FIREBASE_API_KEY__ = "test";` and `window.__TODO_TXT_FIREBASE_PROJECT_ID__ = "test-project";`, with no placeholders and no `dist/app.js.map`. |
| Browser smoke test | Passed; Chromium loaded `Todo.Txt`, rendered the Capture workspace, found the Compose canvas in a shadow root, confirmed localStorage, and showed no settled uncaught console errors. |
| GitHub workflow syntax | Passed with actionlint 1.7.12 for `ci.yml` and `release.yml`. |

The final published test output is approximately **526 KiB JavaScript**, **8.24 MiB Skiko Wasm**, and **5.56 MiB application Wasm**, about **16 MiB before transfer compression**. This is a normal Compose/Wasm trade-off and is now a measured follow-up optimization target rather than an untracked deployment risk.

A forced clean production Kotlin recompile exceeded the sandbox’s approximately 3.8 GiB RAM ceiling during the Wasm compiler daemon phase, but the bounded production Webpack task and exact deployment build completed after the corrected production executable was generated. The release configuration uses one worker and bounded JVM settings; hosted Netlify/GitHub runners provide the larger memory envelope expected by the Kotlin/Wasm optimizer.

## Deliberate platform boundaries

This migration closes major browser/native parity gaps, but **one-to-one capability equivalence is not claimed** where the platform contract differs:

| Capability | Browser behavior | Native behavior |
|---|---|---|
| Persistence | Local-first `localStorage`. | Platform-private files/DataStore and rotating local snapshots. |
| Todo import/export | File picker import and encoded text export. | Native document/share flows. |
| Encrypted portable `.tdb` backup | Explicitly unavailable in the current Wasm adapter; it reports a failure status rather than silently exporting plaintext. | Android/desktop encrypted backup flow remains available. |
| Reminders | Notification API for immediate/due-task notifications, permission-aware and deduplicated. | OS notification scheduling, Android exact-alarm UX, and action buttons. |
| Background scheduling | No closed-tab equivalent to native background alarms; habit scheduling is not silently claimed as equivalent. | Platform scheduler/alarm facilities where configured. |
| Firebase sync | Requires injected public project ID/API key, authentication, and secure Firestore Rules; otherwise local-only. | Native Firebase configuration follows platform build/runtime setup. |
| Draw | Common page and corrected final-scene persistence are shared, but browser/native pointer and canvas event systems still warrant dedicated interaction coverage. | Native scene editor and persistence. |

Android compilation was not run in this sandbox because no Android SDK was installed. The release workflow installs/configures Android tooling and uses JDK 21; an Android runner or Android Studio remains the appropriate final device/emulator gate.

## Release and deployment contracts

Netlify uses the following exact contract from `netlify.toml`:

```text
pnpm install --frozen-lockfile && pnpm run build:kmp
```

It publishes `dist/`, injects `FIREBASE_API_KEY` and `FIREBASE_PROJECT_ID` when configured, and serves the Wasm MIME type with immutable caching for generated assets. `ci.yml` validates every push and pull request without creating a release. `release.yml` builds Windows MSI, Linux `.deb`, Android APK, and the KMP/Wasm web artifact only for release tags or manual dispatch.

## Files of interest

| File | Responsibility |
|---|---|
| `native/app/src/commonMain/kotlin/app/todotxt/ui/capture/CapturePage.kt` | Unified Home/Capture workspace |
| `native/core/src/commonMain/kotlin/app/todotxt/core/DocumentMerge.kt` | Shared imported Todo.txt merge rule |
| `native/app/src/wasmJsMain/` | Browser persistence, import/export, notifications, Firebase config, and platform actuals |
| `scripts/build-kmp-web.mjs` | Production Wasm build, copy, configuration injection, and source-map removal |
| `.github/workflows/ci.yml` | Push/PR validation gates |
| `.github/workflows/release.yml` | Tag/manual release artifacts |
| `kmp-browser-smoke.md` | Recorded local browser smoke evidence |

## Recommended follow-up

The next high-value work is bundle profiling and code splitting, Android runner validation, real Firebase Auth/Firestore integration testing with restrictive rules, encrypted browser backup using a reviewed Web Crypto design, and pointer/save/reload interaction tests for Draw. Those follow-ups are intentionally separated from the architecture migration so platform constraints remain visible and testable.

## References

[1] [Kotlin/Wasm overview and browser setup](https://kotlinlang.org/docs/wasm-get-started.html)

[2] [Compose Multiplatform compatibility and versioning](https://kotlinlang.org/docs/multiplatform/compose-compatibility-and-versioning.html)

[3] [Firebase web setup and configuration guidance](https://firebase.google.com/docs/web/setup)


## Follow-up parity audit

A second audit compared the legacy React workspace actions and data flows with the KMP/Wasm product. The audit found and fixed several concrete gaps that were not visible in the first migration pass. Todo filters now retain the legacy value-specific behavior for priorities, projects, contexts, due dates, Done, and Pending states. The previously unreachable export-format dialog is now opened from the Todo import/export menu. A shared dependency analyzer and Compose inspector now match the legacy `id:`, `after:`, `blocks:`, cycle, missing-reference, and active/blocked/completed status behavior. The Wasm launcher now starts account sync, so injected browser Firebase configuration reaches the same signed-out/authenticated state machine as desktop and Android. The Sync page also now includes password-reset email handling and create-account confirmation validation. The global KMP shell now provides a command palette entry from desktop navigation, the mobile More sheet, and Ctrl/Cmd+K.

The new tests cover dependency graphs and stable line IDs in `core`, plus Todo filtering and Markdown/HTML export semantics in `app` common tests. The final KMP test gate completed successfully with `:core:jvmTest` and `:app:desktopTest`; the final desktop and Wasm source compiles also passed. The production `pnpm run build:kmp` passed after the final changes using the bounded Gradle/Kotlin configuration (`1536m` heaps and one worker), and generated a valid `dist` with no Firebase placeholders or source map.

The final headless Chromium route audit captured Home/Capture, Todos, Habits, Notes, Draw, Timer, AI, Editor, and Sync. All routes rendered without application JavaScript load errors. The interaction audit opened the Todo dependency dialog and import/export menu successfully. The final Sync capture showed `Signed out` rather than `Disabled`, confirming browser sync initialization. Chromium emitted only expected DBus/software-WebGL/GCM environment warnings.

The product is now functionally aligned across the core task, notes, habits, AI, editor, sync, import/export, dependency, capture, and browser-startup workflows, but a literal 1:1 claim remains inaccurate for platform-specific surfaces. The legacy Google popup sign-in still needs a browser OAuth adapter in the shared KMP auth layer; the KMP timer is a persisted list rather than the legacy draggable floating-window/ring UI; the KMP Draw editor is a portable Excalidraw-subset editor and does not reproduce every upstream Excalidraw menu action such as scene search and save-as-image; density/sidebar preferences and the full legacy shortcut cheatsheet are not yet ported. These are recorded constraints rather than silently treated as equivalent behavior.
