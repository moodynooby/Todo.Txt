# KMP-First Parity Remediation Plan

**Target branch:** `kmp-first-parity`  
**Audit baseline:** commit `b8fe647`  
**Purpose:** Make the Compose Multiplatform product the genuinely coherent primary implementation across Android, desktop JVM, and Wasm browser, while keeping the legacy React/PWA and optional Tauri surfaces compatible during migration.

## 1. Definition of done

Parity must not mean that every platform pretends to have identical capabilities. It means that the same product concepts, document contracts, labels, keyboard commands, and failure states are consistent everywhere. When an operating system cannot provide an equivalent capability, the app must expose an explicit `supported`, `adapted`, or `unavailable` state rather than silently doing nothing.

Todo.Txt remains the canonical task boundary: one task per line, with priority, dates, projects, and contexts preserved through import, export, sync, and AI operations. The canonical format should remain the compatibility contract rather than being replaced by a proprietary task database.[1]

Normal text colors must meet a 4.5:1 contrast ratio and large text must meet 3:1 under WCAG 2.2 AA.[2] Contrast must be calculated from the actual surface color at runtime, including user-selected note colors and imported drawing colors; palette-specific exceptions are not an acceptable substitute.

| Area | Done when |
| --- | --- |
| Shared product contract | A parity matrix labels each feature as `same`, `adapted`, or `unavailable` for Android, desktop, Wasm, legacy web, and Tauri. Every adapted/unavailable state has visible UI copy and a test. |
| Todo.Txt | Parser/export round-trip fixtures cover priorities, creation/completion dates, projects, contexts, blank lines, malformed lines, extension metadata, and completion toggling without line loss. |
| Timer | An active timer is visible and actionable from Todo, Notes, Draw, Habits, AI, Editor, and Sync on Android, desktop, and Wasm. Timer state uses one shared model and remains correct across pause/resume, reload, sleep, clock changes, and target completion. |
| Notes | KMP and legacy web read/write the same markdown document contract, provide the same minimum formatting actions, and preserve unsupported content during round trips. |
| Draw | All platforms either edit the same lossless scene contract or clearly mark unsupported elements read-only. Colors, selection, undo/redo, and save behavior are theme-aware and tested. |
| Contrast | Every foreground/background pair in notes and drawing controls passes automated WCAG checks for the shipped palette and arbitrary valid hex inputs. Invalid colors use a theme-derived fallback, never a fixed black assumption. |
| Navigation and commands | The command registry is shared. Menu/header hiding has a persisted preference and a visible restore path on every desktop/browser surface. Keyboard shortcuts work in Wasm, desktop, and legacy web where the platform supports them. |
| Reminders | Native exact alarms, desktop reminders, browser notifications, and unsupported closed-tab behavior are represented by one capability API with refreshed permission state and tests. |
| AI | Web and native use one tool schema, one Todo.Txt system contract, the same model defaults, preview-before-apply behavior, and parser-backed validation before replacement. API credentials are not silently synced as ordinary cloud document data. |
| Release | CI passes core tests, desktop compile, Wasm compile, legacy web checks, production KMP/Wasm build, and platform smoke tests. |

## 2. Execution order

The work should be delivered in the following dependency order. Do not implement page-specific fixes before the shared contracts are in place.

### Milestone 0 — Freeze the baseline and create the parity matrix

Create `docs/kmp-parity-matrix.md` from the audit findings. Record each feature, its source of truth, platform status, current gap, owner file/module, and acceptance test. Add a short `docs/platform-capabilities.md` describing the difference between in-app behavior and OS-level behavior.

Before code changes, run and record the existing checks from `AGENTS.md`: `pnpm install --frozen-lockfile`, `pnpm exec biome check src scripts package.json`, `pnpm test`, `pnpm typecheck`, `pnpm run build:legacy`, `:core:jvmTest`, `:app:compileKotlinDesktop`, and `:app:compileKotlinWasmJs`. Fix the local Java 21 discovery issue by making the expected JDK path configurable through Gradle properties or documented `org.gradle.java.installations.paths`; do not loosen the toolchain requirement or mask compilation failures.

**Exit gate:** The matrix exists, all baseline failures are classified as source, environment, or expected warning, and CI has a reproducible JDK 21 setup.

### Milestone 1 — Build shared contracts before UI work

Add a small shared domain layer under `native/core/src/commonMain/kotlin/app/todotxt/core/` for the concepts currently duplicated or represented inconsistently:

| Contract | Proposed responsibility |
| --- | --- |
| `PlatformCapability` | `Supported`, `Adapted`, and `Unavailable(reason)` states for notifications, exact alarms, portable backup, drawing sync, and OS menu operations. |
| `TimerRuntime` | Pure elapsed/remaining calculations, pause/resume transitions, target completion, and clock-anomaly handling. Persist only idle snapshots as currently documented. |
| `RichTextDocument` | Markdown plus optional version/extension metadata, with a lossless fallback for marks the current editor cannot render. |
| `SceneDocument` | Versioned Excalidraw-compatible JSON envelope that preserves unknown fields/elements and gives the renderer a supported-element view. |
| `AiToolSpec` | Stable tool id, label, prompt instruction, input kind, output kind, and whether the operation is local, previewable, or destructive. |
| `TodoDocumentValidator` | Full-document validation and normalization before any AI or import result can replace the current task document. |

Keep `src/lib/core.ts` as the only legacy web import point for `@todotxt/core`. Regenerate and commit `native/core/npm-package/` after every shared-core change, as required by the branch instructions.

**Exit gate:** Shared-core unit tests pass on JVM and Wasm-compatible sources; no UI calls a feature-specific parser, timer calculator, or AI tool list directly.

### Milestone 2 — Implement one floating timer overlay everywhere

Create `native/app/src/commonMain/kotlin/app/todotxt/ui/timer/FloatingTimerOverlay.kt` and mount it in `AppRoot` above the workspace router. Reuse `Storage.timers` and the shared `TimerRuntime`; do not create a second persistence model.

The overlay must support multiple active timers, title, target/stopwatch display, pause/resume, reset, delete, completion feedback, keyboard focus, and drag positioning. Store the last valid in-app position per device, clamp it to the viewport, and avoid placing a full-screen pointer-input layer over the workspace. The overlay should use Material 3 semantic colors and dynamic error/urgent states rather than fixed hex colors.

On Android, this milestone means an in-app overlay. A system-level always-on-top window is a separate permission-gated feature and should not be implied by the in-app label. On Wasm, use the same overlay while the page is open and expose the closed-tab limitation in the capability UI. On desktop, provide the same in-window overlay and optionally add a later always-on-top toggle behind a platform capability check.

Add tests for stopwatch elapsed time, countdown remaining time, pause/resume accumulation, target auto-stop, clock rollback/forward, reload from idle snapshot, and simultaneous timers. Add Compose smoke checks proving that the overlay remains mounted when the workspace changes.

**Exit gate:** Switching among all workspaces never removes an active timer; state changes are reflected in one shared flow; overlay controls are keyboard and screen-reader discoverable.

### Milestone 3 — Make contrast and theming dynamic

Add a shared contrast utility in `native/core` or a common UI utility with these functions: parse valid 3/4/6/8-digit hex, convert sRGB to relative luminance, calculate contrast ratio, choose the stronger of theme-derived light/dark foreground candidates, and return a safe semantic fallback for invalid input.

Use it in `native/app/.../ui/notes/NotesPage.kt` for card title, body, placeholder, menu trigger, formatting preview, and color-picker selection states. Replace the hardcoded heading and bullet colors with blends derived from the card foreground or Material 3 semantic roles. Use the same algorithm in legacy React note cards so the rollback surface does not regress.

Use semantic Material 3 colors for KMP Draw’s selection accent, tool controls, borders, labels, and invalid-color fallback. Keep the actual Excalidraw stroke colors from the scene, but ensure control chrome and selection outlines remain readable in both light and dark themes. Add a visible swatch focus ring that is readable against every swatch.

Test every shipped note color, dark and light themes, arbitrary valid colors, invalid input, and the threshold boundary. The test must assert the final rendered foreground/background pairs, not only the helper’s preferred candidate.

**Exit gate:** No note or drawing control uses hardcoded black/white foreground assumptions; the automated contrast suite passes AA for normal text and large text thresholds.

### Milestone 4 — Bring Notes to a documented rich-text contract

Choose Markdown as the cross-platform interchange format because it already exists in the web editor and is portable. Define the supported common subset: paragraphs, headings 1–2, bold, italic, bullet lists, ordered lists, and task lists. Preserve unsupported TipTap marks/nodes in an extension payload rather than silently deleting them.

Implement a Compose editor component under `native/app/.../ui/notes/` with a toolbar matching the web labels and actions. Keep the storage model as `Note.content` plus a format/version marker if needed. Replace the current simplified `renderMarkdown` implementation and remove unused regex/local variables. Ensure title, content, color, pin, archive, delete, save, cancel, undo, and focus behavior are consistent.

In the legacy web app, map TipTap to the same Markdown contract on load/save. Add fixtures for each supported mark, nested list, task item, newline, empty document, and unsupported extension. Add a round-trip test: web export → KMP import → KMP save → web import must not lose supported content.

**Exit gate:** Notes have equivalent minimum editing capabilities and round-trip fixtures pass across the KMP core adapter and legacy web adapter.

### Milestone 5 — Converge Draw on one lossless scene model

Keep the existing preservation behavior but formalize it as `SceneDocument` with a schema version and explicit supported-element list. The renderer may support rectangle, ellipse, diamond, line, arrow, freedraw, and text initially, but unsupported elements must remain intact and visibly marked as preserved/read-only when the current surface cannot edit them.

Extract tool definitions, palette metadata, selection, and undo/redo semantics into shared data rather than keeping them as independent literals in `ExcalidrawDrawPage.kt`. Use dynamic theme colors for selection and UI chrome; preserve user stroke colors in the scene. Define a common save transaction that records the previous scene once per gesture, rather than writing on every pointer move without a corresponding stable history entry.

Add scene fixtures containing supported and unknown elements, invalid colors, opacity, deleted elements, and text. Verify that a KMP load/save cycle leaves unknown JSON keys and elements intact. Add cross-surface fixtures for KMP Draw and the legacy Excalidraw wrapper.

For drawing sync, either make the scene JSON the canonical shared representation for all surfaces or explicitly keep Draw device-local until a lossless common codec is available. The preferred fix is the versioned scene JSON path; do not silently translate native strokes into lossy Excalidraw data.

**Exit gate:** Draw no longer claims full parity unless the same scene fixture survives across surfaces; unsupported editing is explicit and non-destructive.

### Milestone 6 — Unify commands, menu visibility, and keyboard behavior

Create a shared command registry with stable ids such as `open-todo`, `open-notes`, `open-draw`, `open-timer`, `open-editor`, `toggle-menu`, `toggle-theme`, `undo`, `focus-search`, and `focus-quick-add`. The KMP command palette and legacy web command palette should render from the same ids/labels where possible.

Add a persisted `navigationChromeVisible` preference to common settings with a safe default of `true`. In KMP common UI, hide the navigation rail/bottom bar only when requested and show a fixed, keyboard-focusable restore affordance. In desktop `Main.kt`, bind the same preference to `MenuBar` visibility and tray actions; `Quit` must remain available in the tray and window-close path. In Wasm, implement the keyboard actual with browser key listeners and clean them up on disposal. Keep Android system back navigation and accessibility focus intact.

Do not advertise “hide menu bar” if only a window can be hidden. Use distinct labels for `Hide navigation`, `Show navigation`, `Hide OS menu`, and `Show OS menu` where the platform distinction matters.

**Exit gate:** The same command id can be triggered from palette, shortcut, and platform menu where supported; hiding chrome never traps the user without a restore path.

### Milestone 7 — Make reminders capability-based and honest

Define a shared reminder interface with `permissionState`, `requestPermission`, `scheduleDue`, `cancel`, and `capability`. Refresh permission state after the user grants permission instead of storing a one-time `mutableStateOf` snapshot.

On native Android, keep exact alarms and notification actions behind the existing platform implementation. On desktop, document whether reminders are notification-based or in-app only. On Wasm, schedule the next due task while the page is open, re-check on visibility/focus, and show a clear message that closed-tab delivery is not guaranteed. Do not map “exact alarm permission” directly to browser notification permission; expose them as separate capabilities. For browser habits, replace the silent no-op with an explicit “browser reminders require the page to remain open” state or an unavailable explanation.

Add fake-clock tests for due-now, future due, overdue, permission denied, permission granted after request, duplicate suppression, tab visibility refresh, and cancellation.

**Exit gate:** No reminder path silently does nothing; every platform reports its actual capability.

### Milestone 8 — Make AI behavior identical and safe to apply

Move the AI tool list and prompts into shared `AiToolSpec` data. Use the same ids, labels, model default, system contract, and output mode on native and legacy web. The system contract must require plain Todo.Txt lines, one task per line, preserved priorities/dates/projects/contexts, no invented metadata, and no Markdown wrapper.

Separate tool execution into `preview`, `validate`, and `apply`. `Cleanup Done` remains a deterministic local operation. For model output, show a diff, run `TodoDocumentValidator` over the complete output, reject fenced Markdown/commentary when the tool expects Todo.Txt, preserve the current document on failure, and require an explicit apply action. Do not accept an output merely because one line happens to parse.

Unify the transport shape behind a small client contract. Native may use Ktor and legacy web may use `fetch`, but both must share request fields, model names, error categories, cancellation, and redaction rules. Review credential persistence separately: the current branch documents that the GROQ key is synced through settings; change this to device-local storage or an OS credential store and migrate/delete the synced secret field. Show a one-time migration warning where needed.

Add tests for every tool, empty result, fenced result, malformed line, metadata preservation, duplicate lines, destructive cleanup, cancellation, API failure, and apply refusal.

**Exit gate:** Native and web produce equivalent prompts and validation decisions for the same input; no AI result can replace the document without a valid preview and explicit apply.

### Milestone 9 — Finish parity tests and release gates

Add a shared fixture directory for Todo.Txt documents, Notes Markdown, Draw scenes, timer transitions, commands, capability states, and AI outputs. Run the same fixture set through JVM and Wasm-compatible core adapters where possible.

Extend CI with a matrix or separate jobs for core JVM tests, desktop compilation, Wasm compilation, legacy web checks, and the production KMP/Wasm bundle. Keep `--max-workers=1` and bounded memory settings for the Wasm build. Add a smoke-test checklist for Android, desktop, browser, legacy web, and Tauri; platform screenshots are useful for menu, timer, notes, draw, and AI states.

**Release gate:** The branch may be called parity-complete only when every row in the matrix is `same` or `adapted` with an explicit capability explanation, all acceptance tests pass, and the production KMP/Wasm build succeeds from a clean checkout.

## 3. Priority and dependency summary

| Priority | Work | Depends on | Reason |
| --- | --- | --- | --- |
| P0 | Baseline matrix, Gradle/JDK reproducibility, shared contracts, dynamic contrast, floating timer | None | Prevents divergent fixes and addresses the most visible requested issues. |
| P1 | Notes rich editor, command registry/menu visibility, Wasm shortcuts, reminder capability API, AI schema/validation | Shared contracts | Closes the largest user-facing parity gaps and removes silent no-ops. |
| P1 | Draw scene contract and lossless fixtures | Shared contracts | Prevents data loss and makes the partial editor boundary explicit. |
| P2 | Unified transport, credential migration, desktop always-on-top timer, richer platform notifications | AI schema/capability API | Hardening and convenience after core parity is reliable. |
| P2 | Tauri adapter migration to the same commands, timer, notes, draw, and AI contracts | Shared contracts | Keeps the optional shell from becoming a third incompatible product. |

## 4. Suggested commit sequence

Use small, reviewable commits in this order:

1. `docs: add kmp parity matrix and platform capability contract`
2. `build: make JDK 21 discovery reproducible for native validation`
3. `core: add timer runtime, capability, document validation, and shared fixtures`
4. `ui: add common floating timer overlay`
5. `ui: make note and draw contrast dynamic`
6. `notes: implement shared markdown editor contract`
7. `draw: version and preserve the shared scene document`
8. `ui: unify commands, keyboard shortcuts, and menu visibility`
9. `platform: make reminder capability states explicit`
10. `ai: unify tool schema, validation, preview, and credential migration`
11. `test: add cross-surface parity fixtures and smoke gates`
12. `release: verify clean KMP/Wasm and legacy builds`

Each commit should pass the narrowest relevant tests and regenerate `native/core/npm-package/` whenever shared core code changes. Do not mix the previous `main`-branch UI changes into this branch until the KMP contracts are accepted.

## 5. References

[1]: https://github.com/todotxt/todo.txt "Todo.Txt format — canonical primer"
[2]: https://www.w3.org/WAI/WCAG22/Understanding/contrast-minimum "W3C WCAG 2.2 Understanding 1.4.3: Contrast (Minimum)"
