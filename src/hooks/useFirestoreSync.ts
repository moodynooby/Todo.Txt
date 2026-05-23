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
}

interface FirestoreSyncReturn {
	isConnected: boolean;
	syncStatus: SyncStatus;
	connect: () => Promise<void>;
	disconnect: () => Promise<void>;
}

export const useFirestoreSync = ({
	content,
	onRemoteContent,
}: FirestoreSyncOptions): FirestoreSyncReturn => {
	const [user, setUser] = useState<User | null>(null);
	const [isConnected, setIsConnected] = useState(false);
	const [syncStatus, setSyncStatus] = useState<SyncStatus>("disconnected");

	const unsubFirestoreRef = useRef<(() => void) | null>(null);
	const unsubAuthRef = useRef<(() => void) | null>(null);
	const isRemoteUpdateRef = useRef(false);
	const lastSyncedContentRef = useRef("");
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

			try {
				const docSnap = await getDoc(docRef);
				if (!docSnap.exists()) {
					await setDoc(docRef, {
						content: "",
						createdAt: serverTimestamp(),
						updatedAt: serverTimestamp(),
					});
				} else {
					const data = docSnap.data();
					if (data.content && data.content !== contentRef.current) {
						isRemoteUpdateRef.current = true;
						onRemoteContent(data.content);
						lastSyncedContentRef.current = data.content;
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
						if (
							data.content &&
							data.content !== lastSyncedContentRef.current &&
							data.content !== contentRef.current
						) {
							isRemoteUpdateRef.current = true;
							onRemoteContent(data.content);
							lastSyncedContentRef.current = data.content;
							setTimeout(() => {
								isRemoteUpdateRef.current = false;
							}, 200);
						}
						setSyncStatus("synced");
					},
					() => {
						setSyncStatus("error");
					},
				);

				setIsConnected(true);
				setSyncStatus("synced");
			} catch {
				setSyncStatus("error");
			}
		},
		[onRemoteContent],
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

		setDoc(docRef, { content, updatedAt: serverTimestamp() }, { merge: true })
			.then(() => {
				setSyncStatus("synced");
			})
			.catch(() => {
				setSyncStatus("error");
			});
	}, [content, isConnected, user]);

	const connect = useCallback(async () => {
		setSyncStatus("connecting");
		try {
			await signInWithGoogle();
		} catch {
			setSyncStatus("error");
		}
	}, []);

	const disconnect = useCallback(async () => {
		teardownFirestore();
		try {
			await signOutUser();
		} catch {
			/* noop */
		}
	}, [teardownFirestore]);

	return {
		isConnected,
		syncStatus,
		connect,
		disconnect,
	};
};
