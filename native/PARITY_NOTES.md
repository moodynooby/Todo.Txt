# Web App Feature Inventory → Kotlin Native Parity Notes

This document records every feature of the React/Vite web app (removed from the
working copy of the `native/kotlin-compose` branch) so that missing functionality
can be planned for the Kotlin Compose Multiplatform native app.

Current state of the Kotlin native app (as of this writing): Todo workspace,
Habits workspace (streaks, heatmap, reminders via Android AlarmManager), Notes
workspace (markdown-ish), Draw workspace (custom canvas strokes), Timer
workspace (pomodoro-style), AI tools (Groq via Ktor), Glance widgets,
Desktop system tray, local-first file/DataStore persistence, and the shared
`todotxt-core` module (JVM + JS).

## Features observed in the web app

| Area | Web feature | Notes for Kotlin native |
|------|-------------|------------------------|
| Todo | todo.txt parser + advanced parser (`utils/todoParser.ts`, `utils/advancedParser.ts`) | Parser ported; advanced parser variants not yet evaluated for parity |
| Todo | Filters (projects/contexts/priority/due), SmartSuggestionChips | Filters ported; suggestion chips pending |
| Todo | Bulk actions, task extensions (`taskExtensions.ts`) | Partially ported |
| Todo | QuickAddBar | Not ported |
| Todo | Drag-and-drop reorder | Not ported |
| Todo | Import/export, documentExport.ts, backups (`todoBackup.ts`) | Export not ported |
| Habits | Streaks, best streak, momentum, heatmap | Ported (in shared core) |
| Habits | Reminders: web push + Android exact alarms + Tauri notifications | Native reminders ported (Android); web push not applicable |
| Notes | Rich text editor (TipTap markdown/task-list), NoteCard, sections, color dots | Notes workspace exists; TipTap-grade rich editing not ported |
| Notes | Notes backup (`notesBackup.ts`) | Not ported |
| Draw | Excalidraw canvas embed (`@excalidraw/excalidraw`) with persistence | Native Draw workspace uses simple canvas; full Excalidraw parity not ported |
| Timer | Pomodoro timer with beep sound (`beep.ts`), fullscreen | Timer ported; sound/fullscreen pending |
| AI | AI tools dialog (`AiToolsDialog.tsx`, `useAiGroq.ts`, `@ai-sdk/groq`) | Groq tools ported to Kotlin via Ktor |
| Auth/Sync | Firebase Auth (`AuthContext.tsx`, `SignInModal.tsx`) | Not applicable to local-first native; optionally add account sync later |
| Auth/Sync | Firestore sync (`firestoreClient.ts`, `syncAdapters.ts`, `useSyncedDocument.ts`) | Local-first chosen; sync layer optional future work |
| Shell | Tauri desktop wrapper (`src-tauri/`, plugins: deep-link, global-shortcut, notification, store, window-state) | Compose Desktop chosen instead of Tauri; deep-link/global-shortcut available on desktop |
| Shell | Vite PWA, service worker, installable web app, share targets | N/A for native |
| UI | Mantine 9 with M3 Expressive theme (`theme/m3Theme.ts`) | Ported to Compose M3 Expressive |
| UI | 3D icon assets, custom fonts (WinkySans, ZillaSlab), EditorPlay/PetStrip decorations | Theme ported; decorative assets optional |
| UI | Sidebar with tips panel, view switcher, bottom nav, header actions | Ported equivalents exist |
| Widgets | Native widget sync bridge (`useWidgetSync.ts`, `widgetDataBridge.ts`) | Glance widgets implemented on Android |
| Infra | Exact alarms permission flow, fullscreen, error boundary | Native equivalents on Android |

## Items explicitly NOT carried over (by design)

- Firebase auth/Firestore cloud sync (local-first is the native app's model)
- Tauri shell (Compose Desktop replaces it)
- PWA/service-worker/share-targets (native app replaces it)
- Excalidraw dependency (native Draw is a lightweight canvas; Excalidraw is
  web-only)

## Gap priority for Kotlin native (proposed)

1. Quick-add bar + bulk actions for Todo
2. Drag-and-drop reorder for tasks
3. Import/export of todo.txt and backups
4. TipTap-grade rich notes editing
5. Timer sound + fullscreen
6. Suggestion chips / advanced parser coverage
7. Deep-link + global shortcut support on desktop
