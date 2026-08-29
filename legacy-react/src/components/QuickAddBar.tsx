import { ActionIcon, Group, Paper, TextInput } from "@mantine/core";
import { useLocalStorage } from "@mantine/hooks";
import { ChevronDown, ChevronUp, Plus } from "lucide-react";
import { useRef, useState } from "react";
import { HAPTIC, haptic } from "@/lib/haptics";

/**
 * M3 Expressive quick-add bar for the Todo workspace.
 *
 * The fastest path to a new todo is one text input: typing `+project`,
 * `@context`, `(A)`, or `due:today` in the line uses standard todo.txt
 * syntax so nothing new has to be learned. The bar is the hero moment of
 * task creation — emphasized primary button, rounded pill geometry, and
 * a springy press response.
 *
 * The bar is presentation-only: it owns the input state and collapse
 * toggle, while the document write itself is delegated through `onAdd`
 * (TodoPage wires it to the TipTap editor). All theming lives in the
 * `.quick-add-bar` styles — no inline overrides that could fight scheme
 * switching. Collapse state persists per device; the collapsed pill
 * re-expands and focuses the input on tap.
 */
interface QuickAddBarProps {
	/** Receives the trimmed todo text in plain todo.txt syntax. */
	onAdd: (text: string) => void;
}

export const QuickAddBar = ({ onAdd }: QuickAddBarProps) => {
	const [value, setValue] = useState("");
	const [expanded, setExpanded] = useLocalStorage<boolean>({
		key: "quickadd-expanded",
		defaultValue: true,
	});
	const inputRef = useRef<HTMLInputElement>(null);

	const submit = () => {
		const text = value.trim();
		if (!text) return;
		onAdd(text);
		setValue("");
		haptic(HAPTIC.tick);
	};

	const expandAndFocus = () => {
		setExpanded(true);
		// Focus after the expanded bar mounts; the ref is null this tick.
		requestAnimationFrame(() => inputRef.current?.focus());
	};

	if (!expanded) {
		return (
			<button
				type="button"
				className="quick-add-bar quick-add-collapsed"
				onClick={expandAndFocus}
				aria-label="Expand quick add"
			>
				<Plus size={18} aria-hidden />
				<span>Add a todo…</span>
				<ChevronDown size={16} aria-hidden />
			</button>
		);
	}

	return (
		<Paper radius="xl" p="xs" className="quick-add-bar">
			<Group gap="xs" wrap="nowrap">
				<TextInput
					ref={inputRef}
					aria-label="Add a todo"
					placeholder="New todo… (+project @context (A) due:today)"
					value={value}
					onChange={(e) => setValue(e.currentTarget.value)}
					onKeyDown={(e) => {
						if (e.key === "Enter" && !e.shiftKey) {
							e.preventDefault();
							submit();
						}
					}}
					size="sm"
					variant="filled"
					radius="xl"
					style={{ flex: 1, minWidth: 0 }}
				/>
				<ActionIcon
					variant="subtle"
					color="dark"
					radius="xl"
					className="quick-add-collapse-toggle"
					aria-label="Collapse quick add"
					onClick={() => setExpanded(false)}
				>
					<ChevronUp size={16} />
				</ActionIcon>
				<ActionIcon
					className="app-floating-action-primary"
					variant="filled"
					color="evergreen"
					aria-label="Add todo"
					onClick={submit}
					disabled={!value.trim()}
				>
					<Plus size={22} />
				</ActionIcon>
			</Group>
		</Paper>
	);
};
