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
} from "../lib/firebase";

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
}: FirestoreSyncOptions): FirestoreSyncReturn => {
	const [user, setUser] = useState<User | null>(null);
	const [isConnected, setIsConnected] = useState(false);
	const [syncStatus, setSyncStatus] = useState<SyncStatus>("disconnected");

	const unsubFirestoreRef = useRef<(() => void) | null>(null);
	const unsubAuthRef = useRef<(() => void) | null>(null);
	const isRemoteUpdateRef = useRef(false);
	const lastSyncedContentRef = useRef("");
	const lastSyncedPrefsRef = useRef("");
	const contentRef = useRef(content);
	const preferencesRef = useRef(preferences);

	contentRef.current = content;
	preferencesRef.current = preferences;

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
					let hasRemoteUpdate = false;

					if (data.content && data.content !== contentRef.current) {
						isRemoteUpdateRef.current = true;
						onRemoteContent(data.content);
						lastSyncedContentRef.current = data.content;
						hasRemoteUpdate = true;
					}

					if (data.preferences && onRemotePreferences) {
						const prefsStr = JSON.stringify(data.preferences);
						if (prefsStr !== lastSyncedPrefsRef.current) {
							onRemotePreferences(data.preferences);
							lastSyncedPrefsRef.current = prefsStr;
						}
					}

					if (hasRemoteUpdate) {
						setTimeout(() => {
							isRemoteUpdateRef.current = false;
						}, 200);
					}
				}

				unsubFirestoreRef.current = onSnapshot(
					docRef,
					(snap) => {
						if (!snap.exists()) return;
						const data = snap.data();
						let hasRemoteUpdate = false;

						if (
							data.content &&
							data.content !== lastSyncedContentRef.current &&
							data.content !== contentRef.current
						) {
							isRemoteUpdateRef.current = true;
							onRemoteContent(data.content);
							lastSyncedContentRef.current = data.content;
							hasRemoteUpdate = true;
						}

						if (data.preferences && onRemotePreferences) {
							const prefsStr = JSON.stringify(data.preferences);
							if (prefsStr !== lastSyncedPrefsRef.current) {
								onRemotePreferences(data.preferences);
								lastSyncedPrefsRef.current = prefsStr;
							}
						}

						if (hasRemoteUpdate) {
							setTimeout(() => {
								isRemoteUpdateRef.current = false;
							}, 200);
						}
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
		[onRemoteContent, onRemotePreferences],
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
		if (
			!isConnected ||
			!user ||
			isRemoteUpdateRef.current ||
			!isFirebaseConfigured()
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

		setDoc(docRef, data, { merge: true })
			.then(() => {
				setSyncStatus("synced");
			})
			.catch((e) => {
				console.error("Firestore write error:", e);
				setSyncStatus("error");
			});
	}, [content, preferences, isConnected, user]);

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
