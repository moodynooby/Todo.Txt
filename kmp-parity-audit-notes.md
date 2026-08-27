# kmp-first-parity audit notes

## Scope

Primary target: `origin/kmp-first-parity`, audited in isolated worktree `/home/ubuntu/Todo.Txt-kmp-first-parity` at commit `b8fe647` (`deadweight`). Unique history from `origin/main` includes `1e22ab9` (Compose Multiplatform primary product), `553b78a` (parity tests), and `b8fe647`.

## Authoritative sources

- Todo.Txt canonical primer: https://github.com/todotxt/todo.txt
- WCAG 2.2 contrast minimum: https://www.w3.org/WAI/WCAG22/Understanding/contrast-minimum

The canonical Todo.Txt primer defines one task per plain-text line; priority, when present, is first; an optional creation date follows priority or appears first; projects and contexts may appear anywhere after the priority/prepended date as `+project` and `@context`. Due dates and recurrence are product extensions.

WCAG 2.2 SC 1.4.3 requires 4.5:1 for normal text and 3:1 for large-scale text.

## Branch architecture findings

The branch makes Compose Multiplatform the primary product for Android, desktop JVM, and Kotlin/Wasm browser. The legacy React/Vite app remains a rollback/compatibility build, and the Tauri shell remains optional. Shared KMP core targets JVM, Kotlin/JS, and Wasm and supplies TodoParser, habit math, scheduling, widgets, and document rules.

The KMP app has a Home/Capture workspace plus Todo, Habits, Notes, Draw, Timer, AI, Editor, and Sync. The raw editor already exists as a dedicated Editor workspace and saves directly to `Storage.content`; TodoPage also exposes quick-add, search, filters, import/export, task editing, and bulk actions.

## High-priority parity gaps

1. **Native/KMP timer is not floating.** `native/app/src/commonMain/kotlin/app/todotxt/ui/timer/TimerPage.kt` renders timers as a page of cards. There is no global overlay in `AppRoot`, no drag position, and no timer affordance while working in Todo, Notes, Draw, Habits, AI, or Editor. The legacy React surface has a draggable `FloatingWindow` timer, so the primary KMP product regresses the requested behavior.
2. **KMP Notes are not equivalent to web Notes.** `native/.../ui/notes/NotesPage.kt` uses plain `OutlinedTextField`s and a simplified `renderMarkdown` preview. The web compatibility surface uses TipTap rich editing. The KMP implementation declares unused `current`, `boldRegex`, and `italicRegex` variables in the simplified renderer and does not implement full rich-text editing.
3. **KMP note contrast is not dynamic.** Note cards paint `note.color.hex` as the background but do not compute a readable foreground. The preview hardcodes `Color(0xFF2F6F61)` for headings and `Color(0xFFD9784F)` for bullets. This can be unreadable for future/custom note colors and violates the branch’s own semantic-token direction.
4. **KMP Draw is only a partial Excalidraw implementation.** It intentionally renders a portable subset and preserves unknown elements, but uses a fixed palette (`#1e1e1e`, `#e03131`, etc.), falls back to `Color.Black` for malformed/unsupported colors, and uses a fixed selection accent `Color(0xFF6965DB)`. The web wrapper uses Excalidraw’s own UI and scene behavior, so tool/menu/interaction parity is partial rather than identical.
5. **Browser keyboard parity is incomplete.** `KeyboardShortcuts.wasmJs.kt` makes `keyboardShortcuts` and `keyboardFocusable` no-ops; `rememberKeyboardHost` only allocates a requester. Common TodoPage comments promise `/`, `n`, and undo shortcuts, but the Wasm actual does not implement those browser behaviors.
6. **Browser reminder parity is limited.** `BrowserServices.wasmJs.kt` maps exact-alarm permission to Notification permission and only emits a notification when `scheduleDueReminders` is called after content changes. It does not schedule a future timer for a task that becomes due while the tab stays open, and `scheduleReminders(habits)` is a no-op. These are explicit platform boundaries but should be surfaced in product UI.
7. **Desktop menu bar cannot be hidden.** `native/app/src/desktopMain/kotlin/app/todotxt/Main.kt` always composes a `MenuBar` containing File → Hide/Quit. There is no menu-bar visibility preference or restore command. The common KMP UI also has no matching menu/header visibility state.
8. **KMP command palette is much narrower than the legacy web palette.** It can filter/open workspaces and change theme, but does not expose timer creation, editor focus, menu-bar visibility, density, task filters, or Todo.Txt actions.
9. **AI parity is incomplete.** Native AI exposes model selection and a prompt field; the web compatibility dialog has fixed model selection and immediate tool actions. Tool wording differs, and native `runGroqCompletion` sends only a user message without a system contract. Both clients call GROQ directly with user-entered keys, duplicating transport and validation. Native applies an AI result if any line parses, but there is no strict whole-document validation before replacement.
10. **Native sync deliberately excludes drawings.** `AccountSyncManager` documents that native stroke format and web Excalidraw scene JSON are incompatible and drawings are not synced. This is an honest boundary, but it means the branch is not full feature parity across devices for Draw.

## Branch health checks

- `pnpm install --frozen-lockfile`: passed.
- `pnpm typecheck`: passed.
- `pnpm test`: passed on the legacy web test suite.
- `pnpm run build:legacy`: passed; the existing size check reported an eager index of about 493 KB against a 600 KB budget.
- Native Gradle checks (`:core:jvmTest`, desktop compile, Wasm compile) were blocked before compilation because Gradle 8.14.4 requested a downloadable Java 21 toolchain despite OpenJDK 21.0.11 being installed locally, and no toolchain download URL was configured for Linux x86_64. This is an environment/toolchain discovery issue, not yet evidence of a source compile failure.

## Recommended conclusion

The KMP-first direction is architecturally preferable for the primary product because it centralizes common UI and domain logic and makes platform boundaries explicit. It is not yet the best parity implementation for the requested UX. The highest priority is to add a shared in-app floating timer overlay, then replace KMP Notes’ simplified editor/renderer with a common rich-text contract or a clearly scoped feature subset, add dynamic contrast computation in Compose and web, and create a shared AI tool schema plus parser-backed validation. Keep Todo.Txt plain text as the canonical document boundary and keep Excalidraw sync either unified through a lossless common scene model or explicitly labeled as device-local.

## CI configuration cross-check

The branch CI workflow correctly provisions Temurin Java 21, Node 22, pnpm 9, and `libatomic1`, then runs Biome, web tests, web typecheck, the legacy build, KMP core tests, desktop compilation, and Wasm compilation. The local Gradle failure is therefore a local toolchain-discovery mismatch rather than an obviously missing CI prerequisite. Hosted CI should be checked for the latest run status before merging.

## Final assessment

The branch is a credible KMP-first migration and its architectural direction is sound. It has real shared-core reuse and explicit browser capability boundaries. However, the word “parity” currently overstates the UI equivalence: timer floating, rich Notes editing, dynamic contrast, full Draw behavior, browser shortcuts, reminders, desktop menu visibility, command actions, and AI validation remain incomplete or intentionally divergent. The best next step is a parity matrix with “same”, “adapted”, and “unsupported” labels per platform, backed by feature-level tests and browser/desktop smoke checks.
