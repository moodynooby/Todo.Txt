import { Button, Modal, PasswordInput, Stack, Text } from "@mantine/core";
import { notifications } from "@mantine/notifications";
import { useState } from "react";
import { setAccountPassword } from "@/lib/firebase";

interface SetPasswordModalProps {
	opened: boolean;
	onClose: () => void;
}

/**
 * Lets the signed-in user attach (or change) an email/password credential on
 * their account. Google-only accounts keep the SAME uid after linking, so a
 * password set here is exactly what the native apps' email/password sign-in
 * expects — one account, one cloud document tree.
 */
const SetPasswordModal = ({ opened, onClose }: SetPasswordModalProps) => {
	const [password, setPassword] = useState("");
	const [confirm, setConfirm] = useState("");
	const [error, setError] = useState<string | null>(null);
	const [busy, setBusy] = useState(false);

	const mismatch = confirm.length > 0 && confirm !== password;
	const canSubmit = password.length >= 6 && password === confirm && !busy;

	const submit = async () => {
		setBusy(true);
		setError(null);
		try {
			await setAccountPassword(password);
			notifications.show({
				message:
					"Password saved — sign in with it on the native app to sync the same account.",
				color: "evergreen",
			});
			onClose();
		} catch (err) {
			const code = (err as { code?: string }).code;
			setError(
				code === "auth/credential-already-in-use"
					? "A password account already exists for this email — sign in with that password instead."
					: code === "auth/requires-recent-login"
						? "Please sign out and back in, then try again."
						: err instanceof Error
							? err.message
							: "Could not set the password.",
			);
		} finally {
			setBusy(false);
		}
	};

	return (
		<Modal opened={opened} onClose={onClose} title="Sync password" size="sm">
			<Stack gap="sm">
				<Text size="sm" c="dimmed">
					Attach a password to this account so the native apps (email + password
					sign-in) reach the same synced data. Your Google sign-in keeps
					working.
				</Text>
				<PasswordInput
					label="New password"
					value={password}
					onChange={(e) => setPassword(e.currentTarget.value)}
					error={
						password.length > 0 && password.length < 6
							? "At least 6 characters"
							: undefined
					}
				/>
				<PasswordInput
					label="Confirm password"
					value={confirm}
					onChange={(e) => setConfirm(e.currentTarget.value)}
					error={mismatch ? "Passwords do not match" : undefined}
				/>
				{error && (
					<Text size="sm" c="red">
						{error}
					</Text>
				)}
				<Button onClick={submit} disabled={!canSubmit}>
					Save password
				</Button>
			</Stack>
		</Modal>
	);
};

export default SetPasswordModal;
