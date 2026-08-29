import type { Editor as TipTapEditor } from "@tiptap/core";
import {
	createContext,
	type ReactNode,
	useCallback,
	useContext,
	useEffect,
	useReducer,
	useRef,
	useState,
} from "react";

export interface TodoState {
	content: string;
	updated: number;
}

export type TodoAction = {
	type: "SET_CONTENT";
	payload: { content: string; timestamp?: number };
};

export function todoReducer(state: TodoState, action: TodoAction): TodoState {
	switch (action.type) {
		case "SET_CONTENT":
			return { ...state, content: action.payload.content, updated: Date.now() };
		default:
			return state;
	}
}

export const initialTodoState: TodoState = {
	content: "",
	updated: 0,
};

interface TodoContextValue {
	state: TodoState;
	editor: TipTapEditor | null;
	dispatchTodo: (action: TodoAction) => void;
	handleAiInsert: (text: string, mode: "replace" | "append") => void;
	requestEditor: () => void;
}

export const TodoContext = createContext<TodoContextValue | null>(null);

export const useTodoContext = (): TodoContextValue => {
	const ctx = useContext(TodoContext);
	if (!ctx) {
		throw new Error("useTodoContext must be used within TodoContext.Provider");
	}
	return ctx;
};

interface TodoProviderProps {
	children: ReactNode;
	initialContent?: string;
	onFilterClick?: (type: string, value: string) => void;
}

export function TodoProvider({
	children,
	initialContent = "",
	onFilterClick,
}: TodoProviderProps) {
	const [state, dispatchTodo] = useReducer(todoReducer, {
		...initialTodoState,
		content: initialContent,
	});

	const [editor, setEditor] = useState<TipTapEditor | null>(null);
	const [editorRequested, setEditorRequested] = useState(false);
	const lastMarkdownRef = useRef(state.content);

	// Keep the latest filter callback reachable from the creation effect
	// without recreating the editor when it changes identity.
	const onFilterClickRef = useRef(onFilterClick);
	onFilterClickRef.current = onFilterClick;

	const requestEditor = useCallback(() => setEditorRequested(true), []);

	/* The TipTap stack (~600 KB of editor + ProseMirror + extensions) is
	 * loaded only once something actually asks for the document — the todo
	 * page mounting or the AI dialog opening — so booting into notes,
	 * habits, excalidraw or sync never pays for it. */
	useEffect(() => {
		if (!editorRequested) return;
		let cancelled = false;

		void (async () => {
			const [{ Editor }, { getEditorExtensions }] = await Promise.all([
				import("@tiptap/core"),
				import("@/utils/editorExtensions"),
			]);
			if (cancelled) return;

			const instance = new Editor({
				extensions: getEditorExtensions({
					// Empty on purpose: EditorPlay renders its own warm cycling prompt as
					// empty-state art, and the static TipTap placeholder would compete
					// with it (TipTap's CSS ::before would show "Start writing..."
					// behind the 🌱 prompt while the doc is empty).
					placeholder: "",
					onFilterClick: (type, value) =>
						onFilterClickRef.current?.(type, value),
				}),
				content: lastMarkdownRef.current || "",
				contentType: "markdown",
				onUpdate: ({ editor: currentEditor }) => {
					const md = currentEditor.getMarkdown();
					// BUG FIX (previously silent): editor changes were only stored in a
					// local ref and never dispatched, so remote sync / backups saw stale
					// content while the editor looked up to date. Dispatching here keeps
					// the persisted state and the editor in sync.
					if (md !== lastMarkdownRef.current) {
						lastMarkdownRef.current = md;
						dispatchTodo({ type: "SET_CONTENT", payload: { content: md } });
					}
				},
			});
			setEditor(instance);
		})();

		return () => {
			cancelled = true;
		};
	}, [editorRequested]);

	/* Destroy exactly once on unmount; instance swaps go through setEditor. */
	const editorRef = useRef<TipTapEditor | null>(null);
	useEffect(() => {
		editorRef.current = editor;
	}, [editor]);
	useEffect(
		() => () => {
			editorRef.current?.destroy();
		},
		[],
	);

	useEffect(() => {
		// Only push remote/local state into the editor when the incoming
		// content actually differs from what the editor already holds; the
		// editor remains the single source of truth while the user types.
		//
		// Fix F12: `setContent` resets TipTap's undo history and selection on
		// every call, so a remote snapshot arriving mid-keystroke (another
		// device syncs while the user types) wiped the undo stack and could
		// jump the cursor. Deferring remote replacement until the editor is
		// not focused keeps in-progress editing untouched; the reducer state
		// is still authoritative, so the remote content lands as soon as the
		// user stops typing.
		if (
			editor &&
			state.content !== lastMarkdownRef.current &&
			!editor.isFocused
		) {
			lastMarkdownRef.current = state.content;
			editor.commands.setContent(state.content || "", {
				contentType: "markdown",
			});
		}
	}, [state.content, editor]);

	const handleAiInsert = useCallback(
		(text: string, mode: "replace" | "append") => {
			if (!editor) return;

			if (mode === "replace" && !editor.state.selection.empty) {
				editor.chain().focus().deleteSelection().insertContent(text).run();
			} else if (mode === "append") {
				editor.chain().focus().insertContent(`\n${text}`).run();
			} else {
				editor.chain().focus().setContent(text).run();
			}
		},
		[editor],
	);

	return (
		<TodoContext.Provider
			value={{ state, editor, dispatchTodo, handleAiInsert, requestEditor }}
		>
			{children}
		</TodoContext.Provider>
	);
}
