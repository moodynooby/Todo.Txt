import { useEffect } from "react";

interface KeyboardActions {
	[key: string]: () => void;
}

export const useKeyboardShortcuts = (actions: KeyboardActions): void => {
	useEffect(() => {
		const handleKeyDown = (e: KeyboardEvent): void => {
			if ((e.ctrlKey || e.metaKey) && !e.shiftKey && !e.altKey) {
				const key = e.key.toLowerCase();
				if (actions[key]) {
					e.preventDefault();
					actions[key]();
				}
			}
		};

		document.addEventListener("keydown", handleKeyDown);
		return () => document.removeEventListener("keydown", handleKeyDown);
	}, [actions]);
};
