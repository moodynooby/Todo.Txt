import {
	ActionIcon,
	Alert,
	Badge,
	Button,
	Divider,
	Grid,
	Group,
	Loader,
	Modal,
	Paper,
	PasswordInput,
	Stack,
	Text,
	TextInput,
	ThemeIcon,
	Title,
} from "@mantine/core";
import {
	Check,
	Eraser,
	LayoutList,
	ListChecks,
	Sparkles,
	TextCursorInput,
	WrapText,
} from "lucide-react";
import { useState } from "react";
import { useAiGroq } from "../../hooks/useAiGroq";

interface AiToolsDialogProps {
	isOpen: boolean;
	onClose: () => void;
	initialContent: string;
	onInsert: (text: string, mode: "replace" | "append") => void;
}

interface AiTool {
	id: string;
	label: string;
	icon: React.ElementType;
	prompt: string;
}

const AI_TOOLS: AiTool[] = [
	{
		id: "shorten",
		label: "Shorten",
		icon: TextCursorInput,
		prompt:
			"Make the following text more concise while preserving its core meaning.",
	},
	{
		id: "reduce",
		label: "Reduce",
		icon: WrapText,
		prompt:
			"Reduce the content length significantly without losing the essential points.",
	},
	{
		id: "reformat",
		label: "Reformat",
		icon: ListChecks,
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
		setActiveTool(null);
		onClose();
	};

	return (
		<Modal
			opened={isOpen}
			onClose={handleClose}
			title={
				<Group gap="xs">
					<Sparkles size={20} />
					<Title order={4}>AI Tools (Groq)</Title>
				</Group>
			}
			size="lg"
		>
			<Stack gap="md">
				{view === "settings" ? (
					<Stack gap="md" py="md">
						<Text ta="center" size="sm" c="dimmed">
							Enter your Groq Cloud API key to enable AI tools. Your key is
							stored locally.
						</Text>
						<PasswordInput
							label="API Key"
							placeholder="gsk_..."
							value={keyInput}
							onChange={(e) => setKeyInput(e.currentTarget.value)}
							description={
								<Text
									component="a"
									href="https://console.groq.com/keys"
									target="_blank"
									rel="noreferrer"
									size="xs"
								>
									Get one at console.groq.com
								</Text>
							}
						/>
						<Button onClick={handleSaveKey} fullWidth>
							Save & Continue
						</Button>
					</Stack>
				) : (
					<>
						{!apiKey && (
							<Alert
								color="yellow"
								title="Missing API Key"
								withCloseButton
								onClose={() => setView("settings")}
							>
								Please configure your Groq API key to use AI tools.
							</Alert>
						)}

						<Grid>
							{AI_TOOLS.map((tool) => {
								const Icon = tool.icon;
								const isActive = activeTool === tool.id;
								return (
									<Grid.Col key={tool.id} span={{ base: 6, sm: 4 }}>
										<Paper
											p="md"
											withBorder
											style={{
												cursor: apiKey ? "pointer" : "not-allowed",
												opacity: apiKey ? 1 : 0.6,
											}}
											onClick={() =>
												apiKey &&
												!isLoading &&
												handleToolClick(tool.prompt, tool.id)
											}
										>
											<Stack align="center" gap="xs">
												<ThemeIcon
													variant={isActive ? "filled" : "light"}
													size="lg"
													color={isActive ? "violet" : "gray"}
												>
													<Icon size={20} />
												</ThemeIcon>
												<Text size="xs" fw={500}>
													{tool.label}
												</Text>
											</Stack>
										</Paper>
									</Grid.Col>
								);
							})}
						</Grid>

						<Paper p="md" withBorder>
							<Stack gap="sm">
								<Text size="sm" fw={600}>
									Custom Prompt
								</Text>
								<Group gap="sm">
									<TextInput
										flex={1}
										placeholder="e.g., Translate to Spanish, extract dates..."
										value={customPrompt}
										onChange={(e) => setCustomPrompt(e.currentTarget.value)}
										onKeyDown={(e) => e.key === "Enter" && handleCustomPrompt()}
										disabled={!apiKey || isLoading}
									/>
									<ActionIcon
										variant="filled"
										size="lg"
										onClick={handleCustomPrompt}
										disabled={!apiKey || isLoading || !customPrompt.trim()}
									>
										{isLoading ? <Loader size={18} /> : <Sparkles size={18} />}
									</ActionIcon>
								</Group>
							</Stack>
						</Paper>

						{(result || isLoading || apiError) && (
							<Stack gap="sm">
								<Group justify="space-between">
									<Text size="sm" fw={600} tt="uppercase" c="dimmed">
										Result Preview
									</Text>
									{isLoading && (
										<Badge color="violet" leftSection={<Loader size={10} />}>
											Processing
										</Badge>
									)}
								</Group>

								{apiError && (
									<Alert color="red" title="Error">
										{apiError}
									</Alert>
								)}

								{result && (
									<Paper
										p="md"
										withBorder
										style={{
											position: "relative",
											maxHeight: 240,
											overflow: "auto",
										}}
									>
										<Text
											component="pre"
											size="sm"
											style={{
												fontFamily: "monospace",
												whiteSpace: "pre-wrap",
												margin: 0,
											}}
										>
											{result}
										</Text>
										<Group gap="xs" mt="sm">
											<Button
												size="xs"
												onClick={() => onInsert(result, "replace")}
											>
												Replace
											</Button>
											<Button
												size="xs"
												variant="light"
												onClick={() => onInsert(result, "append")}
											>
												Append
											</Button>
										</Group>
									</Paper>
								)}
							</Stack>
						)}

						<Divider />

						<Group justify="flex-end">
							<Button variant="subtle" onClick={handleClose}>
								Cancel
							</Button>
							<Button
								disabled={!result}
								onClick={() => onInsert(result, "replace")}
							>
								Apply Changes
							</Button>
						</Group>
					</>
				)}
			</Stack>
		</Modal>
	);
};

export default AiToolsDialog;
