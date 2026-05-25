import { type RefObject, useRef } from "react";
import { escapeHtml } from "../utils/htmlUtils";

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
			if (file.name.endsWith(".md")) {
				onFileLoaded(result);
			} else if (file.name.endsWith(".html")) {
				onFileLoaded(result);
			} else {
				onFileLoaded(
					result
						.split("\n")
						.map((line) => `<p>${escapeHtml(line)}</p>`)
						.join(""),
				);
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
