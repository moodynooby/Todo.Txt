# Todo.Txt Design System

## Purpose

Todo.Txt is a personal workspace for **doing, remembering, reflecting, and sketching**. Its visual system, named **Field Notes Ritual**, brings Todo, Notes, Drawing, and Habits into one calm, tactile product language while leaving every feature's state, shortcuts, data shape, and interaction contract unchanged.

> The visual system should make everyday work feel grounded and legible. It must never compete with a task, a note, a drawing, or a habit check-in.

| Design quality | Practical expression |
| --- | --- |
| Grounded | Warm paper-like canvases and evergreen anchors replace generic cold surfaces. |
| Focused | A deliberate type scale, generous whitespace, and small labels establish hierarchy without visual noise. |
| Evidence-based | Progress, selected states, and alerts use semantic color rather than decorative color. |
| Familiar | Repeated surface, control, and motion rules make switching workspaces feel continuous. |
| **Expressive** (Material 3) | Variety of shapes, emphasized moments, and fluid spring-based motion make the system feel alive without becoming loud. |

The system is now expressed on **Material 3 Expressive** principles, implemented entirely through the Mantine theming engine (`src/theme/m3Theme.ts`). This gives the Field Notes Ritual voice — warm paper surfaces, evergreen anchors, and field-note typography — a modern, adaptive shape.

## Design Foundations

### Color Roles

The app uses semantic **roles** rather than page-specific hex values. The roles are defined in `src/styles/App.css` and implemented in the Mantine theme in `src/theme/m3Theme.ts`.

| Role | Token family | Intent |
| --- | --- | --- |
| Canvas | `--app-canvas`, `--app-canvas-strong` | The quiet background behind an entire workspace. |
| Surface | `--app-surface`, `--app-surface-raised`, `--app-surface-muted` | Cards, sidebars, toolbar groups, and secondary panels. |
| Ink | `--app-ink`, `--app-ink-muted`, `--app-ink-faint` | Hierarchy for headings, body text, metadata, and inactive controls. |
| Evergreen | `--app-evergreen-*` / Mantine `evergreen` scale | Primary actions, selected navigation, productive states, and focus. |
| Terracotta | `--app-terracotta-*` / Mantine `terracotta` scale | Momentum, due emphasis, and one-time celebratory signals. |
| Honey (M3 additive) | Mantine `honey` scale | Warm emphasis for momentum cues such as streaks and daily progress. |
| Border and shadow | `--app-border`, `--app-border-strong`, `--app-shadow-*` | Subtle material definition without heavy outlines. |

Use the **semantic role** in new components. Do not copy a color from an existing workspace. A note may still keep its user-selected color, but its chrome should use the shared surface, ink, border, and action styles. Colors are referenced through the Mantine theme — e.g., `var(--mantine-color-evergreen-7)` — never as inline hex values.

### Typography

`WinkySans` is the durable interface voice for labels, controls, task content, and note text. `ZillaSlab` is the reflective display voice for workspace titles, page-level questions, and compact metric callouts. Both are registered on the Mantine theme (`fontFamily` for body, `headings.fontFamily` for the display stack), so `Title` and `Text` components inherit them automatically.

| Level | Font and usage |
| --- | --- |
| Display | `ZillaSlab`, normal weight, tight tracking; use for titles and meaningful summaries only. |
| Interface body | `WinkySans`, medium-to-regular weight; use for controls and primary reading. |
| Eyebrow | `WinkySans`, 10–11px, 0.12–0.15em tracking, uppercase; use before a title to orient the user. |
| Metadata | `WinkySans`, 12–13px, muted ink; use for quiet supporting information. |
| Code and task syntax | Existing monospace stack; retain this for Todo.Txt syntax and export-friendly content. |

### Shape

Material 3 Expressive leads with a **varied shape vocabulary**, and the system expresses it as a named scale consumed through the theme and the `--m3-radius-*` tokens:

| Token | Value | Usage |
| --- | --- | --- |
| `theme.radius.xs` / `--m3-radius-xs` | 4px | Small interactive details |
| `theme.radius.sm` | 8px | Compact controls and icons |
| `theme.radius.md` (default) | 12px | Standard controls: buttons, inputs, icons |
| `theme.radius.lg` | 16px | Standard surfaces: cards, modals, editor canvas |
| `theme.radius.xl` | 20px | Elevated surfaces: modal content, pills, quick-add bar |
| `theme.radius.xxl` | 28px | Bottom sheets and large overlay panels |
| `theme.radius.full` / `--m3-radius-pill` | 9999px | Fully rounded: FABs, badges, chip-style inputs |

Controls stay gently squared while hero moments — the floating action buttons, badges, and search inputs — go fully rounded, giving the interface its Expressive "shape contrast".

### Spacing

Use the Mantine `spacing` scale (`xs` 4 · `sm` 8 · `md` 12 · `lg` 16 · `xl` 24 · `xxl` 32) rather than ad-hoc values. Page shell gutters use `clamp()` for fluid scaling between mobile and desktop.

### Depth

Shadows suggest a sheet lifted from a desk, never a floating glass panel. The Mantine theme defines `xs`–`xl` shadow steps that pages consume via style props (`shadow="sm"` on the editor surface, `shadow="md"` on the quick-add bar).

### Motion

Motion uses spring-inspired curves defined as theme tokens and exposed as `--m3-ease-*` CSS variables:

| Token | Curve | Usage |
| --- | --- | --- |
| `--m3-ease-spatial-fast` / `theme.transition.timingFunction.spatial` | overshoot (1.275) | Fast position/radius motion, presses |
| `--m3-ease-spatial` / default | soft overshoot (1.18) | Default layout motion (drawers, sheets) |
| `--m3-ease-spatial-slow` | gentle overshoot (1.12) | Large slow layout motion |
| `--m3-ease-effects` / default | ease-out, no overshoot | Color, opacity, and border motion |

Regular transitions stay inside 120–220ms. Overshooting springs are reserved for element motion (the FAB press scales to 0.95, the drawer slides up with a soft spring). Respect `prefers-reduced-motion` by disabling non-essential entrance and hover motion.

## Material 3 Expressive Additions

### Dynamic and Semantic Color

The Mantine theme declares three 10-shade color scales (`evergreen`, `terracotta`, `honey`). Any control can reference an arbitrary shade — `color="evergreen"` with `variant="light"` auto-derives background, border, and text shades from the component variant, which is the Mantine equivalent of M3 dynamic tonal mapping. Pages never hardcode hex values; they use `var(--mantine-color-<scale>-<shade>)`.

### Containment and Hero Moments

Expressive design isolates moments of emphasis. The Todo workspace has exactly two: the **quick-add bar** (the fastest path to a new todo) and the **primary FAB** on Notes. Both use fully rounded geometry, elevated shadow, and springy press feedback. Everything else stays quiet.

### Adaptive Toolbars

On narrow viewports (<640px), the editor toolbar collapses to the essentials; rich formatting remains reachable through keyboard shortcuts. On desktop the full control group is available.

## Shared Layout Primitives

The following classes are the common visual vocabulary. They are intentionally CSS-only so existing feature components can adopt them without acquiring new state or behavior.

| Primitive | Purpose | Typical users |
| --- | --- | --- |
| `.app-workspace` | Full workspace canvas with a quiet texture and scrolling behavior. | Notes, Habits, Drawing wrapper. |
| `.app-workspace-shell` | Constrained, responsive content frame. | Page headers, analytics, note grid. |
| `.app-surface` | Standard card or sidebar surface. | Notes cards, Todo sidebar, info panels. |
| `.app-surface-muted` | Lower-emphasis secondary surface. | Context panels, empty states, drawing controls. |
| `.app-eyebrow` | Small orientation label above an editorial title. | Workspace headers and sections. |
| `.app-display-title` | Consistent Zilla Slab display title. | Notes and Habits headings. |
| `.app-floating-action` | Secondary circular action with consistent elevation and springy feedback. | Mobile Todo filters. |
| `.app-floating-action-primary` | **M3 primary FAB**: 56px fully rounded, evergreen-8, elevated, springy press. | Add note, add todo. |
| `.app-interactive-row` | Compact list surface with a non-disruptive hover response. | Habit rows and Todo filters. |

## Workspace Application

| Workspace | Shared system application | Feature behavior that must remain unchanged |
| --- | --- | --- |
| Todo | Header, sidebar, quick-add bar, adaptive toolbar, raised editor surface, filter controls, tags, and mobile bottom-sheet filters inherit the shared canvas, ink, borders, and evergreen actions. | Task parsing, filtering, editing, exporting, AI actions, timers, and all keyboard behavior. |
| Notes | Header/search region, rounded note cards, pin/archive actions, and empty state adopt the same surfaces, typography, and floating-action treatment. | Note creation, editing, color selection, pinning, archiving, deletion, search, and sync. |
| Drawing | Excalidraw receives the evergreen palette through CSS variables and sits in a shared workspace canvas. | Canvas data, menu actions, rendering, autosave, and fullscreen behavior. |
| Habits | Existing field-notes dashboard becomes the reference implementation and consumes the same tokens rather than isolated values. | Habit creation, completion, archiving, deletion, reminders, analytics, backup, and sync. |

## Interaction and Accessibility Rules

Interactions should be brief, physical, and reversible. Hover feedback uses a small color, border, or `transform` change; press feedback may scale to 0.95–0.97 with the spatial-fast spring. Regular transitions stay between 120ms and 220ms using the shared ease-out curve. No informational state relies on color alone, and every theme surface must preserve readable foreground contrast.

Respect `prefers-reduced-motion` by disabling non-essential entrance and hover motion. Keyboard navigation and existing Mantine focus indicators remain intact; the theme only refines their color and outline weight. Touch targets follow Android conventions: 44–48px minimum for primary actions, with the FAB anchored bottom-right and filter affordances promoted to bottom sheets on mobile.

## The Editor / Todo-Item View

The editor view is the app's fastest path from intention to task. Its redesign follows three rules:

1. **One hero input.** The sticky quick-add bar (`src/components/QuickAddBar.tsx`) is the single place to create a task. It accepts standard todo.txt syntax in the same line — `+project`, `@context`, `(A)`, `due:today` — so users learn nothing new. Enter commits; the bar stays focused on typing.
2. **The writing surface is sacred.** It sits in a raised, rounded container with a soft shadow, surrounded by empty margin on all sides. The toolbar floats above it and collapses on narrow screens.
3. **Filters are a secondary flow.** On desktop they live in the sidebar with a spring-animated toggle; on mobile they open in a fully rounded bottom sheet (drawer `position: bottom`, `radius: xxl`) anchored behind the filter FAB.

## Implementation Guardrails

1. Change reusable theme tokens in `src/theme/m3Theme.ts` and `App.css` before styling a workspace.
2. Prefer shared classes and Mantine component defaults over inline visual styles. Inline styles are reserved for dynamic data, such as a user-selected note or habit color.
3. Do not add page-specific state merely to support a visual effect.
4. Keep user-authored content, Todo.Txt syntax, drawing strokes, and imported/exported documents visually legible in both color schemes.
5. When an element does not fit an existing primitive, add a clearly named shared primitive first instead of duplicating a page-local treatment.

## Review Checklist

Before a visual change is merged, confirm that all workspaces share canvas, surface, typography, focus, and motion rules; all feature interactions still work; compact viewports preserve access to primary actions; and the dark and light color schemes remain coherent.
