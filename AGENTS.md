# Agent Guidelines for Todo.Txt
Check Docs in /LLMS.TXT/
WHEN MOVING FILES USE git mv
CHECK DOCS ON STRUCUTRE IN @IdealStructure.md first before adding new files
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

- **Framework**: React 19 + Vite + TypeScript 
- **UI**: Mantine 9 
- **Editor**: TipTap (rich text) with Markdown extension
- **Drawing**: Excalidraw integrated
- **AI**: GROQ via `@ai-sdk/groq` (`useAiGroq.ts`)
