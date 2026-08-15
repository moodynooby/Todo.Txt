# Todo.Txt Design System

## Purpose

Todo.Txt is a personal workspace for **doing, remembering, reflecting, and sketching**. Its visual system, named **Field Notes Ritual**, brings Todo, Notes, Drawing, and Habits into one calm, tactile product language while leaving every feature’s state, shortcuts, data shape, and interaction contract unchanged.

> The visual system should make everyday work feel grounded and legible. It must never compete with a task, a note, a drawing, or a habit check-in.

| Design quality | Practical expression |
| --- | --- |
| Grounded | Warm paper-like canvases and evergreen anchors replace generic cold surfaces. |
| Focused | A deliberate type scale, generous whitespace, and small labels establish hierarchy without visual noise. |
| Evidence-based | Progress, selected states, and alerts use semantic color rather than decorative color. |
| Familiar | Repeated surface, control, and motion rules make switching workspaces feel continuous. |

## Design Foundations

### Color Roles

The app uses semantic **roles** rather than page-specific hex values. The roles are defined in `src/styles/App.css` and implemented in the Mantine theme in `src/context/MantineProvider.tsx`.

| Role | Token family | Intent |
| --- | --- | --- |
| Canvas | `--app-canvas`, `--app-canvas-strong` | The quiet background behind an entire workspace. |
| Surface | `--app-surface`, `--app-surface-raised`, `--app-surface-muted` | Cards, sidebars, toolbar groups, and secondary panels. |
| Ink | `--app-ink`, `--app-ink-muted`, `--app-ink-faint` | Hierarchy for headings, body text, metadata, and inactive controls. |
| Evergreen | `--app-evergreen-*` | Primary actions, selected navigation, productive states, and focus. |
| Terracotta | `--app-terracotta-*` | Momentum, due emphasis, and one-time celebratory signals. |
| Border and shadow | `--app-border`, `--app-border-strong`, `--app-shadow-*` | Subtle material definition without heavy outlines. |

Use the **semantic role** in new components. Do not copy a color from an existing workspace. A note may still keep its user-selected color, but its chrome should use the shared surface, ink, border, and action styles.

### Typography

`WinkySans` is the durable interface voice for labels, controls, task content, and note text. `ZillaSlab` is the reflective display voice for workspace titles, page-level questions, and compact metric callouts.

| Level | Font and usage |
| --- | --- |
| Display | `ZillaSlab`, normal weight, tight tracking; use for titles and meaningful summaries only. |
| Interface body | `WinkySans`, medium-to-regular weight; use for controls and primary reading. |
| Eyebrow | `WinkySans`, 10–11px, 0.12–0.15em tracking, uppercase; use before a title to orient the user. |
| Metadata | `WinkySans`, 12–13px, muted ink; use for quiet supporting information. |
| Code and task syntax | Existing monospace stack; retain this for Todo.Txt syntax and export-friendly content. |

### Shape, Spacing, and Depth

The system uses a **softly squared** geometry: `12px` for controls, `16px` for standard surfaces, and larger radii only for hero panels or floating actions. Use the `--app-space-*` scale rather than ad-hoc values when styling shared components. Shadows should suggest a sheet lifted from a desk, never a floating glass panel.

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
| `.app-floating-action` | Primary circular action with consistent elevation and feedback. | Add note and mobile Todo filters. |
| `.app-interactive-row` | Compact list surface with a non-disruptive hover response. | Habit rows and Todo filters. |

## Workspace Application

| Workspace | Shared system application | Feature behavior that must remain unchanged |
| --- | --- | --- |
| Todo | Header, sidebar, rich-text editor shell, filter controls, tags, and floating filter action inherit the shared canvas, ink, borders, and evergreen actions. | Task parsing, filtering, editing, exporting, AI actions, timers, and all keyboard behavior. |
| Notes | Header/search region, note cards, pin/archive actions, and empty state adopt the same surfaces, typography, and floating-action treatment. | Note creation, editing, color selection, pinning, archiving, deletion, search, and sync. |
| Drawing | Excalidraw receives the evergreen palette through CSS variables and sits in a shared workspace canvas. | Canvas data, menu actions, rendering, autosave, and fullscreen behavior. |
| Habits | Existing field-notes dashboard becomes the reference implementation and consumes the same tokens rather than isolated values. | Habit creation, completion, archiving, deletion, reminders, analytics, backup, and sync. |

## Interaction and Accessibility Rules

Interactions should be brief, physical, and reversible. Hover feedback uses a small color, border, or `transform` change; press feedback may scale to `0.97`. Regular transitions should stay between 120ms and 220ms using the shared ease-out curve. No informational state relies on color alone, and every theme surface must preserve readable foreground contrast.

Respect `prefers-reduced-motion` by disabling non-essential entrance and hover motion. Keyboard navigation and existing Mantine focus indicators remain intact; the theme only refines their color and outline weight.

## Implementation Guardrails

1. Change reusable theme tokens in `MantineProvider.tsx` and `App.css` before styling a workspace.
2. Prefer shared classes and Mantine component defaults over inline visual styles. Inline styles are reserved for dynamic data, such as a user-selected note or habit color.
3. Do not add page-specific state merely to support a visual effect.
4. Keep user-authored content, Todo.Txt syntax, drawing strokes, and imported/exported documents visually legible in both color schemes.
5. When an element does not fit an existing primitive, add a clearly named shared primitive first instead of duplicating a page-local treatment.

## Review Checklist

Before a visual change is merged, confirm that all workspaces share canvas, surface, typography, focus, and motion rules; all feature interactions still work; compact viewports preserve access to primary actions; and the dark and light color schemes remain coherent.
