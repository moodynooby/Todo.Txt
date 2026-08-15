import { ActionIcon, Group, Paper, TextInput, Tooltip } from "@mantine/core";
import type { Editor as TipTapEditor } from "@tiptap/core";
import { Plus, Tag } from "lucide-react";
import { useState } from "react";

/**
 * M3 Expressive quick-add bar for the Todo workspace.
 *
 * The fastest path to a new todo is one text input: typing `+project`,
 * `@context`, `(A)`, or `due:today` in the line uses standard todo.txt
 * syntax so nothing new has to be learned. The bar is the hero moment of
 * task creation — emphasized primary button, rounded pill geometry, and
 * a springy press response.
 */
interface QuickAddBarProps {
	editor: TipTapEditor | null;
}

export const QuickAddBar = ({ editor }: QuickAddBarProps) => {
	const [value, setValue] = useState("");

	const addItem = () => {
		const text = value.trim();
		if (!text || !editor) return;
		const line = `- [ ] ${text}`;
		editor.commands.focus("end");
		const currentText = editor.getText();
		const prefix = currentText.length > 0 ? "\n" : "";
		editor.commands.insertContent(`${prefix}${line}\n`);
		setValue("");
	};

	return (
		<Paper
			shadow="md"
			radius="xl"
			p="xs"
			className="app-surface quick-add-bar"
			style={{
				position: "sticky",
				top: 8,
				zIndex: 5,
				margin: "12px 12px 0",
				background: "var(--app-surface-raised)",
				border: "1px solid var(--app-border-strong)",
				transition: "box-shadow 180ms var(--m3-ease-effects)",
			}}
		>
			<Group gap="xs" wrap="nowrap">
				<TextInput
					aria-label="Add a todo"
					placeholder="New todo… (+project @context (A) due:today)"
					value={value}
					onChange={(e) => setValue(e.currentTarget.value)}
					onKeyDown={(e) => {
						if (e.key === "Enter" && !e.shiftKey) {
							e.preventDefault();
							addItem();
						}
					}}
					size="sm"
					variant="filled"
					radius="xl"
					style={{ flex: 1, minWidth: 0 }}
				/>
				<Tooltip
					label="Insert tags (+project @context (A) due:date) directly in the text"
					position="top"
					withArrow
				>
					<ActionIcon
						variant="light"
						color="evergreen"
						radius="xl"
						size="lg"
						aria-label="Tag help"
					>
						<Tag size={15} />
					</ActionIcon>
				</Tooltip>
				<ActionIcon
					className="app-floating-action-primary"
					variant="filled"
					color="evergreen"
					aria-label="Add todo"
					onClick={addItem}
					disabled={!value.trim()}
				>
					<Plus size={22} />
				</ActionIcon>
			</Group>
		</Paper>
	);
};
