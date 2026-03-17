import Quill from "quill";
import QuillMarkdown from "quilljs-markdown";
import { useEffect, useRef } from "react";

const toolbarOptions = [
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

export const useQuill = ({
	viewMode,
	activeFilter,
	initialContent,
	onContentChange,
}) => {
	const quillContainerRef = useRef(null);
	const quillInstanceRef = useRef(null);

	useEffect(() => {
		const handleTextChange = () => {
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
				if (typeof quillInstanceRef.current.destroy === "function") {
					quillInstanceRef.current.destroy();
				}
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
	}, [viewMode, activeFilter, onContentChange]);

	return { quillContainerRef, quillInstanceRef };
};
