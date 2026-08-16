import { useEditor } from "@tiptap/react";
import {
	createContext,
	type ReactNode,
	useContext,
	useEffect,
	useReducer,
	useRef,
} from "react";
import { getEditorExtensions } from "@/utils/editorExtensions";

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
	editor: import("@tiptap/core").Editor | null;
	dispatchTodo: (action: TodoAction) => void;
	handleAiInsert: (text: string, mode: "replace" | "append") => void;
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

	const lastMarkdownRef = useRef(state.content);
	const editor = useEditor({
		extensions: getEditorExtensions({
			// Empty on purpose: EditorPlay renders its own warm cycling prompt as
			// empty-state art, and the static TipTap placeholder would compete
			// with it (TipTap's CSS ::before would show "Start writing..."
			// behind the 🌱 prompt while the doc is empty).
			placeholder: "",
			onFilterClick,
		}),
		content: state.content || "",
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
		immediatelyRender: false,
	});

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

	const handleAiInsert = (text: string, mode: "replace" | "append") => {
		if (!editor) return;

		if (mode === "replace" && !editor.state.selection.empty) {
			editor.chain().focus().deleteSelection().insertContent(text).run();
		} else if (mode === "append") {
			editor.chain().focus().insertContent(`\n${text}`).run();
		} else {
			editor.chain().focus().setContent(text).run();
		}
	};

	return (
		<TodoContext.Provider
			value={{ state, editor, dispatchTodo, handleAiInsert }}
		>
			{children}
		</TodoContext.Provider>
	);
}
