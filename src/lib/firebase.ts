import { type FirebaseApp, initializeApp } from "firebase/app";
import {
	type Auth,
	browserLocalPersistence,
	GoogleAuthProvider,
	getAuth,
	getRedirectResult,
	linkWithRedirect,
	setPersistence,
	signInAnonymously,
	signInWithRedirect,
	signOut,
} from "firebase/auth";
import {
	enableMultiTabIndexedDbPersistence,
	type Firestore,
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

	if (a.currentUser?.isAnonymous) {
		await linkWithRedirect(a.currentUser, provider);
	} else {
		await signInWithRedirect(a, provider);
	}
};

export const handleRedirectResult = async (): Promise<void> => {
	const a = getFirebaseAuth();
	const result = await getRedirectResult(a);
	return result ? undefined : undefined;
};

export const signOutUser = async (): Promise<void> => {
	const a = getFirebaseAuth();
	await signOut(a);
};
