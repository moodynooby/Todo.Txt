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
}

export type TodoAction = {
	type: "SET_CONTENT";
	payload: { content: string; timestamp: number };
};

export function todoReducer(state: TodoState, action: TodoAction): TodoState {
	switch (action.type) {
		case "SET_CONTENT":
			return { ...state, content: action.payload.content };
		default:
			return state;
	}
}

export const initialTodoState: TodoState = {
	content: "",
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
			placeholder: "Start writing your todos...",
			onFilterClick,
		}),
		content: state.content || "",
		contentType: "markdown",
		onUpdate: ({ editor: currentEditor }) => {
			const md = currentEditor.getMarkdown();
			lastMarkdownRef.current = md;
		},
		immediatelyRender: false,
	});

	useEffect(() => {
		if (editor && state.content !== lastMarkdownRef.current) {
			lastMarkdownRef.current = state.content;
			editor.commands.setContent(state.content || "");
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
