import { onAuthStateChanged, type User } from "firebase/auth";
import {
	doc,
	getDoc,
	onSnapshot,
	serverTimestamp,
	setDoc,
} from "firebase/firestore";
import { useCallback, useEffect, useRef, useState } from "react";
import {
	getFirebaseAuth,
	getFirestoreDb,
	handleRedirectResult,
	isFirebaseConfigured,
	signInWithGoogle,
	signOutUser,
} from "@/lib/firebase";
import type { Note } from "@/types/notes";

export type SyncStatus =
	| "disconnected"
	| "connecting"
	| "synced"
	| "syncing"
	| "error";

interface FirestoreSyncOptions {
	content: string;
	onRemoteContent: (content: string) => void;
	preferences?: Record<string, unknown>;
	onRemotePreferences?: (prefs: Record<string, unknown>) => void;
	notes?: Note[];
	onRemoteNotes?: (notes: Note[]) => void;
}

interface FirestoreSyncReturn {
	isConnected: boolean;
	syncStatus: SyncStatus;
	user: { photoURL: string | null; displayName: string | null } | null;
	connect: () => Promise<void>;
	disconnect: () => Promise<void>;
}

export const useFirestoreSync = ({
	content,
	onRemoteContent,
	preferences,
	onRemotePreferences,
	notes,
	onRemoteNotes,
}: FirestoreSyncOptions): FirestoreSyncReturn => {
	const [user, setUser] = useState<User | null>(null);
	const [isConnected, setIsConnected] = useState(false);
	const [syncStatus, setSyncStatus] = useState<SyncStatus>("disconnected");

	const unsubFirestoreRef = useRef<(() => void) | null>(null);
	const unsubAuthRef = useRef<(() => void) | null>(null);
	const lastSyncedContentRef = useRef("");
	const lastSyncedPrefsRef = useRef("{}");
	const lastSyncedNotesRef = useRef("[]");
	const contentRef = useRef(content);

	contentRef.current = content;

	const teardownFirestore = useCallback(() => {
		unsubFirestoreRef.current?.();
		unsubFirestoreRef.current = null;
		setIsConnected(false);
		setSyncStatus("disconnected");
	}, []);

	const setupFirestore = useCallback(
		async (uid: string) => {
			if (!isFirebaseConfigured()) return;

			const db = getFirestoreDb();
			const docId = `todo_${uid}`;
			const docRef = doc(db, "todos", docId);

			await handleRedirectResult();

			const processRemoteData = (
				data: Record<string, unknown>,
				checkLastSyncedForContent: boolean,
			) => {
				if (data.content) {
					const content = data.content as string;
					const isNewContent = checkLastSyncedForContent
						? content !== lastSyncedContentRef.current &&
							content !== contentRef.current
						: content !== contentRef.current;
					if (isNewContent) {
						onRemoteContent(content);
						lastSyncedContentRef.current = content;
					}
				}
				if (data.notes && onRemoteNotes) {
					const notesStr = JSON.stringify(data.notes);
					if (notesStr !== lastSyncedNotesRef.current) {
						onRemoteNotes(data.notes as Note[]);
						lastSyncedNotesRef.current = notesStr;
					}
				}
				if (data.preferences && onRemotePreferences) {
					const prefs = data.preferences as Record<string, unknown>;
					const prefsStr = JSON.stringify(prefs);
					if (prefsStr !== lastSyncedPrefsRef.current) {
						onRemotePreferences(prefs);
						lastSyncedPrefsRef.current = prefsStr;
					}
				}
			};

			try {
				const docSnap = await getDoc(docRef);
				if (!docSnap.exists()) {
					await setDoc(docRef, {
						content: "",
						preferences: {},
						createdAt: serverTimestamp(),
						updatedAt: serverTimestamp(),
					});
				} else {
					const data = docSnap.data();
					processRemoteData(data, false);
				}

				unsubFirestoreRef.current = onSnapshot(
					docRef,
					(snap) => {
						if (!snap.exists()) return;
						const data = snap.data();
						processRemoteData(data, true);
						setSyncStatus("synced");
					},
					(err) => {
						console.error("Firestore snapshot error:", err);
						setSyncStatus("error");
					},
				);

				setIsConnected(true);
				setSyncStatus("synced");
			} catch (e) {
				console.error("Firestore setup error:", e);
				setSyncStatus("error");
			}
		},
		[onRemoteContent, onRemotePreferences, onRemoteNotes],
	);

	useEffect(() => {
		if (!isFirebaseConfigured()) return;

		const auth = getFirebaseAuth();
		unsubAuthRef.current = onAuthStateChanged(auth, async (firebaseUser) => {
			if (firebaseUser) {
				setUser(firebaseUser);
				setSyncStatus("connecting");
				await setupFirestore(firebaseUser.uid);
			} else {
				setUser(null);
				teardownFirestore();
			}
		});

		return () => {
			unsubAuthRef.current?.();
			unsubFirestoreRef.current?.();
		};
	}, [setupFirestore, teardownFirestore]);

	useEffect(() => {
		if (!isConnected || !user || !isFirebaseConfigured()) return;

		if (
			content === lastSyncedContentRef.current &&
			JSON.stringify(preferences ?? {}) === lastSyncedPrefsRef.current &&
			JSON.stringify(notes ?? []) === lastSyncedNotesRef.current
		)
			return;

		const db = getFirestoreDb();
		const docId = `todo_${user.uid}`;
		const docRef = doc(db, "todos", docId);
		lastSyncedContentRef.current = content;
		setSyncStatus("syncing");

		const data: Record<string, unknown> = {
			content,
			updatedAt: serverTimestamp(),
		};

		if (preferences) {
			data.preferences = preferences;
			lastSyncedPrefsRef.current = JSON.stringify(preferences);
		}

		if (notes) {
			data.notes = notes;
			lastSyncedNotesRef.current = JSON.stringify(notes);
		}

		setDoc(docRef, data, { merge: true })
			.then(() => {
				setSyncStatus("synced");
			})
			.catch((e) => {
				console.error("Firestore write error:", e);
				setSyncStatus("error");
			});
	}, [content, preferences, notes, isConnected, user]);

	const connect = useCallback(async () => {
		setSyncStatus("connecting");
		try {
			await signInWithGoogle();
		} catch (err: unknown) {
			const message = err instanceof Error ? err.message : "Failed to sign in";
			console.error("Login error:", message);
			setSyncStatus("error");
		}
	}, []);

	const disconnect = useCallback(async () => {
		teardownFirestore();
		try {
			await signOutUser();
		} catch (e) {
			console.error("Sign out error:", e);
		}
	}, [teardownFirestore]);

	return {
		isConnected,
		syncStatus,
		user: user
			? { photoURL: user.photoURL, displayName: user.displayName }
			: null,
		connect,
		disconnect,
	};
};
