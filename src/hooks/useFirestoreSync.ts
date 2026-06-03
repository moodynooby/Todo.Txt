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
	signOutUser,
} from "@/lib/firebase";
import { readBackup, updateBackup } from "@/lib/persistedState";
import type { Note } from "@/types/notes";

export type SyncStatus =
	| "disconnected"
	| "connecting"
	| "synced"
	| "syncing"
	| "error";

export interface FirestoreSyncState {
	content: string;
	notes?: Note[];
	excalidraw?: ExcalidrawData | null;
	groqApiKey?: string;
}

interface FirestoreSyncOptions {
	localState: FirestoreSyncState;
	onRemoteState: (state: FirestoreSyncState) => void;
}

interface FirestoreSyncReturn {
	isConnected: boolean;
	syncStatus: SyncStatus;
	user: {
		photoURL: string | null;
		displayName: string | null;
		isAnonymous: boolean;
	} | null;
	authError: string | null;
	connect: () => void;
	disconnect: () => void;
}

const WRITE_DEBOUNCE_MS = 1000;
const RETRY_BASE_MS = 500;
const RETRY_MAX_MS = 30000;

const mapUser = (u: User) => ({
	photoURL: u.photoURL,
	displayName: u.displayName,
	isAnonymous: u.isAnonymous,
});

export const useFirestoreSync = ({
	localState,
	onRemoteState,
}: FirestoreSyncOptions): FirestoreSyncReturn => {
	const [user, setUser] = useState<User | null>(null);
	const [isConnected, setIsConnected] = useState(false);
	const [syncStatus, setSyncStatus] = useState<SyncStatus>("disconnected");
	const [authError, setAuthError] = useState<string | null>(null);

	const userRef = useRef<User | null>(null);
	userRef.current = user;
	const syncStatusRef = useRef<SyncStatus>(syncStatus);
	syncStatusRef.current = syncStatus;

	const unsubFirestoreRef = useRef<(() => void) | null>(null);
	const unsubAuthRef = useRef<(() => void) | null>(null);
	const writeTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
	const retryTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
	const retryCountRef = useRef(0);
	const writeSeqRef = useRef(0);
	const lastSyncSeqRef = useRef(0);
	const remoteSeqRef = useRef(0);
	const disconnectGraceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
	const pendingMigrationRef = useRef<string | null>(null);
	const backupReadyRef = useRef(false);

	const onRemoteStateRef = useRef(onRemoteState);
	onRemoteStateRef.current = onRemoteState;

	const { content, notes, excalidraw, groqApiKey } = localState;

	const cancelDisconnectGrace = useCallback(() => {
		if (disconnectGraceRef.current) {
			clearTimeout(disconnectGraceRef.current);
			disconnectGraceRef.current = null;
		}
	}, []);

	const teardownFirestore = useCallback(() => {
		unsubFirestoreRef.current?.();
		unsubFirestoreRef.current = null;
		setIsConnected(false);
		if (retryTimerRef.current) {
			clearTimeout(retryTimerRef.current);
			retryTimerRef.current = null;
		}
	}, []);

	const readFieldsFromDoc = useCallback(
		(data: Record<string, unknown>, isRemote = false) => {
			if (isRemote && writeSeqRef.current > lastSyncSeqRef.current) {
				return;
			}
			const remoteSeq = (data._seq as number) ?? 0;
			if (isRemote && remoteSeq <= remoteSeqRef.current) {
				return;
			}
			remoteSeqRef.current = remoteSeq;
			const state: Partial<FirestoreSyncState> = {};
			if (data.content !== undefined) {
				state.content = data.content as string;
			}
			if (data.notes !== undefined) {
				state.notes = data.notes as Note[];
			}
			if (data.excalidraw !== undefined) {
				state.excalidraw = data.excalidraw as ExcalidrawData;
			}
			if (data.groqApiKey !== undefined) {
				state.groqApiKey = data.groqApiKey as string;
			}
			onRemoteStateRef.current({
				content: state.content ?? "",
				...(state.notes !== undefined && { notes: state.notes }),
				...(state.excalidraw !== undefined && {
					excalidraw: state.excalidraw,
				}),
				...(state.groqApiKey !== undefined && {
					groqApiKey: state.groqApiKey,
				}),
			});
			backupReadyRef.current = true;
		},
		[],
	);

	const writeDoc = useCallback(
		async (uid: string) => {
			const db = getFirestoreDb();
			const docRef = doc(db, "todos", `todo_${uid}`);

			setSyncStatus("syncing");

			const thisSeq = ++writeSeqRef.current;
			const data: Record<string, unknown> = {
				content,
				_seq: thisSeq,
				updatedAt: serverTimestamp(),
			};
			if (notes !== undefined) data.notes = notes;
			if (excalidraw !== undefined) data.excalidraw = excalidraw;
			if (groqApiKey !== undefined) data.groqApiKey = groqApiKey;

			setDoc(docRef, data, { merge: true })
				.then(() => {
					if (thisSeq > lastSyncSeqRef.current) {
						lastSyncSeqRef.current = thisSeq;
						setSyncStatus("synced");
					}
				})
				.catch((e) => {
					console.error("Firestore write error:", e);
					setSyncStatus("error");
				});
		},
		[content, notes, excalidraw, groqApiKey],
	);

	const setupFirestore = useCallback(
		async (uid: string) => {
			const db = getFirestoreDb();
			const docRef = doc(db, "todos", `todo_${uid}`);

			try {
				const docSnap = await getDoc(docRef);
				if (!docSnap.exists()) {
					const migrateFrom = pendingMigrationRef.current;
					pendingMigrationRef.current = null;
					const backup = readBackup();

					if (migrateFrom) {
						const oldRef = doc(db, "todos", `todo_${migrateFrom}`);
						const oldSnap = await getDoc(oldRef);
						if (oldSnap.exists()) {
							const oldData = oldSnap.data();
							await setDoc(docRef, {
								...oldData,
								createdAt: oldData.createdAt ?? serverTimestamp(),
								updatedAt: serverTimestamp(),
							});
							readFieldsFromDoc(oldData as Record<string, unknown>);
						} else if (backup) {
							await setDoc(docRef, {
								...backup.data,
								createdAt: serverTimestamp(),
								updatedAt: serverTimestamp(),
							});
							readFieldsFromDoc(
								backup.data as unknown as Record<string, unknown>,
							);
						} else {
							await setDoc(docRef, {
								content: "",
								createdAt: serverTimestamp(),
								updatedAt: serverTimestamp(),
							});
						}
					} else if (backup) {
						await setDoc(docRef, {
							...backup.data,
							createdAt: serverTimestamp(),
							updatedAt: serverTimestamp(),
						});
						readFieldsFromDoc(
							backup.data as unknown as Record<string, unknown>,
						);
					} else {
						await setDoc(docRef, {
							content: "",
							createdAt: serverTimestamp(),
							updatedAt: serverTimestamp(),
						});
					}
				} else {
					const firestoreData = docSnap.data();
					const backup = readBackup();
					const firestoreTime =
						(
							firestoreData.updatedAt as { toMillis?: () => number }
						)?.toMillis?.() ?? 0;
					if (backup && backup.savedAt > firestoreTime) {
						readFieldsFromDoc(
							backup.data as unknown as Record<string, unknown>,
						);
					} else {
						readFieldsFromDoc(firestoreData as Record<string, unknown>);
					}
				}

				unsubFirestoreRef.current = onSnapshot(
					docRef,
					(snap) => {
						if (!snap.exists()) return;
						if (snap.metadata.hasPendingWrites) return;
						readFieldsFromDoc(snap.data() as Record<string, unknown>, true);
						setSyncStatus("synced");
						cancelDisconnectGrace();
					},
					(err) => {
						console.error("Firestore snapshot error:", err);
						setSyncStatus("error");
						const delay = Math.min(
							RETRY_BASE_MS * 2 ** retryCountRef.current,
							RETRY_MAX_MS,
						);
						retryCountRef.current++;
						retryTimerRef.current = setTimeout(() => {
							setupFirestore(uid);
						}, delay);
					},
				);

				setIsConnected(true);
				retryCountRef.current = 0;
				cancelDisconnectGrace();
				setSyncStatus("synced");
				backupReadyRef.current = true;
			} catch (e) {
				console.error("Firestore setup error:", e);
				setSyncStatus("error");
			}
		},
		[readFieldsFromDoc, cancelDisconnectGrace],
	);

	useEffect(() => {
		if (!isFirebaseConfigured()) return;

		const auth = getFirebaseAuth();

		unsubAuthRef.current = onAuthStateChanged(auth, (firebaseUser) => {
			if (firebaseUser && !firebaseUser.isAnonymous) {
				setUser(firebaseUser);
				setAuthError(null);
				setSyncStatus("connecting");
				setupFirestore(firebaseUser.uid);
			} else {
				cancelDisconnectGrace();
				teardownFirestore();
				setUser(null);
				setSyncStatus("disconnected");
			}
		});

		return () => {
			unsubAuthRef.current?.();
			teardownFirestore();
			cancelDisconnectGrace();
		};
	}, [setupFirestore, teardownFirestore, cancelDisconnectGrace]);

	useEffect(() => {
		if (writeTimerRef.current) clearTimeout(writeTimerRef.current);

		writeTimerRef.current = setTimeout(() => {
			if (backupReadyRef.current) {
				updateBackup({ content, notes, excalidraw, groqApiKey });
			}

			if (!isConnected || !user) return;

			writeDoc(user.uid);
		}, WRITE_DEBOUNCE_MS);

		return () => {
			if (writeTimerRef.current) {
				clearTimeout(writeTimerRef.current);
				writeTimerRef.current = null;
			}
		};
	}, [content, notes, excalidraw, groqApiKey, isConnected, user, writeDoc]);

	const connect = useCallback(async () => {
		cancelDisconnectGrace();
		const currentUser = userRef.current;
		if (currentUser && !currentUser.isAnonymous) {
			teardownFirestore();
			setSyncStatus("connecting");
			await setupFirestore(currentUser.uid);
		}
	}, [teardownFirestore, setupFirestore, cancelDisconnectGrace]);

	const disconnect = useCallback(async () => {
		cancelDisconnectGrace();
		teardownFirestore();
		if (user && !user.isAnonymous) {
			try {
				await signOutUser();
			} catch (e) {
				console.error("Sign out error:", e);
			}
		}
	}, [teardownFirestore, user, cancelDisconnectGrace]);

	return {
		isConnected,
		syncStatus,
		user: user ? mapUser(user) : null,
		authError,
		connect,
		disconnect,
	};
};
