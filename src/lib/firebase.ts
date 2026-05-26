import { type FirebaseApp, initializeApp } from "firebase/app";
import {
	type Auth,
	browserLocalPersistence,
	GoogleAuthProvider,
	getAuth,
	linkWithPopup,
	setPersistence,
	signInAnonymously,
	signInWithPopup,
	signOut,
} from "firebase/auth";
import {
	type Firestore,
	enableMultiTabIndexedDbPersistence,
	getFirestore,
} from "firebase/firestore";

const firebaseConfig = {
	apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
	authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
	projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
	storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
	messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
	appId: import.meta.env.VITE_FIREBASE_APP_ID,
	measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID,
};

let app: FirebaseApp;
let auth: Auth;
let db: Firestore;
let initError: string | null = null;

try {
	app = initializeApp(firebaseConfig);
	auth = getAuth(app);
	db = getFirestore(app);
	enableMultiTabIndexedDbPersistence(db).catch((err) => {
		console.error("Failed to enable Firestore persistence:", err);
	});
	setPersistence(auth, browserLocalPersistence).catch((err) => {
		console.error("Failed to set auth persistence:", err);
	});
} catch (e) {
	initError = e instanceof Error ? e.message : "Failed to initialize Firebase";
}

export const getFirebaseApp = (): FirebaseApp => {
	if (!app) throw new Error(initError || "Firebase not initialized");
	return app;
};

export const getFirebaseAuth = (): Auth => {
	if (!auth) throw new Error(initError || "Firebase not initialized");
	return auth;
};

export const getFirestoreDb = (): Firestore => {
	if (!db) throw new Error(initError || "Firebase not initialized");
	return db;
};

export const isFirebaseConfigured = (): boolean => {
	return (
		!!import.meta.env.VITE_FIREBASE_API_KEY &&
		import.meta.env.VITE_FIREBASE_API_KEY !== "your_api_key_here"
	);
};

export const loginAnonymously = async (): Promise<void> => {
	const a = getFirebaseAuth();
	await signInAnonymously(a);
};

export const signInWithGoogle = async (): Promise<void> => {
	const a = getFirebaseAuth();
	const provider = new GoogleAuthProvider();

	try {
		if (a.currentUser?.isAnonymous) {
			await linkWithPopup(a.currentUser, provider);
		} else {
			await signInWithPopup(a, provider);
		}
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

export const signOutUser = async (): Promise<void> => {
	const a = getFirebaseAuth();
	await signOut(a);
};
