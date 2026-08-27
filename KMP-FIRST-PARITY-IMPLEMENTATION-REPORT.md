# KMP-first-parity implementation report

## Scope

Implemented the high-priority remediation work on the isolated `kmp-first-parity-audit` worktree, based on the confirmed `kmp-first-parity` branch at commit `b8fe647`. The changes are intentionally kept separate from the earlier `main` worktree.

## Completed work

| Workstream | Implementation | Main files |
| --- | --- | --- |
| Shared contracts | Added canonical timer math, runtime contrast calculation, platform capability types, AI tool definitions, and whole-document Todo.Txt validation. | `native/core/src/commonMain/kotlin/app/todotxt/core/ParityContracts.kt` |
| Build reproducibility | Added Java 21 environment-based discovery, synchronized the Kotlin/JS Yarn lock, and made the KMP build script use the stable compiler strategy. | `native/gradle.properties`, `native/kotlin-js-store/yarn.lock`, `scripts/build-kmp-web.mjs` |
| Floating timers | Added a common Compose overlay mounted above the workspace router. It persists position, follows active timers across workspaces, and supports pause/resume/reset/remove. | `FloatingTimerOverlay.kt`, `AppRoot.kt`, `TimerPage.kt`, `AppSettings.kt` |
| Navigation and menu | Added persisted hide/show navigation, a restore button, command-palette access, `Ctrl/Cmd+Shift+M`, and reversible desktop OS menu/tray controls with Quit retained. | `AppRoot.kt`, `CommandPalette.kt`, desktop `Main.kt` |
| Dynamic contrast | Note foregrounds are computed from each actual note background at runtime using luminance and contrast ratios. KMP Draw invalid-color fallbacks and selection accents use active Material 3 theme colors. | KMP `NotesPage.kt`, `ExcalidrawDrawPage.kt`, web `contrast.ts`, `NoteCard.tsx`, `NotesPage.css` |
| Notes | Added a compact common Markdown formatting toolbar and KMP bold/italic/heading/list/task preview support. Web card controls now remain readable and keyboard-focusable on any note color. | KMP `NotesPage.kt`, web `NoteCard.tsx`, `NotesPage.css` |
| Draw | Preserved the existing lossless scene-root approach and added a regression test proving unknown elements, root metadata, and custom data survive native edits. | `ExcalidrawSceneTest.kt` |
| Browser parity | Replaced Wasm keyboard no-op with slash/search, `n`/quick-add, and Ctrl/Cmd+Z handling. Browser due reminders now poll while the page is open and refresh notification permission state. | Wasm keyboard and browser service actuals |
| AI | Native and legacy web now use aligned tool instructions and Todo.Txt-only system prompts. AI outputs must validate as complete Todo.Txt documents before apply/replace/append; the web dialog exposes the same model list. GROQ API keys were removed from cloud sync on native and legacy web paths. | native `AiPage.kt`, web `aiPrompts.ts`, `AiToolsDialog.tsx`, `useAiGroq.ts`, sync adapters |

## Validation

| Check | Result |
| --- | --- |
| Web typecheck | Passed |
| Web unit tests | Passed: 43 tests across 8 files |
| Web Biome check | Passed: 93 files, no fixes required in final run |
| Git whitespace check | Passed |
| KMP core JVM tests | Passed: 65 tests |
| KMP desktop app tests | Passed |
| KMP desktop compilation | Passed |
| KMP Wasm compilation | Passed |
| Legacy React production build | Passed; eager index 492 KB / 600 KB budget and precache payload ~9.7 MB / 14 MB |
| Full KMP Wasm browser distribution | Blocked by the sandbox during the production compilation phase when the Gradle/Kotlin compiler daemon disappeared. The direct KMP Wasm compile target passes, and the failure is environmental rather than a source compiler error. |

## Remaining limitations

The floating timer is an in-app cross-workspace overlay. An OS-level always-on-top timer window is not claimed, because desktop, Android, and browser permissions differ and the branch does not yet have a shared permission-gated window service. Browser reminders are explicitly page-open only; closed-tab delivery requires a service worker or push backend. Native and web AI still call Groq directly from the client by design, so production deployments should offer a server-side proxy or platform secret store before enabling organization-wide use.

The worktree is not pushed to the remote branch. It contains the implementation changes plus the existing audit and parity-plan documents for review.
