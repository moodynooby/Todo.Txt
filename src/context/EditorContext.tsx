import type { Editor } from "@tiptap/core";
import { createContext, useContext } from "react";
import type { SyncStatus } from "@/hooks/useFirestoreSync";

export interface EditorContextValue {
	editor: Editor | null;
	addTimer: () => void;
	onSave: (format: "markdown" | "text" | "html") => void;
	onOpen: () => void;
	onAiTools: () => void;
	sidebarCollapsed: boolean;
	onToggleSidebar: () => void;
	syncStatus: SyncStatus;
	isSynced: boolean;
	user: {
		photoURL: string | null;
		displayName: string | null;
		isAnonymous: boolean;
	} | null;
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
