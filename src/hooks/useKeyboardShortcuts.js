import { useEffect } from "react";

export const useKeyboardShortcuts = (actions) => {
	useEffect(() => {
		const handleKeyDown = (e) => {
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
