# KMP UI parity audit

## Browser capture

The published KMP/Wasm distribution rendered successfully in headless Chromium at 1440×1000 after serving the `dist` directory itself. The Home/Capture screen showed the expected left navigation (Home, Todos, Habits, Notes, Draw, Timer, AI, Editor, Sync), a clear Capture card with Task/Note mode controls, disabled Save for an empty draft, and Open tasks/Recent notes preview sections. The initial blank screenshot came from accidentally serving the repository root instead of `dist`; the corrected published distribution rendered normally.

The Chromium log contained only expected headless-environment DBus and software-WebGL warnings. No application JavaScript syntax or load error appeared. The shell contained valid injected Firebase assignments and no unresolved placeholders.

## Source-level findings fixed during this audit

- KMP Todo filters now use legacy-compatible value-specific priority, project, context, due-date, Done, and Pending filters rather than type-only flags.
- The KMP Todo export-format dialog is now reachable from the export menu.
- A shared KMP dependency analyzer and Compose inspector now cover `id:`, `after:`, `blocks:`, cycles, missing references, and active/blocked/completed states.
- KMP common tests cover dependency graphs, stable line IDs, Todo filters, Markdown export, and escaped HTML export.
- KMP Sync now exposes password-reset email flow and create-account confirmation validation.

## Remaining parity items to audit

The legacy web surface still has capabilities that require explicit comparison or platform-specific implementation: command palette and shortcut cheatsheet, Google sign-in, floating draggable timers with persisted positions and ring visualization, and full Excalidraw actions such as scene loading/search/save-as-image/fullscreen. These should not be claimed as 1:1 until verified or documented as platform constraints.

## Full-size Todos capture

The Todos screen rendered with a clear header, visible `Dependencies` action, share/import-export action, quick-add field and add button, search field, completion toggle, filter chips, clear-completed affordance, empty-state art, and the existing floating quick-add affordance. The layout is legible at 1440 px and controls are not clipped. With an empty document, dynamic project/context/due chips correctly do not appear; only All/Done/Pending are shown.

## Interaction captures

The final production bundle opened the dependency inspector from the Todos header. The empty-document dialog clearly displayed `Task dependencies`, `Graph valid`, and `No tasks in the current document`, with a usable Close action and no clipping.

The Todos import/export affordance was also opened successfully. The screenshot confirms the share control is clickable and visually distinct; the menu interaction completed without triggering a download. The final Sync screenshot now shows `Signed out` rather than `Disabled`, confirming the Wasm launcher starts the account-sync lifecycle and recognizes non-empty injected Firebase configuration.
