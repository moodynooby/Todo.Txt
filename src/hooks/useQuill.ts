import Quill from "quill";
import QuillMarkdown from "quilljs-markdown";
import { type RefObject, useEffect, useRef } from "react";

const toolbarOptions: unknown[] = [
	[{ header: [1, 2, 3, false] }],
	["bold", "italic", "underline", "strike"],
	[{ list: "ordered" }, { list: "bullet" }],
	["blockquote", "code-block"],
	[{ script: "sub" }, { script: "super" }],
	[{ indent: "-1" }, { indent: "+1" }],
	[{ direction: "rtl" }],
	[{ color: [] }, { background: [] }],
	[{ font: [] }],
	[{ align: [] }],
	["link", "image", "video"],
	["clean"],
];

interface UseQuillProps {
	viewMode: string;
	activeFilter: unknown | null;
	initialContent: string;
	onContentChange: (content: string) => void;
}

interface UseQuillReturn {
	quillContainerRef: RefObject<HTMLDivElement | null>;
	quillInstanceRef: RefObject<Quill | null>;
}

export const useQuill = ({
	viewMode,
	activeFilter,
	initialContent,
	onContentChange,
}: UseQuillProps): UseQuillReturn => {
	const quillContainerRef = useRef<HTMLDivElement>(null);
	const quillInstanceRef = useRef<Quill | null>(null);

	useEffect(() => {
		const handleTextChange = (): void => {
			if (quillInstanceRef.current) {
				onContentChange(quillInstanceRef.current.root.innerHTML);
			}
		};

		if (quillContainerRef.current && viewMode === "text" && !activeFilter) {
			if (!quillInstanceRef.current) {
				const quill = new Quill(quillContainerRef.current, {
					modules: {
						toolbar: toolbarOptions,
					},
					theme: "snow",
					placeholder: "Start writing your todos...",
				});
				quillInstanceRef.current = quill;
				new QuillMarkdown(quill, {});

				if (initialContent) {
					quill.clipboard.dangerouslyPasteHTML(initialContent);
				}

				quill.on("text-change", handleTextChange);
			}
		}

		return () => {
			if (quillInstanceRef.current && (viewMode !== "text" || activeFilter)) {
				quillInstanceRef.current.off("text-change", handleTextChange);
				quillInstanceRef.current = null;
				if (quillContainerRef.current) {
					quillContainerRef.current.innerHTML = "";
					const toolbar = quillContainerRef.current.previousElementSibling;
					if (toolbar?.classList?.contains("ql-toolbar")) {
						toolbar.remove();
					}
				}
			}
		};
	}, [viewMode, activeFilter, onContentChange, initialContent]);

	return { quillContainerRef, quillInstanceRef };
};
