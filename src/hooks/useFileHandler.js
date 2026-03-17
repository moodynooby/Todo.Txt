import { useRef } from "react";

export const useFileHandler = ({ setRteContent, setShowWelcome }) => {
	const fileInputRef = useRef(null);

	const handleOpenRepo = () => {
		fileInputRef.current?.click();
	};

	const handleFileChange = (e) => {
		const file = e.target.files[0];
		if (!file) return;
		const reader = new FileReader();
		reader.onload = (e) => {
			const content = e.target.result;
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

	const handleNewFile = () => {
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
