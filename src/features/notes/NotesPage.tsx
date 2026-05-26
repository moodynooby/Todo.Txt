import {
	ActionIcon,
	Affix,
	Box,
	Card,
	Collapse,
	Group,
	Stack,
	Text,
	Textarea,
	TextInput,
	UnstyledButton,
} from "@mantine/core";
import { useDebouncedValue } from "@mantine/hooks";
import { useEditor } from "@tiptap/react";
import {
	Archive,
	ArchiveRestore,
	ChevronDown,
	ChevronRight,
	Pin,
	PinOff,
	Plus,
	Search,
	Trash2,
	X,
} from "lucide-react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Editor } from "@/components/Editor";
import { useNotesContext } from "@/context/NotesContext";
import { createNote } from "@/hooks/useNotes";
import type { Note, NoteColor } from "@/types/notes";
import { NOTE_COLORS } from "@/types/notes";
import { getEditorExtensions } from "@/utils/editorExtensions";
import "./NotesPage.css";

function ColorDots({
	selected,
	onChange,
}: {
	selected: NoteColor;
	onChange: (color: NoteColor) => void;
}) {
	return (
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
}

function SectionHeading({ children, mt }: { children: string; mt?: string }) {
	return (
		<Text
			size="xs"
			fw={700}
			tt="uppercase"
			c="dimmed"
			mb="xs"
			mt={mt}
			style={{ letterSpacing: "0.05em" }}
		>
			{children}
		</Text>
	);
}

function NoteCardEditor({
	content,
	onChange,
}: {
	content: string;
	onChange: (md: string) => void;
}) {
	const lastMarkdownRef = useRef(content);

	const editor = useEditor({
		extensions: getEditorExtensions({
			headingLevels: [1, 2, 3],
			placeholder: "Take a note...",
		}),
		content: content || "",
		contentType: "markdown",
		shouldRerenderOnTransaction: true,
		onUpdate: ({ editor: currentEditor }) => {
			const md = currentEditor.getMarkdown();
			lastMarkdownRef.current = md;
			onChange(md);
		},
		immediatelyRender: false,
	});

	useEffect(() => {
		if (editor && content !== lastMarkdownRef.current) {
			lastMarkdownRef.current = content;
			editor.commands.setContent(content || "");
		}
	}, [content, editor]);

	return (
		<Editor
			editor={editor}
			toolbarVariant="minimal"
			className="NotesPage-noteCard-editor"
			style={{ "--note-text-color": "#000" } as React.CSSProperties}
		/>
	);
}

function NoteCard({
	note,
	onUpdate,
	onDelete,
	onArchive,
	onTogglePin,
	onColorChange,
}: {
	note: Note;
	onUpdate: (
		id: string,
		partial: Partial<{ title: string; content: string }>,
	) => void;
	onDelete: (id: string) => void;
	onArchive: (id: string) => void;
	onTogglePin: (id: string) => void;
	onColorChange: (id: string, color: NoteColor) => void;
}) {
	return (
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
						{note.archived ? (
							<ArchiveRestore size={14} />
						) : (
							<Archive size={14} />
						)}
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
}

const NotesPage = () => {
	const {
		notes,
		upsertNote,
		deleteNote,
		archiveNote,
		togglePin,
		setNoteColor,
	} = useNotesContext();

	const [search, setSearch] = useState("");
	const [showArchived, setShowArchived] = useState(false);
	const [debouncedSearch] = useDebouncedValue(search, 200);

	const activeNotes = useMemo(() => {
		let result = notes.filter((n) => !n.archived);
		if (debouncedSearch) {
			const q = debouncedSearch.toLowerCase();
			result = result.filter(
				(n) =>
					n.title.toLowerCase().includes(q) ||
					n.content.toLowerCase().includes(q),
			);
		}
		return result;
	}, [notes, debouncedSearch]);

	const archivedNotes = useMemo(() => {
		if (debouncedSearch) return [];
		return notes.filter((n) => n.archived);
	}, [notes, debouncedSearch]);

	const pinned = useMemo(
		() => activeNotes.filter((n) => n.pinned),
		[activeNotes],
	);
	const unpinned = useMemo(
		() => activeNotes.filter((n) => !n.pinned),
		[activeNotes],
	);

	const handleAddNote = useCallback(
		() => upsertNote(createNote()),
		[upsertNote],
	);

	const handleUpdateNote = useCallback(
		(id: string, partial: Partial<{ title: string; content: string }>) => {
			upsertNote({ id, ...partial });
		},
		[upsertNote],
	);

	const hasContent = pinned.length > 0 || unpinned.length > 0;
	const hasArchived = archivedNotes.length > 0;

	return (
		<Stack h="100%" gap={0} style={{ overflow: "hidden" }}>
			<Stack p="md" gap="sm" align="center">
				<TextInput
					maw={600}
					w="100%"
					placeholder="Search notes..."
					leftSection={<Search size={16} />}
					rightSection={
						search ? (
							<ActionIcon
								variant="subtle"
								size="xs"
								onClick={() => setSearch("")}
							>
								<X size={14} />
							</ActionIcon>
						) : null
					}
					value={search}
					onChange={(e) => setSearch(e.currentTarget.value)}
				/>

				<Affix position={{ bottom: 24, right: 24 }}>
					<ActionIcon
						size="xl"
						radius="xl"
						variant="filled"
						color="blue"
						onClick={handleAddNote}
						aria-label="Add note"
					>
						<Plus size={22} />
					</ActionIcon>
				</Affix>
			</Stack>

			<Box style={{ flex: 1, overflowY: "auto" }} p="md">
				{pinned.length > 0 && (
					<div>
						<SectionHeading>Pinned</SectionHeading>
						<div className="NotesPage-masonry">
							{pinned.map((note) => (
								<NoteCard
									key={note.id}
									note={note}
									onUpdate={handleUpdateNote}
									onDelete={deleteNote}
									onArchive={archiveNote}
									onTogglePin={togglePin}
									onColorChange={setNoteColor}
								/>
							))}
						</div>
					</div>
				)}

				{pinned.length > 0 && unpinned.length > 0 && (
					<SectionHeading mt="md">Others</SectionHeading>
				)}

				{unpinned.length > 0 && (
					<div className="NotesPage-masonry">
						{unpinned.map((note) => (
							<NoteCard
								key={note.id}
								note={note}
								onUpdate={handleUpdateNote}
								onDelete={deleteNote}
								onArchive={archiveNote}
								onTogglePin={togglePin}
								onColorChange={setNoteColor}
							/>
						))}
					</div>
				)}

				{!hasContent && !hasArchived && (
					<Stack
						align="center"
						justify="center"
						py={60}
						px={20}
						c="dimmed"
						gap="sm"
					>
						{debouncedSearch ? (
							<>
								<Search size={40} />
								<Text size="sm">No notes match your search</Text>
							</>
						) : (
							<>
								<Plus size={40} />
								<Text size="sm">No notes yet. Tap + to create one!</Text>
							</>
						)}
					</Stack>
				)}

				{hasArchived && (
					<Box mt="md" pt="xs">
						<UnstyledButton
							onClick={() => setShowArchived((prev) => !prev)}
							w="100%"
							style={{
								display: "flex",
								alignItems: "center",
								gap: 6,
								padding: "8px 4px",
								borderRadius: 4,
								color: "var(--mantine-color-dimmed)",
								cursor: "pointer",
							}}
						>
							{showArchived ? (
								<ChevronDown size={14} />
							) : (
								<ChevronRight size={14} />
							)}
							<Text size="sm" fw={600}>
								Archived ({archivedNotes.length})
							</Text>
						</UnstyledButton>
						<Collapse expanded={showArchived}>
							<Box className="NotesPage-masonry" mt="xs">
								{archivedNotes.map((note) => (
									<NoteCard
										key={note.id}
										note={note}
										onUpdate={handleUpdateNote}
										onDelete={deleteNote}
										onArchive={archiveNote}
										onTogglePin={togglePin}
										onColorChange={setNoteColor}
									/>
								))}
							</Box>
						</Collapse>
					</Box>
				)}
			</Box>
		</Stack>
	);
};

export default NotesPage;
