import {
	Button,
	Code,
	Group,
	Popover,
	Stack,
	Text,
	Tooltip,
} from "@mantine/core";
import type { Editor as TipTapEditor } from "@tiptap/core";
import { CalendarClock, Repeat2 } from "lucide-react";
import { useState } from "react";
import {
	parseRecurringScheduleExpression,
	parseRelativeDateExpression,
	parseTaskMetadata,
	type RecurrenceRule,
} from "@/utils/advancedParser";

interface SmartSuggestionChipsProps {
	editor: TipTapEditor;
}

interface Suggestion {
	label: string;
	value: string;
	description: string;
	icon: "calendar" | "repeat";
}

type Preview =
	| {
			kind: "relative";
			value: string;
			date: Date;
	  }
	| {
			kind: "recurrence";
			value: string;
			rule: RecurrenceRule;
	  }
	| {
			kind: "error";
			value: string;
			message: string;
	  };

const SUGGESTIONS: Suggestion[] = [
	{
		label: "In 3 days",
		value: "in 3 days",
		description: "Schedule this task three calendar days from today",
		icon: "calendar",
	},
	{
		label: "In 2 weeks",
		value: "in 2 weeks",
		description: "Schedule this task two weeks from today",
		icon: "calendar",
	},
	{
		label: "Every Monday",
		value: "every Monday",
		description: "Create a weekly Monday recurrence",
		icon: "repeat",
	},
	{
		label: "2nd Tue at 3pm",
		value: "every 2nd Tuesday at 3pm",
		description: "Create a monthly recurrence on the second Tuesday at 3pm",
		icon: "repeat",
	},
	{
		label: "Workdays",
		value: "rec:workdays",
		description:
			"Keep the recurrence on weekdays and move weekend results to Monday",
		icon: "repeat",
	},
	{
		label: "From completion",
		value: "rec:completion",
		description: "Anchor the next recurrence to the completion date",
		icon: "repeat",
	},
];

function insertSuggestion(editor: TipTapEditor, value: string) {
	const { from, to } = editor.state.selection;
	const selectedText = editor.state.doc.textBetween(from, to, "");
	const characterBefore = editor.state.doc.textBetween(
		Math.max(1, from - 1),
		from,
		"",
	);
	const separator =
		selectedText || !characterBefore || /\s/.test(characterBefore) ? "" : " ";

	editor.chain().focus().insertContent(`${separator}${value}`).run();
}

function parseSuggestion(value: string): Preview {
	const relative = parseRelativeDateExpression(value);
	if (relative) {
		return { kind: "relative", value, date: relative.date };
	}

	const recurring = parseRecurringScheduleExpression(value);
	if (recurring) {
		return { kind: "recurrence", value, rule: recurring.rule };
	}

	const metadata = parseTaskMetadata(value);
	if (metadata.recurrence) {
		return {
			kind: "recurrence",
			value,
			rule: metadata.recurrence,
		};
	}

	return {
		kind: "error",
		value,
		message: "This shortcut could not be parsed.",
	};
}

function formatDate(date: Date) {
	return new Intl.DateTimeFormat(undefined, {
		weekday: "short",
		year: "numeric",
		month: "short",
		day: "numeric",
	}).format(date);
}

function formatOrdinal(value: number) {
	const suffix =
		value % 100 >= 11 && value % 100 <= 13
			? "th"
			: (["th", "st", "nd", "rd"][value % 10] ?? "th");
	return `${value}${suffix}`;
}

function weekdayName(day: number) {
	return (
		[
			"Sunday",
			"Monday",
			"Tuesday",
			"Wednesday",
			"Thursday",
			"Friday",
			"Saturday",
		][day] ?? "weekday"
	);
}

function describeRecurrence(rule: RecurrenceRule) {
	if (rule.nthWeekday) {
		return `Monthly on the ${formatOrdinal(rule.nthWeekday.n)} ${weekdayName(rule.nthWeekday.day)}`;
	}

	if (rule.byDay && rule.byDay.length > 0) {
		return `Every ${rule.byDay.map(weekdayName).join(", ")}`;
	}

	return `Every ${rule.interval} ${rule.freq.replace("ly", "")}${rule.interval === 1 ? "" : "s"}`;
}

function PreviewContent({ preview }: { preview: Preview }) {
	if (preview.kind === "relative") {
		return (
			<Stack gap={4}>
				<Group gap="xs" wrap="nowrap">
					<CalendarClock size={15} />
					<Text fw={700}>{formatDate(preview.date)}</Text>
				</Group>
				<Text size="xs" c="dimmed">
					Due date inserted as <Code>{preview.value}</Code>.
				</Text>
			</Stack>
		);
	}

	if (preview.kind === "recurrence") {
		return (
			<Stack gap={4}>
				<Group gap="xs" wrap="nowrap">
					<Repeat2 size={15} />
					<Text fw={700}>{describeRecurrence(preview.rule)}</Text>
				</Group>
				<Text size="xs" c="dimmed">
					Recurrence inserted as <Code>{preview.value}</Code>.
				</Text>
			</Stack>
		);
	}

	return (
		<Text size="sm" c="red">
			{preview.message}
		</Text>
	);
}

export default function SmartSuggestionChips({
	editor,
}: SmartSuggestionChipsProps) {
	const [preview, setPreview] = useState<Preview | null>(null);

	return (
		<Group
			gap={6}
			wrap="nowrap"
			style={{
				minWidth: "max-content",
				padding: "2px 4px",
			}}
		>
			{SUGGESTIONS.map((suggestion) => {
				const isPreviewOpen = preview?.value === suggestion.value;
				return (
					<Popover
						key={suggestion.value}
						opened={isPreviewOpen}
						onChange={(opened) => {
							if (!opened) setPreview(null);
						}}
						position="bottom-start"
						withArrow
						shadow="md"
						withinPortal
					>
						<Popover.Target>
							<div>
								<Tooltip
									label={suggestion.description}
									withArrow
									position="bottom"
								>
									<Button
										size="compact-xs"
										variant={isPreviewOpen ? "filled" : "light"}
										radius="xl"
										leftSection={
											suggestion.icon === "calendar" ? (
												<CalendarClock size={13} aria-hidden="true" />
											) : (
												<Repeat2 size={13} aria-hidden="true" />
											)
										}
										onClick={() => {
											insertSuggestion(editor, suggestion.value);
											setPreview(parseSuggestion(suggestion.value));
										}}
										aria-label={`Insert ${suggestion.value} and preview parsed result`}
									>
										{suggestion.label}
									</Button>
								</Tooltip>
							</div>
						</Popover.Target>
						<Popover.Dropdown maw={310}>
							<PreviewContent
								preview={preview ?? parseSuggestion(suggestion.value)}
							/>
						</Popover.Dropdown>
					</Popover>
				);
			})}
		</Group>
	);
}
