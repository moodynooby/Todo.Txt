/** Field Notes Ritual: native side of "Mark done" for todo editor tasks.
 *
 * Listens for `native-reminder-action` events dispatched from
 * `src/lib/nativeReminders.ts` (the OS notification action buttons) and
 * rewrites the todo document so the matching task line flips to complete.
 * Web/PWA builds: this hook does nothing outside Tauri.
 */

import { useCallback, useEffect } from "react";
import { useTodoContext } from "@/context/TodoContext";
import { isTauri, type ReminderActionKind } from "@/lib/nativeReminders";
import { setLineCompleted } from "@/lib/todoLineCompletion";

export function useTodoNativeActions() {
	const { state, dispatchTodo } = useTodoContext();

	const handleAction = useCallback(
		(event: Event) => {
			const payload = (event as CustomEvent<ReminderActionKind>).detail;
			if (payload.kind !== "mark-done-todo") return;
			// Rewrite the source document so the parsed state reflects the
			// completed task (the TipTap editor mirrors this content on the
			// next reconciliation; the line-index mapping comes from
			// `src/utils/todoParser.ts`, so it stays in sync with what the
			// user is actually looking at).
			dispatchTodo({
				type: "SET_CONTENT",
				payload: {
					content: setLineCompleted(state.content, payload.line, true),
					timestamp: Date.now(),
				},
			});
		},
		[dispatchTodo, state.content],
	);

	useEffect(() => {
		if (!isTauri()) return;
		window.addEventListener("native-reminder-action", handleAction);
		return () =>
			window.removeEventListener("native-reminder-action", handleAction);
	}, [handleAction]);
}
