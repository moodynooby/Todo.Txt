# Agent Guidelines for Todo.Txt

## Commands

| Action | Command |
|--------|---------|
| dev server | `npm run dev` |
| build | `npm run build` |
| preview | `npm run preview` |
| lint + format | `npm run lint` (biome check --write) |
| format only | `npm run format` |
| typecheck | `npm run typecheck` (tsc --noEmit) |
| full check | `npm run check` (lint + typecheck) |

No test framework is set up.
USE PNPM TO INSTALL DEPENDENCIES
## Stack

- **Framework**: React 19 + Vite + TypeScript (strict, `noUnusedLocals`/`noUnusedParameters`)
- **UI**: Mantine 9 (uses `cssVariablesResolver` for v8 compat), dark mode default
- **Editor**: TipTap (rich text) with Markdown extension
- **Drawing**: Excalidraw integrated
- **AI**: GROQ via `@ai-sdk/groq` (`useAiGroq.ts`)
- **Formatting**: Biome — tabs, double quotes, organize imports on save

## Architecture

- Entry: `src/index.tsx` → `src/App.tsx`
- Two view modes: `"text"` (TipTap) and `"excalidraw"` (drawing), saved in localStorage key `viewMode`
- Todo content stored in localStorage key `rteContent`
- Tasks parsed from plain text following todo.txt format (priority `(A)`, projects `+project`, contexts `@context`, due dates)
- File save supports markdown, plain text, and HTML (via file-saver)

## Key shortcuts (App.tsx)

- `Ctrl+O` — open `.txt` file
- `Ctrl+M` — save as markdown
- `Ctrl+T` — save as plain text
- `Ctrl+H` — save as HTML
