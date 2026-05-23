import { BookOpen, LogIn, Play } from "lucide-react";
import { useMemo } from "react";
import type { QuickAction } from "../types/ui";

interface UseQuickActionsProps {
	onStart: () => void;
	onConnect: () => void;
}

export const useQuickActions = ({
	onStart,
	onConnect,
}: UseQuickActionsProps): QuickAction[] =>
	useMemo(
		() => [
			{
				id: "start",
				icon: Play,
				title: "Start Writing",
				description: "Begin editing your todo list",
				action: onStart,
			},
			{
				id: "connect",
				icon: LogIn,
				title: "Sign in with Google",
				description: "Sync your todos across devices",
				action: onConnect,
			},
			{
				id: "help",
				icon: BookOpen,
				title: "Help",
				description: "Learn about the todo.txt format",
				action: () =>
					window.open("https://github.com/todotxt/todo.txt", "_blank"),
			},
		],
		[onStart, onConnect],
	);
