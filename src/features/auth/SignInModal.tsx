import {
	Alert,
	Anchor,
	Button,
	Divider,
	Group,
	Modal,
	PasswordInput,
	Stack,
	Tabs,
	Text,
	TextInput,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { Globe, Mail, TriangleAlert } from "lucide-react";
import { useState } from "react";
import {
	createAccount,
	sendPasswordReset,
	signInWithEmail,
	signInWithGoogle,
} from "@/lib/firebase";

interface SignInModalProps {
	opened: boolean;
	onClose: () => void;
}

const FIREBASE_ERROR_MAP: Record<string, string> = {
	"auth/invalid-email": "Invalid email format.",
	"auth/user-not-found": "No account found with this email.",
	"auth/wrong-password": "Incorrect password.",
	"auth/invalid-credential": "Invalid email or password.",
	"auth/email-already-in-use": "An account with this email already exists.",
	"auth/weak-password": "Password must be at least 6 characters.",
	"auth/too-many-requests": "Too many attempts. Please try again later.",
	"auth/popup-blocked":
		"Popup was blocked. Please allow popups for this site in your browser settings and try again.",
	"auth/popup-closed-by-user":
		"Sign-in popup was closed before completing. Please try again.",
};

const getFirebaseErrorMessage = (error: unknown): string => {
	if (error instanceof Error) {
		const code = (error as { code?: string }).code;
		if (code && FIREBASE_ERROR_MAP[code]) return FIREBASE_ERROR_MAP[code];
	}
	return "An unexpected error occurred. Please try again.";
};

const SignInModal = ({ opened, onClose }: SignInModalProps) => {
	const [activeTab, setActiveTab] = useState<string | null>("signin");
	const [error, setError] = useState<string | null>(null);
	const [loading, setLoading] = useState(false);
	const [showForgotPassword, setShowForgotPassword] = useState(false);
	const [resetSent, setResetSent] = useState(false);

	const signInForm = useForm({
		mode: "uncontrolled",
		initialValues: { email: "", password: "" },
		validate: {
			email: (v) => (/^\S+@\S+$/.test(v) ? null : "Invalid email"),
			password: (v) =>
				v.length < 6 ? "Password must be at least 6 characters" : null,
		},
	});

	const createForm = useForm({
		mode: "uncontrolled",
		initialValues: { name: "", email: "", password: "", confirmPassword: "" },
		validate: {
			name: (v) => (v.trim().length < 1 ? "Name is required" : null),
			email: (v) => (/^\S+@\S+$/.test(v) ? null : "Invalid email"),
			password: (v) =>
				v.length < 6 ? "Password must be at least 6 characters" : null,
			confirmPassword: (v, values) =>
				v !== values.password ? "Passwords do not match" : null,
		},
	});

	const resetForm = useForm({
		mode: "uncontrolled",
		initialValues: { email: "" },
		validate: {
			email: (v) => (/^\S+@\S+$/.test(v) ? null : "Invalid email"),
		},
	});

	const handleSignIn = async (values: { email: string; password: string }) => {
		setError(null);
		setLoading(true);
		try {
			await signInWithEmail(values.email, values.password);
			onClose();
		} catch (e) {
			setError(getFirebaseErrorMessage(e));
		} finally {
			setLoading(false);
		}
	};

	const handleCreateAccount = async (values: {
		name: string;
		email: string;
		password: string;
	}) => {
		setError(null);
		setLoading(true);
		try {
			await createAccount(values.email, values.password, values.name);
			onClose();
		} catch (e) {
			setError(getFirebaseErrorMessage(e));
		} finally {
			setLoading(false);
		}
	};

	const handleGoogleSignIn = async () => {
		setError(null);
		setLoading(true);
		try {
			await signInWithGoogle();
			onClose();
		} catch (e) {
			const message = getFirebaseErrorMessage(e);
			if (message) setError(message);
		} finally {
			setLoading(false);
		}
	};

	const handlePasswordReset = async (values: { email: string }) => {
		setError(null);
		setLoading(true);
		try {
			await sendPasswordReset(values.email);
			setResetSent(true);
		} catch (e) {
			setError(getFirebaseErrorMessage(e));
		} finally {
			setLoading(false);
		}
	};

	const handleClose = () => {
		setError(null);
		setLoading(false);
		setShowForgotPassword(false);
		setResetSent(false);
		signInForm.reset();
		createForm.reset();
		resetForm.reset();
		onClose();
	};

	return (
		<Modal
			opened={opened}
			onClose={handleClose}
			title="Sign in"
			centered
			size="sm"
		>
			{showForgotPassword ? (
				<Stack>
					<Text size="sm" c="dimmed">
						Enter your email address and we'll send you a link to reset your
						password.
					</Text>

					{resetSent ? (
						<Alert variant="light" color="green" icon={<Mail size={16} />}>
							Password reset email sent! Check your inbox.
						</Alert>
					) : (
						<form onSubmit={resetForm.onSubmit(handlePasswordReset)}>
							<Stack>
								<TextInput
									label="Email"
									placeholder="your@email.com"
									required
									key={resetForm.key("email")}
									{...resetForm.getInputProps("email")}
								/>
								<Button type="submit" loading={loading} fullWidth>
									Send reset link
								</Button>
							</Stack>
						</form>
					)}

					<Anchor
						component="button"
						onClick={() => {
							setShowForgotPassword(false);
							setResetSent(false);
							setError(null);
						}}
						size="sm"
					>
						Back to sign in
					</Anchor>
				</Stack>
			) : (
				<Tabs value={activeTab} onChange={setActiveTab}>
					<Tabs.List grow>
						<Tabs.Tab value="signin">Sign In</Tabs.Tab>
						<Tabs.Tab value="create">Create Account</Tabs.Tab>
					</Tabs.List>

					{error && (
						<Alert
							variant="light"
							color="red"
							icon={<TriangleAlert size={16} />}
							mt="md"
						>
							{error}
						</Alert>
					)}

					<Tabs.Panel value="signin" pt="md">
						<form onSubmit={signInForm.onSubmit(handleSignIn)}>
							<Stack>
								<TextInput
									label="Email"
									placeholder="your@email.com"
									required
									key={signInForm.key("email")}
									{...signInForm.getInputProps("email")}
								/>
								<PasswordInput
									label="Password"
									placeholder="Your password"
									required
									key={signInForm.key("password")}
									{...signInForm.getInputProps("password")}
								/>
								<Group justify="space-between" mt="xs">
									<Anchor
										component="button"
										onClick={() => setShowForgotPassword(true)}
										size="sm"
									>
										Forgot password?
									</Anchor>
								</Group>
								<Button type="submit" loading={loading} fullWidth>
									Sign In
								</Button>
							</Stack>
						</form>

						<Divider label="or" labelPosition="center" my="md" />

						<Button
							variant="outline"
							fullWidth
							leftSection={<Globe size={18} />}
							onClick={handleGoogleSignIn}
							loading={loading}
						>
							Sign in with Google
						</Button>
					</Tabs.Panel>

					<Tabs.Panel value="create" pt="md">
						<form onSubmit={createForm.onSubmit(handleCreateAccount)}>
							<Stack>
								<TextInput
									label="Name"
									placeholder="Your name"
									required
									key={createForm.key("name")}
									{...createForm.getInputProps("name")}
								/>
								<TextInput
									label="Email"
									placeholder="your@email.com"
									required
									key={createForm.key("email")}
									{...createForm.getInputProps("email")}
								/>
								<PasswordInput
									label="Password"
									placeholder="At least 6 characters"
									required
									key={createForm.key("password")}
									{...createForm.getInputProps("password")}
								/>
								<PasswordInput
									label="Confirm password"
									placeholder="Repeat your password"
									required
									key={createForm.key("confirmPassword")}
									{...createForm.getInputProps("confirmPassword")}
								/>
								<Button type="submit" loading={loading} fullWidth>
									Create Account
								</Button>
							</Stack>
						</form>
					</Tabs.Panel>
				</Tabs>
			)}
		</Modal>
	);
};

export default SignInModal;
