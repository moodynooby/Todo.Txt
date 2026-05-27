import { ActionIcon, Card, Group, Textarea } from "@mantine/core";
import { Archive, ArchiveRestore, Pin, PinOff, Trash2 } from "lucide-react";
import ColorDots from "@/features/notes/ColorDots";
import NoteCardEditor from "@/features/notes/NoteCardEditor";
import type { Note, NoteColor } from "@/types/notes";

interface NoteCardProps {
	note: Note;
	onUpdate: (
		id: string,
		partial: Partial<{ title: string; content: string }>,
	) => void;
	onDelete: (id: string) => void;
	onArchive: (id: string) => void;
	onTogglePin: (id: string) => void;
	onColorChange: (id: string, color: NoteColor) => void;
}

const NoteCard = ({
	note,
	onUpdate,
	onDelete,
	onArchive,
	onTogglePin,
	onColorChange,
}: NoteCardProps) => (
	<Card
		radius="md"
		withBorder
		shadow="sm"
		padding="xs"
		className="NotesPage-noteCard"
		style={{
			backgroundColor: note.color,
			color: "#000",
			"--note-textarea-color": "#000",
			...(note.pinned ? { borderColor: "rgba(0, 0, 0, 0.12)" } : {}),
		}}
	>
		<Group justify="space-between">
			<Textarea
				value={note.title}
				onChange={(e) => onUpdate(note.id, { title: e.currentTarget.value })}
				placeholder="Title"
				variant="unstyled"
				autosize
				minRows={1}
				maxRows={3}
				classNames={{ input: "NotesPage-noteCard-title" }}
			/>
			{!note.archived && (
				<ActionIcon
					variant="default"
					size="sm"
					onClick={() => onTogglePin(note.id)}
					aria-label={note.pinned ? "Unpin note" : "Pin note"}
				>
					{note.pinned ? <PinOff size={16} /> : <Pin size={16} />}
				</ActionIcon>
			)}
		</Group>
		<Card.Section>
			<NoteCardEditor
				content={note.content}
				onChange={(md) => onUpdate(note.id, { content: md })}
			/>
		</Card.Section>
		<Group justify="space-between">
			<ColorDots
				selected={note.color}
				onChange={(c) => onColorChange(note.id, c)}
			/>
			<Group gap={2} wrap="nowrap">
				<ActionIcon
					variant="default"
					size="sm"
					onClick={() => onArchive(note.id)}
					aria-label={note.archived ? "Restore" : "Archive"}
				>
					{note.archived ? <ArchiveRestore size={14} /> : <Archive size={14} />}
				</ActionIcon>
				<ActionIcon
					variant="default"
					size="sm"
					onClick={() => onDelete(note.id)}
					aria-label="Delete"
				>
					<Trash2 size={14} />
				</ActionIcon>
			</Group>
		</Group>
	</Card>
);

export default NoteCard;
