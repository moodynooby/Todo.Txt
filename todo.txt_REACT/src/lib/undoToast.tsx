import { Button, Group, Text } from "@mantine/core";
import { randomId } from "@mantine/hooks";
import { notifications } from "@mantine/notifications";

/**
 * Shared undo toast for destructive actions (delete note, delete habit…).
 *
 * Shows a brief notification with an Undo action; the caller captures the
 * removed entity before dispatching the destructive action and restores it
 * from the callback. Auto-dismisses after 6s — long enough to read, short
 * enough to stay out of the way.
 */
export function showUndoToast({
	message,
	onUndo,
}: {
	message: string;
	onUndo: () => void;
}): void {
	const id = randomId();
	notifications.show({
		id,
		autoClose: 6000,
		withCloseButton: false,
		message: (
			<Group justify="space-between" gap="sm" wrap="nowrap">
				<Text size="sm" style={{ minWidth: 0 }}>
					{message}
				</Text>
				<Button
					size="compact-xs"
					variant="light"
					color="evergreen"
					onClick={() => {
						notifications.hide(id);
						onUndo();
					}}
				>
					Undo
				</Button>
			</Group>
		),
	});
}
