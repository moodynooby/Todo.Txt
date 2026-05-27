import { ActionIcon, Group } from "@mantine/core";
import type { NoteColor } from "@/types/notes";
import { NOTE_COLORS } from "@/types/notes";

interface ColorDotsProps {
	selected: NoteColor;
	onChange: (color: NoteColor) => void;
}

const ColorDots = ({ selected, onChange }: ColorDotsProps) => (
	<Group gap={4} wrap="nowrap">
		{NOTE_COLORS.map((c) => (
			<ActionIcon
				key={c}
				variant="filled"
				radius="xl"
				size="xs"
				style={{
					backgroundColor: c,
					...(c === selected
						? {
								border: "2px solid rgba(0,0,0,0.45)",
								boxShadow: "0 0 0 2px rgba(255,255,255,0.7)",
							}
						: { border: "1px solid rgba(0,0,0,0.12)" }),
				}}
				onClick={() => onChange(c)}
				aria-label={`Set color ${c}`}
			/>
		))}
	</Group>
);

export default ColorDots;
