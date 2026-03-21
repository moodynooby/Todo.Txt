import { BookOpen, FilePlus, Paperclip } from "lucide-react";
import { useMemo } from "react";
import type { QuickAction } from "../types/ui";

interface UseQuickActionsProps {
	onNewFile: () => void;
	onOpenFile: () => void;
}

export const useQuickActions = ({
	onNewFile,
	onOpenFile,
}: UseQuickActionsProps): QuickAction[] =>
	useMemo(
		() => [
			{
				id: "new-file",
				icon: FilePlus,
				title: "New File",
				description: "Create a new todo.txt file",
				action: onNewFile,
			},
			{
				id: "open-repo",
				icon: Paperclip,
				title: "Open File",
				description: "Open an existing todo.txt file",
				action: onOpenFile,
			},
			{
				id: "help",
				icon: BookOpen,
				title: "Documentation",
				description: "Learn about todo.txt format",
				action: () =>
					window.open("https://github.com/todotxt/todo.txt", "_blank"),
			},
		],
		[onNewFile, onOpenFile],
	);
