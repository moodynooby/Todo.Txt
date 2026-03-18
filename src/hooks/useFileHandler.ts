import { type RefObject, useRef } from "react";

interface UseFileHandlerProps {
	setRteContent: (content: string) => void;
	setShowWelcome: (show: boolean) => void;
}

interface UseFileHandlerReturn {
	fileInputRef: RefObject<HTMLInputElement | null>;
	handleOpenRepo: () => void;
	handleFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
	handleNewFile: () => void;
}

export const useFileHandler = ({
	setRteContent,
	setShowWelcome,
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
			setShowWelcome(false);
		};
		reader.readAsText(file);
	};

	const handleNewFile = (): void => {
		setRteContent("");
		setShowWelcome(false);
	};

	return {
		fileInputRef,
		handleOpenRepo,
		handleFileChange,
		handleNewFile,
	};
};
