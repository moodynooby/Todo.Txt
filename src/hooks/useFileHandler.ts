import { type RefObject, useRef } from "react";

interface QuillInstance {
	focus: () => void;
}

interface UseFileHandlerProps {
	setRteContent: (content: string) => void;
	quillInstanceRef?: React.RefObject<QuillInstance | null>;
}

interface UseFileHandlerReturn {
	fileInputRef: RefObject<HTMLInputElement | null>;
	handleOpenRepo: () => void;
	handleFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
	handleNewFile: () => void;
}

export const useFileHandler = ({
	setRteContent,
	quillInstanceRef,
}: UseFileHandlerProps): UseFileHandlerReturn => {
	const fileInputRef = useRef<HTMLInputElement>(null);

	const handleOpenRepo = (): void => {
		fileInputRef.current?.click();
	};

	const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
		const file = e.target.files?.[0];
		if (!file) return;
		const reader = new FileReader();
		reader.onload = (e) => {
			const content = e.target?.result as string;
			setRteContent(
				content
					.split("\n")
					.map((line) => `<p>${line}</p>`)
					.join(""),
			);
		};
		reader.readAsText(file);
	};

	const handleNewFile = (): void => {
		// Set to empty paragraph with space to dismiss welcome screen
		setRteContent("<p><br></p>");
		// Focus the Quill editor after creating a new file
		if (quillInstanceRef?.current) {
			quillInstanceRef.current.focus();
		}
	};

	return {
		fileInputRef,
		handleOpenRepo,
		handleFileChange,
		handleNewFile,
	};
};
