import Placeholder from "@tiptap/extension-placeholder";
import TaskItem from "@tiptap/extension-task-item";
import TaskList from "@tiptap/extension-task-list";
import { Markdown } from "@tiptap/markdown";
import StarterKit from "@tiptap/starter-kit";
import { TaskFilterExtension, TaskTaggingExtension } from "./taskExtensions";

interface EditorExtensionsOptions {
	headingLevels?: (1 | 2 | 3 | 4 | 5 | 6)[];
	placeholder?: string;
	onFilterClick?: (type: string, value: string) => void;
}

export const getEditorExtensions = ({
	headingLevels = [1, 2, 3, 4, 5, 6],
	placeholder = "Start writing...",
	onFilterClick,
}: EditorExtensionsOptions = {}) => [
	StarterKit.configure({
		heading: { levels: headingLevels },
		link: {
			openOnClick: false,
			HTMLAttributes: { rel: "noopener noreferrer" },
		},
	}),
	Placeholder.configure({ placeholder }),
	Markdown.configure({
		markedOptions: { gfm: true, breaks: true },
	}),
	TaskList,
	TaskItem.configure({ nested: true }),
	TaskFilterExtension,
	TaskTaggingExtension.configure({ onFilterClick }),
];
