import { marked } from "marked";
import { type RefObject, useRef } from "react";

interface UseFileHandlerProps {
	setRteContent: (content: string) => void;
}

interface UseFileHandlerReturn {
	fileInputRef: RefObject<HTMLInputElement | null>;
	handleOpenRepo: () => void;
	handleFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export const useFileHandler = ({
	setRteContent,
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
				try {
					const html = marked.parse(result, { async: false }) as string;
					setRteContent(html);
				} catch {
					setRteContent(
						result
							.split("\n")
							.map((line) => `<p>${line}</p>`)
							.join(""),
					);
				}
			} else if (file.name.endsWith(".html")) {
				setRteContent(result);
			} else {
				setRteContent(
					result
						.split("\n")
						.map((line) => `<p>${line}</p>`)
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
