import type { FirebaseApp } from "firebase/app";
import type { Auth } from "firebase/auth";
import type { Firestore } from "firebase/firestore";

const firebaseConfig = {
	apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
	authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
	projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
	storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
	messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
	appId: import.meta.env.VITE_FIREBASE_APP_ID,
	measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID,
};

interface FirebaseContext {
	app: FirebaseApp;
	auth: Auth;
	db: Firestore;
}

/* Firebase used to be over half of the eager bundle, and local-only sessions
 * (no .env configured) never need it at all. The SDK is therefore loaded on
 * first use — sign-in, or the sync engine's first read/write — never during
 * app boot. */
let initPromise: Promise<FirebaseContext> | null = null;

export const ensureFirebase = (): Promise<FirebaseContext> => {
	initPromise ??= (async () => {
		try {
			const [{ initializeApp }, authMod, firestoreMod] = await Promise.all([
				import("firebase/app"),
				import("firebase/auth"),
				import("firebase/firestore"),
			]);
			const app = initializeApp(firebaseConfig);
			const auth = authMod.getAuth(app);
			const db = firestoreMod.initializeFirestore(app, {
				cacheSizeBytes: 100000000,
			});
			authMod
				.setPersistence(auth, authMod.browserLocalPersistence)
				.catch((err) => {
					console.error("Failed to set auth persistence:", err);
				});
			return { app, auth, db };
		} catch (e) {
			// Allow a later call to retry (transient network failure); config
			// errors simply fail again, which is the correct outcome.
			initPromise = null;
			throw e;
		}
	})();
	return initPromise;
};

export const getFirebaseAuthAsync = async (): Promise<Auth> =>
	(await ensureFirebase()).auth;

export const getFirestoreDbAsync = async (): Promise<Firestore> =>
	(await ensureFirebase()).db;

// Fix F13: the old check validated only the API key, so a corrupted or
// placeholder `authDomain` / `projectId` passed it and surfaced later as an
// opaque auth error. Every field the SDK requires must be present and
// non-placeholder now.
const PLACEHOLDER_KEYS = new Set([
	"your_api_key_here",
	"your_project.firebaseapp.com",
	"your_project_id",
	"your_project.appspot.com",
	"your_sender_id",
	"your_app_id",
]);

export const isFirebaseConfigured = (): boolean => {
	const fields = [
		import.meta.env.VITE_FIREBASE_API_KEY,
		import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
		import.meta.env.VITE_FIREBASE_PROJECT_ID,
		import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
		import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
		import.meta.env.VITE_FIREBASE_APP_ID,
	];
	return fields.every(
		(value) => !!value && !PLACEHOLDER_KEYS.has(value as string),
	);
};

export const signInWithGoogle = async (): Promise<void> => {
	const a = await getFirebaseAuthAsync();
	const { GoogleAuthProvider, signInWithPopup } = await import("firebase/auth");
	const provider = new GoogleAuthProvider();

	try {
		await signInWithPopup(a, provider);
	} catch (error: unknown) {
		if (error instanceof Error) {
			const code = (error as { code?: string }).code;
			if (code === "auth/popup-blocked") {
				throw new Error(
					"Popup was blocked. Please allow popups for this site in your browser settings and try again.",
				);
			}
			if (code === "auth/popup-closed-by-user") {
				throw new Error(
					"Sign-in popup was closed before completing. Please try again.",
				);
			}
			if (code === "auth/cancelled-popup-request") {
				return;
			}
		}
		throw error;
	}
};

export const signInWithEmail = async (
	email: string,
	password: string,
): Promise<void> => {
	const a = await getFirebaseAuthAsync();
	const { signInWithEmailAndPassword } = await import("firebase/auth");
	await signInWithEmailAndPassword(a, email, password);
};

export const createAccount = async (
	email: string,
	password: string,
	displayName: string,
): Promise<void> => {
	const a = await getFirebaseAuthAsync();
	const { createUserWithEmailAndPassword, updateProfile } = await import(
		"firebase/auth"
	);
	const result = await createUserWithEmailAndPassword(a, email, password);
	await updateProfile(result.user, { displayName });
};

export const sendPasswordReset = async (email: string): Promise<void> => {
	const a = await getFirebaseAuthAsync();
	const { sendPasswordResetEmail } = await import("firebase/auth");
	await sendPasswordResetEmail(a, email);
};

export const signOutUser = async (): Promise<void> => {
	const a = await getFirebaseAuthAsync();
	const { signOut } = await import("firebase/auth");
	await signOut(a);
};

/**
 * Attach (or change) an email/password credential on the CURRENTLY signed-in
 * account. This is what lets a Google-only web account also sign in from the
 * native apps with the same email — linking keeps the SAME uid, so cloud
 * documents under `users/{uid}` converge across platforms.
 *
 * - Account already has a password provider → updatePassword.
 * - Google-only account → linkWithCredential (same uid gains a password).
 * - "credential-already-in-use" → a password account already exists for this
 *   email; the user should simply sign in with it instead.
 */
export const setAccountPassword = async (password: string): Promise<void> => {
	const auth = await getFirebaseAuthAsync();
	const user = auth.currentUser;
	if (!user?.email) {
		throw new Error("No signed-in account with an email address.");
	}
	const { EmailAuthProvider, linkWithCredential, updatePassword } =
		await import("firebase/auth");
	const hasPassword = user.providerData.some(
		(p) => p.providerId === "password",
	);
	if (hasPassword) {
		await updatePassword(user, password);
	} else {
		await linkWithCredential(
			user,
			EmailAuthProvider.credential(user.email, password),
		);
	}
};
