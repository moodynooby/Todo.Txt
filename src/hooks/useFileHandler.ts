import { type RefObject, useRef } from "react";
import { escapeHtml } from "@/utils/html";

interface UseFileHandlerProps {
	onFileLoaded: (content: string) => void;
}

interface UseFileHandlerReturn {
	fileInputRef: RefObject<HTMLInputElement | null>;
	handleOpenRepo: () => void;
	handleFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export const useFileHandler = ({
	onFileLoaded,
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
			const result = e.target?.result;
			if (typeof result !== "string") return;

			if (file.name.endsWith(".html") || file.name.endsWith(".md")) {
				onFileLoaded(result);
			} else {
				// Escape plain text and wrap in paragraphs to prevent XSS
				const lines = result.split("\n");
				const escapedHtml = lines
					.map((line) => `<p>${escapeHtml(line)}</p>`)
					.join("");
				onFileLoaded(escapedHtml);
			}
		};
		reader.readAsText(file);
	};

	return {
		fileInputRef,
		handleOpenRepo,
		handleFileChange,
	};
};
