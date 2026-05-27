import Link from "@tiptap/extension-link";
import Placeholder from "@tiptap/extension-placeholder";
import TaskItem from "@tiptap/extension-task-item";
import TaskList from "@tiptap/extension-task-list";
import Underline from "@tiptap/extension-underline";
import { Markdown } from "@tiptap/markdown";
import StarterKit from "@tiptap/starter-kit";

interface EditorExtensionsOptions {
	headingLevels?: (1 | 2 | 3 | 4 | 5 | 6)[];
	placeholder?: string;
}

export const getEditorExtensions = ({
	headingLevels = [1, 2, 3, 4, 5, 6],
	placeholder = "Start writing...",
}: EditorExtensionsOptions = {}) => [
	StarterKit.configure({
		heading: { levels: headingLevels },
	}),
	Placeholder.configure({ placeholder }),
	Markdown.configure({
		markedOptions: { gfm: true, breaks: true },
	}),
	Link.configure({
		openOnClick: false,
		HTMLAttributes: { rel: "noopener noreferrer" },
	}),
	Underline,
	TaskList,
	TaskItem.configure({ nested: true }),
];
