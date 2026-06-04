import type { Editor } from "@tiptap/core";
import { createContext, type ReactNode, useContext, useReducer } from "react";
import type { SyncStatus } from "@/hooks/useFirestoreSync";

export interface EditorContextValue {
	editor: Editor | null;
	addTimer: () => void;
	onSave: (format: "markdown" | "text" | "html") => void;
	onOpen: () => void;
	onAiTools: () => void;
	syncStatus: SyncStatus;
	isSynced: boolean;
	user: {
		photoURL: string | null;
		displayName: string | null;
		isAnonymous: boolean;
	} | null;
	authError: string | null;
	viewMode: string;
}

export const EditorContext = createContext<EditorContextValue | null>(null);

export const useEditor = (): EditorContextValue => {
	const ctx = useContext(EditorContext);
	if (!ctx) {
		throw new Error("useEditor must be used within EditorContext.Provider");
	}
	return ctx;
};

// ── State Management (useReducer) ───────────────────────────────────────────

export interface EditorState {
	syncStatus: SyncStatus;
	lastSyncAt: number | null;
	content: string;
}

export type EditorAction =
	| { type: "SYNC_START" }
	| { type: "SYNC_COMPLETE"; payload: { content: string; timestamp: number } }
	| { type: "SYNC_ERROR" };

export function editorReducer(
	state: EditorState,
	action: EditorAction,
): EditorState {
	switch (action.type) {
		case "SYNC_START":
			return { ...state, syncStatus: "syncing" };
		case "SYNC_COMPLETE":
			return {
				...state,
				syncStatus: "synced",
				lastSyncAt: action.payload.timestamp,
				content: action.payload.content,
			};
		case "SYNC_ERROR":
			return { ...state, syncStatus: "error" };
		default:
			return state;
	}
}

export const initialEditorState: EditorState = {
	syncStatus: "disconnected",
	lastSyncAt: null,
	content: "",
};

interface EditorStateContextValue {
	state: EditorState;
	dispatchEditor: (action: EditorAction) => void;
}

export const EditorStateContext = createContext<EditorStateContextValue | null>(
	null,
);

export const useEditorContext = (): EditorStateContextValue => {
	const ctx = useContext(EditorStateContext);
	if (!ctx) {
		throw new Error(
			"useEditorContext must be used within EditorStateContext.Provider",
		);
	}
	return ctx;
};

interface EditorStateProviderProps {
	children: ReactNode;
	initialContent?: string;
}

export function EditorStateProvider({
	children,
	initialContent = "",
}: EditorStateProviderProps) {
	const [state, dispatchEditor] = useReducer(editorReducer, {
		...initialEditorState,
		content: initialContent,
	});

	return (
		<EditorStateContext.Provider value={{ state, dispatchEditor }}>
			{children}
		</EditorStateContext.Provider>
	);
}
