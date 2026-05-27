import { onAuthStateChanged, type User } from "firebase/auth";
import {
	doc,
	getDoc,
	onSnapshot,
	serverTimestamp,
	setDoc,
} from "firebase/firestore";
import { useCallback, useEffect, useRef, useState } from "react";
import type { ExcalidrawData } from "@/lib/excalidrawSync";
import {
	getFirebaseAuth,
	getFirestoreDb,
	isFirebaseConfigured,
	loginAnonymously,
	signInWithGoogle,
	signOutUser,
} from "@/lib/firebase";
import type { Note } from "@/types/notes";
import type { TimerData } from "./useTimers";

export type SyncStatus =
	| "disconnected"
	| "connecting"
	| "synced"
	| "syncing"
	| "error";

interface FirestoreSyncOptions {
	content: string;
	onRemoteContent: (content: string) => void;
	notes?: Note[];
	onRemoteNotes?: (notes: Note[]) => void;
	excalidraw?: ExcalidrawData | null;
	onRemoteExcalidraw?: (data: ExcalidrawData | null) => void;
	groqApiKey?: string;
	onRemoteGroqApiKey?: (key: string) => void;
	timers?: TimerData[];
	onRemoteTimers?: (timers: TimerData[]) => void;
}

interface FirestoreSyncReturn {
	isConnected: boolean;
	syncStatus: SyncStatus;
	user: {
		photoURL: string | null;
		displayName: string | null;
		isAnonymous: boolean;
	} | null;
	connect: () => Promise<void>;
	disconnect: () => Promise<void>;
}

export const useFirestoreSync = ({
	content,
	onRemoteContent,
	notes,
	onRemoteNotes,
	excalidraw,
	onRemoteExcalidraw,
	groqApiKey,
	onRemoteGroqApiKey,
	timers,
	onRemoteTimers,
}: FirestoreSyncOptions): FirestoreSyncReturn => {
	const [user, setUser] = useState<User | null>(null);
	const [isConnected, setIsConnected] = useState(false);
	const [syncStatus, setSyncStatus] = useState<SyncStatus>("disconnected");

	const unsubFirestoreRef = useRef<(() => void) | null>(null);
	const unsubAuthRef = useRef<(() => void) | null>(null);
	const hasAttemptedAnonymousRef = useRef(false);
	const setupRanRef = useRef(false);

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

			try {
				const docSnap = await getDoc(docRef);
				if (!docSnap.exists()) {
					await setDoc(docRef, {
						content: "",
						createdAt: serverTimestamp(),
						updatedAt: serverTimestamp(),
					});
				} else {
					const data = docSnap.data() as Record<string, unknown>;
					if (data.content) onRemoteContent(data.content as string);
					if (data.notes && onRemoteNotes) onRemoteNotes(data.notes as Note[]);
					if (data.excalidraw && onRemoteExcalidraw)
						onRemoteExcalidraw(data.excalidraw as ExcalidrawData);
					if (data.groqApiKey !== undefined && onRemoteGroqApiKey)
						onRemoteGroqApiKey(data.groqApiKey as string);
					if (data.timers && onRemoteTimers)
						onRemoteTimers(data.timers as TimerData[]);
				}

				unsubFirestoreRef.current = onSnapshot(
					docRef,
					(snap) => {
						if (!snap.exists()) return;
						if (snap.metadata.hasPendingWrites) return;

						const data = snap.data() as Record<string, unknown>;
						if (data.content !== undefined)
							onRemoteContent(data.content as string);
						if (data.notes !== undefined && onRemoteNotes)
							onRemoteNotes(data.notes as Note[]);
						if (data.excalidraw !== undefined && onRemoteExcalidraw)
							onRemoteExcalidraw(data.excalidraw as ExcalidrawData);
						if (data.groqApiKey !== undefined && onRemoteGroqApiKey)
							onRemoteGroqApiKey(data.groqApiKey as string);
						if (data.timers !== undefined && onRemoteTimers)
							onRemoteTimers(data.timers as TimerData[]);
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
		[
			onRemoteContent,
			onRemoteNotes,
			onRemoteExcalidraw,
			onRemoteGroqApiKey,
			onRemoteTimers,
		],
	);

	useEffect(() => {
		if (setupRanRef.current) return;
		setupRanRef.current = true;

		if (!isFirebaseConfigured()) return;

		const auth = getFirebaseAuth();
		unsubAuthRef.current = onAuthStateChanged(auth, async (firebaseUser) => {
			if (firebaseUser) {
				setUser(firebaseUser);
				setSyncStatus("connecting");
				await setupFirestore(firebaseUser.uid);
			} else if (!hasAttemptedAnonymousRef.current) {
				hasAttemptedAnonymousRef.current = true;
				setSyncStatus("connecting");
				try {
					await loginAnonymously();
				} catch (e) {
					console.error("Anonymous sign-in failed:", e);
					setSyncStatus("disconnected");
				}
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

		const db = getFirestoreDb();
		const docRef = doc(db, "todos", `todo_${user.uid}`);

		setSyncStatus("syncing");

		const data: Record<string, unknown> = {
			content,
			updatedAt: serverTimestamp(),
		};

		if (notes !== undefined) data.notes = notes;
		if (excalidraw !== undefined) data.excalidraw = excalidraw;
		if (groqApiKey !== undefined) data.groqApiKey = groqApiKey;
		if (timers !== undefined) data.timers = timers;

		setDoc(docRef, data, { merge: true })
			.then(() => {
				setSyncStatus("synced");
			})
			.catch((e) => {
				console.error("Firestore write error:", e);
				setSyncStatus("error");
			});
	}, [content, notes, excalidraw, groqApiKey, timers, isConnected, user]);

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
			hasAttemptedAnonymousRef.current = false;
			await loginAnonymously();
		} catch (e) {
			console.error("Sign out error:", e);
		}
	}, [teardownFirestore]);

	return {
		isConnected,
		syncStatus,
		user: user
			? {
					photoURL: user.photoURL,
					displayName: user.displayName,
					isAnonymous: user.isAnonymous,
				}
			: null,
		connect,
		disconnect,
	};
};
