import {
	ActionIcon,
	Affix,
	Box,
	Collapse,
	Stack,
	Text,
	TextInput,
	UnstyledButton,
} from "@mantine/core";
import { useDebouncedValue } from "@mantine/hooks";
import { ChevronDown, ChevronRight, Plus, Search, X } from "lucide-react";
import { useCallback, useMemo, useState } from "react";
import { createNote, useNotesContext } from "@/context/NotesContext";
import NoteCard from "@/features/notes/NoteCard";
import SectionHeading from "@/features/notes/SectionHeading";
import type { NoteColor } from "@/types/notes";
import "./NotesPage.css";

const NotesPage = () => {
	const { state, dispatchNotes } = useNotesContext();
	const { notes } = state;

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
		() => dispatchNotes({ type: "UPSERT_NOTE", payload: createNote() }),
		[dispatchNotes],
	);

	const handleUpdateNote = useCallback(
		(id: string, partial: Partial<{ title: string; content: string }>) => {
			dispatchNotes({ type: "UPSERT_NOTE", payload: { id, ...partial } });
		},
		[dispatchNotes],
	);

	const handleDeleteNote = useCallback(
		(id: string) => dispatchNotes({ type: "DELETE_NOTE", payload: id }),
		[dispatchNotes],
	);

	const handleArchiveNote = useCallback(
		(id: string) => dispatchNotes({ type: "ARCHIVE_NOTE", payload: id }),
		[dispatchNotes],
	);

	const handleTogglePin = useCallback(
		(id: string) => dispatchNotes({ type: "TOGGLE_PIN", payload: id }),
		[dispatchNotes],
	);

	const handleSetNoteColor = useCallback(
		(id: string, color: NoteColor) =>
			dispatchNotes({ type: "SET_NOTE_COLOR", payload: { id, color } }),
		[dispatchNotes],
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
									onDelete={handleDeleteNote}
									onArchive={handleArchiveNote}
									onTogglePin={handleTogglePin}
									onColorChange={handleSetNoteColor}
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
								onDelete={handleDeleteNote}
								onArchive={handleArchiveNote}
								onTogglePin={handleTogglePin}
								onColorChange={handleSetNoteColor}
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
										onDelete={handleDeleteNote}
										onArchive={handleArchiveNote}
										onTogglePin={handleTogglePin}
										onColorChange={handleSetNoteColor}
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
