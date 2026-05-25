import {
	ActionIcon,
	Box,
	Collapse,
	Group,
	Paper,
	Stack,
	Text,
	Textarea,
	TextInput,
	UnstyledButton,
} from "@mantine/core";
import { useDebouncedValue } from "@mantine/hooks";
import { RichTextEditor } from "@mantine/tiptap";
import Placeholder from "@tiptap/extension-placeholder";
import { Markdown } from "@tiptap/markdown";
import { useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import {
	Archive,
	ArchiveRestore,
	Check,
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
import type { Note, NoteColor } from "../../types/notes";
import { NOTE_COLORS, NOTE_TEXT_COLORS } from "../../types/notes";
import { createNote } from "../../utils/notesStorage";
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
									border: "2px solid currentColor",
									boxShadow: "0 0 0 1px rgba(0,0,0,0.2)",
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

function NoteCardEditor({
	content,
	onChange,
	textColor,
}: {
	content: string;
	onChange: (html: string) => void;
	textColor: string;
}) {
	const editor = useEditor({
		extensions: [
			StarterKit.configure({
				heading: { levels: [1, 2, 3] },
			}),
			Placeholder.configure({
				placeholder: "Take a note...",
			}),
			Markdown.configure({
				markedOptions: { gfm: true, breaks: true },
			}),
		],
		content: content || "",
		onUpdate: ({ editor: currentEditor }) => {
			onChange(currentEditor.getHTML());
		},
		immediatelyRender: false,
	});

	useEffect(() => {
		if (editor && content !== editor.getHTML()) {
			editor.commands.setContent(content || "");
		}
	}, [content, editor]);

	return (
		<RichTextEditor
			editor={editor}
			className="NotesPage-noteCard-editor"
			style={{ "--note-text-color": textColor } as React.CSSProperties}
		>
			<RichTextEditor.Toolbar>
				<RichTextEditor.ControlsGroup>
					<RichTextEditor.Bold />
					<RichTextEditor.Italic />
					<RichTextEditor.BulletList />
					<RichTextEditor.OrderedList />
				</RichTextEditor.ControlsGroup>
			</RichTextEditor.Toolbar>
			<RichTextEditor.Content />
		</RichTextEditor>
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
	note: {
		id: string;
		title: string;
		content: string;
		color: NoteColor;
		pinned: boolean;
		archived: boolean;
	};
	onUpdate: (
		id: string,
		partial: Partial<{ title: string; content: string }>,
	) => void;
	onDelete: (id: string) => void;
	onArchive: (id: string) => void;
	onTogglePin: (id: string) => void;
	onColorChange: (id: string, color: NoteColor) => void;
}) {
	const titleRef = useRef<HTMLTextAreaElement>(null);
	const textColor = NOTE_TEXT_COLORS[note.color] ?? "#000";

	return (
		<Paper
			radius="md"
			withBorder
			shadow="sm"
			style={{
				backgroundColor: note.color,
				color: textColor,
				"--note-textarea-color": textColor,
				...(note.pinned ? { borderColor: "rgba(0, 0, 0, 0.12)" } : {}),
			}}
		>
			<Group justify="space-between" p="xs" pb={0}>
				<Textarea
					ref={titleRef}
					value={note.title}
					onChange={(e) => onUpdate(note.id, { title: e.currentTarget.value })}
					placeholder="Title"
					variant="unstyled"
					autosize
					minRows={1}
					classNames={{ input: "NotesPage-noteCard-title" }}
				/>
				{!note.archived && (
					<ActionIcon
						variant="subtle"
						size="sm"
						onClick={() => onTogglePin(note.id)}
						aria-label={note.pinned ? "Unpin note" : "Pin note"}
					>
						{note.pinned ? <PinOff size={16} /> : <Pin size={16} />}
					</ActionIcon>
				)}
			</Group>
			<NoteCardEditor
				content={note.content}
				onChange={(html) => onUpdate(note.id, { content: html })}
				textColor={textColor}
			/>
			<Group justify="space-between" p={4}>
				<ColorDots
					selected={note.color}
					onChange={(c) => onColorChange(note.id, c)}
				/>
				<Group gap={2} wrap="nowrap">
					<ActionIcon
						variant="subtle"
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
						variant="subtle"
						size="sm"
						onClick={() => onDelete(note.id)}
						aria-label="Delete"
					>
						<Trash2 size={14} />
					</ActionIcon>
				</Group>
			</Group>
		</Paper>
	);
}

interface NotesPageProps {
	notes: Note[];
	upsertNote: (partial: Partial<Note> & { id: string }) => void;
	deleteNote: (id: string) => void;
	archiveNote: (id: string) => void;
	togglePin: (id: string) => void;
	setNoteColor: (id: string, color: NoteColor) => void;
}

const NotesPage = ({
	notes,
	upsertNote,
	deleteNote,
	archiveNote,
	togglePin,
	setNoteColor,
}: NotesPageProps) => {
	const [search, setSearch] = useState("");
	const [expanded, setExpanded] = useState(false);
	const [showArchived, setShowArchived] = useState(false);
	const [draftTitle, setDraftTitle] = useState("");
	const [draftContent, setDraftContent] = useState("");
	const [draftColor, setDraftColor] = useState<NoteColor>("#fff475");
	const [debouncedSearch] = useDebouncedValue(search, 200);
	const addCardRef = useRef<HTMLDivElement>(null);
	const draftTitleRef = useRef<HTMLTextAreaElement>(null);

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

	const cancelDraft = useCallback(() => {
		setDraftTitle("");
		setDraftContent("");
		setDraftColor("#fff475");
		setExpanded(false);
	}, []);

	const handleCreateNote = useCallback(() => {
		if (!draftTitle.trim() && !draftContent.trim()) {
			cancelDraft();
			return;
		}
		const note = createNote({
			title: draftTitle.trim(),
			content: draftContent.trim(),
			color: draftColor,
		});
		upsertNote(note);
		setDraftTitle("");
		setDraftContent("");
		setDraftColor("#fff475");
		setExpanded(false);
	}, [draftTitle, draftContent, draftColor, upsertNote, cancelDraft]);

	const handleDraftKeyDown = useCallback(
		(e: React.KeyboardEvent) => {
			if (e.key === "Escape") {
				cancelDraft();
			}
		},
		[cancelDraft],
	);

	const handleUpdateNote = useCallback(
		(id: string, partial: Partial<{ title: string; content: string }>) => {
			upsertNote({ id, ...partial });
		},
		[upsertNote],
	);

	useEffect(() => {
		if (expanded) {
			setTimeout(() => draftTitleRef.current?.focus(), 50);
		}
	}, [expanded]);

	const draftTextColor = NOTE_TEXT_COLORS[draftColor] ?? "#000";

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

				{!expanded ? (
					<Paper
						maw={600}
						w="100%"
						shadow="sm"
						radius="md"
						p="sm"
						onClick={() => setExpanded(true)}
					>
						<Text c="dimmed" size="sm">
							Take a note...
						</Text>
					</Paper>
				) : (
					<Paper
						ref={addCardRef}
						maw={600}
						w="100%"
						shadow="sm"
						radius="md"
						p="sm"
						style={{
							backgroundColor: draftColor,
							color: draftTextColor,
							"--note-textarea-color": draftTextColor,
						}}
					>
						<Textarea
							ref={draftTitleRef}
							placeholder="Title"
							value={draftTitle}
							onChange={(e) => setDraftTitle(e.currentTarget.value)}
							onKeyDown={handleDraftKeyDown}
							variant="filled"
							autosize
							minRows={1}
							classNames={{ input: "NotesPage-draft-title" }}
						/>
						<Textarea
							placeholder="Take a note..."
							value={draftContent}
							onChange={(e) => setDraftContent(e.currentTarget.value)}
							onKeyDown={handleDraftKeyDown}
							variant="unstyled"
							autosize
							minRows={3}
							classNames={{ input: "NotesPage-draft-content" }}
							mt={4}
						/>
						<Group maw={600} w="100%" justify="flex-end" gap="xs">
							<ColorDots selected={draftColor} onChange={setDraftColor} />
							<Group gap={4} wrap="nowrap">
								<ActionIcon
									variant="subtle"
									size="sm"
									onClick={cancelDraft}
									aria-label="Cancel"
								>
									<X size={16} />
								</ActionIcon>
								<ActionIcon
									variant="filled"
									size="sm"
									color="blue"
									onClick={handleCreateNote}
									aria-label="Add note"
								>
									<Check size={16} />
								</ActionIcon>
							</Group>
						</Group>
					</Paper>
				)}
			</Stack>

			<Box style={{ flex: 1, overflowY: "auto" }} p="md">
				{pinned.length > 0 && (
					<div>
						<Text
							size="xs"
							fw={700}
							tt="uppercase"
							c="dimmed"
							mb="xs"
							style={{ letterSpacing: "0.05em" }}
						>
							Pinned
						</Text>
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
					<Text
						size="xs"
						fw={700}
						tt="uppercase"
						c="dimmed"
						mb="xs"
						mt="md"
						style={{ letterSpacing: "0.05em" }}
					>
						Others
					</Text>
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
								<Text size="sm">No notes yet. Start writing above!</Text>
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
