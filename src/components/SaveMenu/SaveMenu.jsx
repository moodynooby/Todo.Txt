import { ChevronDown, Code, File, FileText, Save } from "lucide-react";
import PropTypes from "prop-types";
import { useState } from "react";

const SaveMenu = ({ onSave }) => {
	const [isOpen, setIsOpen] = useState(false);

	const saveOptions = [
		{
			id: "markdown",
			label: "Save as Markdown",
			icon: FileText,
			action: () => onSave("markdown"),
			shortcut: "Ctrl+M",
		},
		{
			id: "text",
			label: "Save as Text",
			icon: File,
			action: () => onSave("text"),
			shortcut: "Ctrl+T",
		},
		{
			id: "html",
			label: "Save as HTML",
			icon: Code,
			action: () => onSave("html"),
			shortcut: "Ctrl+H",
		},
	];

	const handleSave = (action) => {
		action();
		setIsOpen(false);
	};

	return (
		<div className="relative">
			<button
				onClick={() => setIsOpen(!isOpen)}
				className="btn btn-primary btn-sm flex items-center gap-2"
				aria-label="Save options"
				aria-expanded={isOpen}
				aria-haspopup="true"
			>
				<Save className="w-4 h-4" />
				Save
				<ChevronDown className="w-4 h-4" />
			</button>

			{isOpen && (
				<>
					<div
						className="fixed inset-0 z-10"
						onClick={() => setIsOpen(false)}
						aria-hidden="true"
					/>
					<div className="absolute top-full mt-2 right-0 bg-base-100 border border-base-300 rounded-lg shadow-lg z-20 min-w-[200px]">
						<div className="p-1">
							{saveOptions.map((option) => {
								const Icon = option.icon;
								return (
									<button
										key={option.id}
										onClick={() => handleSave(option.action)}
										className="w-full flex items-center gap-3 px-3 py-2 rounded-md hover:bg-base-200 transition-colors text-left group"
									>
										<Icon className="w-4 h-4 text-base-content/70 group-hover:text-base-content" />
										<div className="flex-1">
											<div className="text-sm font-medium">{option.label}</div>
										</div>
										<kbd className="text-xs px-2 py-1 bg-base-200 rounded border border-base-300">
											{option.shortcut}
										</kbd>
									</button>
								);
							})}
						</div>
					</div>
				</>
			)}
		</div>
	);
};

SaveMenu.propTypes = {
	onSave: PropTypes.func.isRequired,
};

export default SaveMenu;
