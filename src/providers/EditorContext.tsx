import type { Editor } from "@tiptap/core";
import { createContext, useContext } from "react";
import type { SyncStatus } from "../hooks/useFirestoreSync";
import type { QuickAction } from "../types/ui";

export interface EditorContextValue {
	editor: Editor | null;
	onSave: (format: "markdown" | "text" | "html") => void;
	onOpen: () => void;
	onAiTools: () => void;
	sidebarCollapsed: boolean;
	onToggleSidebar: () => void;
	quickActions: QuickAction[];
	syncStatus: SyncStatus;
	isSynced: boolean;
	onConnect: () => void;
	onDisconnectSync: () => void;
}

export const EditorContext = createContext<EditorContextValue | null>(null);

export const useEditor = (): EditorContextValue => {
	const ctx = useContext(EditorContext);
	if (!ctx) {
		throw new Error("useEditor must be used within EditorContext.Provider");
	}
	return ctx;
};
