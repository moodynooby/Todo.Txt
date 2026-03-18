import {
	Check,
	CircleSlash,
	Eraser,
	LayoutList,
	Loader2,
	MessageSquare,
	RefreshCw,
	Scissors,
	Settings,
	Shrink,
	Sparkles,
	X,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useAiGroq } from "../../hooks/useAiGroq";

interface AiToolsDialogProps {
	isOpen: boolean;
	onClose: () => void;
	initialContent: string;
	onInsert: (text: string, mode: "replace" | "append") => void;
}

const AI_TOOLS = [
	{
		id: "shorten",
		label: "Shorten",
		icon: Scissors,
		prompt:
			"Make the following text more concise while preserving its core meaning.",
	},
	{
		id: "reduce",
		label: "Reduce",
		icon: Shrink,
		prompt:
			"Reduce the content length significantly without losing the essential points.",
	},
	{
		id: "reformat",
		label: "Reformat",
		icon: RefreshCw,
		prompt:
			"Reformat the following todo list into a cleaner, more readable structure. Follow todo.txt conventions.",
	},
	{
		id: "reorganize",
		label: "Reorganize",
		icon: LayoutList,
		prompt:
			"Group related tasks together and reorganize the following list logically.",
	},
	{
		id: "cleanup",
		label: "Cleanup Done",
		icon: Eraser,
		prompt:
			"Identify and remove all completed tasks (those starting with 'x '). Return the remaining list.",
	},
	{
		id: "grammar",
		label: "Fix Grammar",
		icon: Check,
		prompt:
			"Correct grammatical errors and improve the clarity of the following text.",
	},
];

const AiToolsDialog = ({
	isOpen,
	onClose,
	initialContent,
	onInsert,
}: AiToolsDialogProps) => {
	const dialogRef = useRef<HTMLDialogElement>(null);
	const {
		apiKey,
		saveApiKey,
		generate,
		isLoading,
		error: apiError,
	} = useAiGroq();

	const [view, setView] = useState<"tools" | "settings">("tools");
	const [keyInput, setKeyInput] = useState(apiKey);
	const [customPrompt, setCustomPrompt] = useState("");
	const [result, setResult] = useState("");
	const [activeTool, setActiveTool] = useState<string | null>(null);

	useEffect(() => {
		if (isOpen) {
			dialogRef.current?.showModal();
			if (!apiKey) setView("settings");
		} else {
			dialogRef.current?.close();
		}
	}, [isOpen, apiKey]);

	const handleSaveKey = () => {
		saveApiKey(keyInput);
		setView("tools");
	};

	const handleToolClick = async (promptTemplate: string, toolId: string) => {
		setActiveTool(toolId);
		const fullPrompt = `${promptTemplate}\n\nCONTENT:\n${initialContent}`;
		const output = await generate(fullPrompt);
		if (output) setResult(output);
	};

	const handleCustomPrompt = async () => {
		if (!customPrompt.trim()) return;
		const fullPrompt = `${customPrompt}\n\nCONTENT:\n${initialContent}`;
		const output = await generate(fullPrompt);
		if (output) setResult(output);
	};

	const handleClose = () => {
		setResult("");
		onClose();
	};

	return (
		<dialog ref={dialogRef} className="modal" onClose={handleClose}>
			<div className="modal-box w-11/12 max-w-3xl h-[80vh] flex flex-col p-0 overflow-hidden bg-base-100 shadow-2xl rounded-2xl border border-base-300">
				{/* Header */}
				<div className="flex items-center justify-between p-4 border-b border-base-300 bg-base-200/50">
					<div className="flex items-center gap-2">
						<Sparkles className="text-primary" size={20} />
						<h3 className="font-bold text-lg">AI Tools (Groq)</h3>
					</div>
					<div className="flex items-center gap-2">
						<button
							type="button"
							className={`btn btn-sm btn-ghost ${view === "settings" ? "text-primary" : ""}`}
							onClick={() =>
								setView(view === "settings" ? "tools" : "settings")
							}
							title="Settings"
						>
							<Settings size={18} />
						</button>
						<button
							type="button"
							className="btn btn-sm btn-circle btn-ghost"
							onClick={handleClose}
						>
							<X size={20} />
						</button>
					</div>
				</div>

				<div className="flex-1 overflow-auto p-6 space-y-6">
					{view === "settings" ? (
						<div className="space-y-4 max-w-md mx-auto py-8">
							<div className="text-center mb-6">
								<h4 className="font-bold text-xl mb-2">Groq API Key</h4>
								<p className="text-sm opacity-60">
									Enter your Groq Cloud API key to enable AI tools. Your key is
									stored locally in your browser.
								</p>
							</div>
							<div className="form-control">
								<label className="label cursor-pointer flex-col items-start gap-2">
									<span className="label-text">API Key</span>
									<input
										type="password"
										className="input input-bordered w-full"
										placeholder="gsk_..."
										value={keyInput}
										onChange={(e) => setKeyInput(e.target.value)}
									/>
									<span className="label-text-alt">
										Get one at{" "}
										<a
											href="https://console.groq.com/keys"
											target="_blank"
											rel="noreferrer"
											className="link link-primary"
										>
											console.groq.com
										</a>
									</span>
								</label>
							</div>
							<button
								type="button"
								className="btn btn-primary w-full"
								onClick={handleSaveKey}
							>
								Save & Continue
							</button>
						</div>
					) : (
						<>
							{/* API Key missing warning */}
							{!apiKey && (
								<div className="alert alert-warning shadow-sm">
									<CircleSlash size={20} />
									<div>
										<h3 className="font-bold">Missing API Key</h3>
										<div className="text-xs">
											Please configure your Groq API key in settings.
										</div>
									</div>
									<button
										type="button"
										className="btn btn-sm"
										onClick={() => setView("settings")}
									>
										Fix
									</button>
								</div>
							)}

							{/* Actions Grid */}
							<div className="grid grid-cols-2 md:grid-cols-3 gap-3">
								{AI_TOOLS.map((tool) => (
									<button
										key={tool.id}
										type="button"
										disabled={!apiKey || isLoading}
										onClick={() => handleToolClick(tool.prompt, tool.id)}
										className={`btn btn-soft h-auto py-4 flex flex-col gap-2 border-base-300 transition-all ${
											activeTool === tool.id ? "btn-primary ring-2" : ""
										}`}
									>
										<tool.icon size={20} />
										<span className="text-xs font-medium">{tool.label}</span>
									</button>
								))}
							</div>

							{/* Custom Prompt */}
							<div className="form-control bg-base-200 p-4 rounded-xl border border-base-300">
								<label className="label pt-0 cursor-pointer flex-col items-start gap-4">
									<span className="label-text font-bold flex items-center gap-2">
										<MessageSquare size={14} /> Custom Prompt
									</span>
									<div className="flex gap-2 w-full">
										<input
											type="text"
											className="input input-bordered flex-1"
											placeholder="e.g., Translate to Spanish, extract dates..."
											value={customPrompt}
											onChange={(e) => setCustomPrompt(e.target.value)}
											onKeyDown={(e) =>
												e.key === "Enter" && handleCustomPrompt()
											}
											disabled={!apiKey || isLoading}
										/>
										<button
											type="button"
											className="btn btn-primary"
											onClick={handleCustomPrompt}
											disabled={!apiKey || isLoading}
										>
											{isLoading ? (
												<Loader2 size={18} className="animate-spin" />
											) : (
												<Sparkles size={18} />
											)}
										</button>
									</div>
								</label>
							</div>

							{/* Results Section */}
							{(result || isLoading || apiError) && (
								<div className="space-y-3">
									<div className="flex justify-between items-center">
										<h4 className="text-sm font-bold uppercase tracking-wider opacity-60">
											Result Preview
										</h4>
										{isLoading && (
											<span className="loading loading-dots loading-sm text-primary" />
										)}
									</div>

									{apiError && (
										<div className="alert alert-error text-xs p-3">
											{apiError}
										</div>
									)}

									{result && (
										<div className="relative group">
											<pre className="p-4 bg-base-300 rounded-xl overflow-x-auto whitespace-pre-wrap text-sm font-mono border border-base-300 max-h-60 overflow-y-auto">
												{result}
											</pre>
											<div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
												<button
													type="button"
													className="btn btn-xs btn-primary shadow-lg"
													onClick={() => onInsert(result, "replace")}
												>
													Replace Selection
												</button>
												<button
													type="button"
													className="btn btn-xs btn-outline btn-primary bg-base-100 shadow-lg"
													onClick={() => onInsert(result, "append")}
												>
													Append
												</button>
											</div>
										</div>
									)}
								</div>
							)}
						</>
					)}
				</div>

				{/* Footer */}
				<div className="p-4 bg-base-200/50 border-t border-base-300 flex justify-end gap-2">
					<button type="button" className="btn btn-ghost" onClick={handleClose}>
						Cancel
					</button>
					<button
						type="button"
						className="btn btn-primary"
						disabled={!result}
						onClick={() => onInsert(result, "replace")}
					>
						Apply Changes
					</button>
				</div>
			</div>
			<form method="dialog" className="modal-backdrop">
				<button type="button" onClick={handleClose}>
					close
				</button>
			</form>
		</dialog>
	);
};

export default AiToolsDialog;
