# KMP/Wasm browser smoke test

Date: 2026-08-27

The production KMP build was served from `dist` at `http://127.0.0.1:4173/` and opened successfully in Chromium. The page title was `Todo.Txt`, the rendered screenshot showed the unified **Capture** home with Home/Todos/Habits/Notes/Draw/Timer/AI/Editor/Sync navigation and task/note capture controls, and Chromium reported no page syntax error during navigation.

The runtime console probe confirmed `window.__TODO_TXT_FIREBASE_API_KEY__` was `"test"`, `window.__TODO_TXT_FIREBASE_PROJECT_ID__` was `"test-project"`, and localStorage write/read/remove succeeded. A direct `document.querySelector("canvas")` probe returned false because Compose owns the canvas inside a shadow root; a follow-up DOM probe found one canvas in a descendant shadow root. The settled console inspection showed no uncaught runtime error output. This should be described as a confirmed shadow-DOM canvas, not as a missing canvas.
