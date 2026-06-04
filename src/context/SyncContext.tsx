import {
	createContext,
	type ReactNode,
	useCallback,
	useContext,
	useRef,
} from "react";
import { useAuthContext } from "@/context/AuthContext";
import { useEditorContext } from "@/context/EditorContext";
import { useNotesContext } from "@/context/NotesContext";
import { useFirestoreSync } from "@/hooks/useFirestoreSync";
import type { ExcalidrawData } from "@/lib/excalidrawSync";

interface SyncContextValue {
	connect: () => void;
	disconnect: () => void;
}

export const SyncContext = createContext<SyncContextValue | null>(null);

export const useSyncContext = (): SyncContextValue => {
	const ctx = useContext(SyncContext);
	if (!ctx) {
		throw new Error("useSyncContext must be used within SyncContext.Provider");
	}
	return ctx;
};

interface SyncProviderProps {
	children: ReactNode;
	excalidrawData: ExcalidrawData | null;
	groqApiKey: string;
	onExcalidrawChange: (data: ExcalidrawData | null) => void;
	onGroqApiKeyChange: (key: string) => void;
	onExternalContent: (html: string) => void;
}

export function SyncProvider({
	children,
	excalidrawData,
	groqApiKey,
	onExcalidrawChange,
	onGroqApiKeyChange,
	onExternalContent,
}: SyncProviderProps) {
	const { state: editorState, dispatchEditor } = useEditorContext();
	const { state: notesState, dispatchNotes } = useNotesContext();
	const { dispatchAuth } = useAuthContext();

	const onExcalidrawChangeRef = useRef(onExcalidrawChange);
	onExcalidrawChangeRef.current = onExcalidrawChange;
	const onGroqApiKeyChangeRef = useRef(onGroqApiKeyChange);
	onGroqApiKeyChangeRef.current = onGroqApiKeyChange;
	const onExternalContentRef = useRef(onExternalContent);
	onExternalContentRef.current = onExternalContent;

	const handleRemoteState = useCallback(
		(state: {
			content: string;
			notes?: import("@/types/notes").Note[];
			excalidraw?: ExcalidrawData | null;
			groqApiKey?: string;
		}) => {
			if (state.content !== undefined) {
				dispatchEditor({
					type: "SYNC_COMPLETE",
					payload: {
						content: state.content,
						timestamp: Date.now(),
					},
				});
				onExternalContentRef.current(state.content);
			}
			if (state.notes !== undefined) {
				dispatchNotes({ type: "SET_NOTES", payload: state.notes });
			}
			if (state.excalidraw !== undefined) {
				onExcalidrawChangeRef.current(state.excalidraw);
			}
			if (state.groqApiKey !== undefined) {
				onGroqApiKeyChangeRef.current(state.groqApiKey);
			}
		},
		[dispatchEditor, dispatchNotes],
	);

	const handleAuthChange = useCallback(
		(auth: {
			user: {
				photoURL: string | null;
				displayName: string | null;
				isAnonymous: boolean;
			} | null;
			isConnected: boolean;
			syncStatus: import("@/hooks/useFirestoreSync").SyncStatus;
			authError: string | null;
		}) => {
			dispatchAuth({ type: "SET_USER", payload: auth.user });
			dispatchAuth({ type: "SET_CONNECTED", payload: auth.isConnected });
			dispatchAuth({ type: "SET_SYNC_STATUS", payload: auth.syncStatus });
			if (auth.authError) {
				dispatchAuth({ type: "SET_ERROR", payload: auth.authError });
			}
		},
		[dispatchAuth],
	);

	const sync = useFirestoreSync({
		localState: {
			content: editorState.content,
			notes: notesState.notes,
			excalidraw: excalidrawData,
			groqApiKey,
		},
		onRemoteState: handleRemoteState,
		onAuthChange: handleAuthChange,
	});

	return (
		<SyncContext.Provider
			value={{ connect: sync.connect, disconnect: sync.disconnect }}
		>
			{children}
		</SyncContext.Provider>
	);
}
