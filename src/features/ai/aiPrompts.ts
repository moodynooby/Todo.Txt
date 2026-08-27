import { parseTodoContent } from "@/lib/core";

export const AI_MODELS = [
	"llama-3.3-70b-versatile",
	"llama-3.1-8b-instant",
	"mixtral-8x7b-32768",
	"gemma2-9b-it",
];

export const TODO_AI_SYSTEM_PROMPT = [
	"You are Todo.Txt assistant. Return only plain Todo.Txt task lines, one task per line.",
	"Preserve every priority, creation/completion date, project, context, due: tag, and task meaning unless the selected tool explicitly changes it.",
	"Do not invent metadata. Do not return Markdown, headings, code fences, bullets, explanations, or a preamble.",
].join(" ");

export interface AiToolSpec {
	id: string;
	label: string;
	instruction: string;
	localOnly?: boolean;
	destructive?: boolean;
}

export const AI_TOOLS: AiToolSpec[] = [
	{
		id: "shorten",
		label: "Shorten",
		instruction: "Make each task concise while preserving its meaning.",
	},
	{
		id: "reduce",
		label: "Reduce",
		instruction:
			"Remove duplicates and non-essential tasks without inventing replacements.",
	},
	{
		id: "reformat",
		label: "Reformat",
		instruction:
			"Normalize priorities, projects, contexts, and due: metadata without changing task meaning.",
	},
	{
		id: "reorganize",
		label: "Reorganize",
		instruction:
			"Group tasks by priority and project while preserving every task.",
	},
	{
		id: "cleanup",
		label: "Cleanup Done",
		instruction: "Remove completed tasks.",
		localOnly: true,
		destructive: true,
	},
	{
		id: "grammar",
		label: "Fix Grammar",
		instruction:
			"Fix spelling and grammar in task text without changing metadata.",
	},
];

export interface TodoValidation {
	valid: boolean;
	normalized: string;
	error?: string;
}

export function validateAiTodoOutput(raw: string): TodoValidation {
	const normalized = raw.replace(/\r\n/g, "\n").trim();
	if (!normalized)
		return { valid: false, normalized, error: "The result is empty." };
	if (normalized.includes("```")) {
		return {
			valid: false,
			normalized,
			error: "Markdown code fences are not valid Todo.Txt output.",
		};
	}
	const lines = normalized.split("\n");
	if (lines.some((line) => line.trimStart().startsWith("#"))) {
		return {
			valid: false,
			normalized,
			error: "Markdown headings are not valid Todo.Txt output.",
		};
	}
	const parsed = parseTodoContent(normalized);
	if (
		parsed.tasks.length !==
		lines.filter((line) => line.trim().length > 0).length
	) {
		return {
			valid: false,
			normalized,
			error: "At least one output line could not be interpreted as a task.",
		};
	}
	return { valid: true, normalized };
}
