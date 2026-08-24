import {
	createContext,
	type ReactNode,
	useContext,
	useEffect,
	useReducer,
} from "react";
import { getFirebaseAuthAsync, isFirebaseConfigured } from "@/lib/firebase";
import type { SyncStatus } from "@/types/sync";

export interface AuthState {
	user: {
		uid: string;
		photoURL: string | null;
		displayName: string | null;
	} | null;
	isConnected: boolean;
	syncStatus: SyncStatus;
	authError: string | null;
}

export type AuthAction =
	| {
			type: "SET_USER";
			payload: {
				uid: string;
				photoURL: string | null;
				displayName: string | null;
			} | null;
	  }
	| { type: "SET_CONNECTED"; payload: boolean }
	| { type: "SET_SYNC_STATUS"; payload: SyncStatus }
	| { type: "SET_ERROR"; payload: string | null };

export function authReducer(state: AuthState, action: AuthAction): AuthState {
	switch (action.type) {
		case "SET_USER":
			return { ...state, user: action.payload };
		case "SET_CONNECTED":
			return { ...state, isConnected: action.payload };
		case "SET_SYNC_STATUS":
			return { ...state, syncStatus: action.payload };
		case "SET_ERROR":
			return { ...state, authError: action.payload };
		default:
			return state;
	}
}

export const initialAuthState: AuthState = {
	user: null,
	isConnected: false,
	syncStatus: "disconnected",
	authError: null,
};

interface AuthContextValue {
	state: AuthState;
	dispatchAuth: (action: AuthAction) => void;
}

export const AuthContext = createContext<AuthContextValue | null>(null);

export const useAuthContext = (): AuthContextValue => {
	const ctx = useContext(AuthContext);
	if (!ctx) {
		throw new Error("useAuthContext must be used within AuthContext.Provider");
	}
	return ctx;
};

interface AuthProviderProps {
	children: ReactNode;
}

const mapUser = (u: {
	uid: string;
	photoURL: string | null;
	displayName: string | null;
}) => ({
	uid: u.uid,
	photoURL: u.photoURL,
	displayName: u.displayName,
});

export function AuthProvider({ children }: AuthProviderProps) {
	const [state, dispatchAuth] = useReducer(authReducer, initialAuthState);

	useEffect(() => {
		if (!isFirebaseConfigured()) return;

		let unsub: (() => void) | null = null;
		let cancelled = false;

		const subscribe = async () => {
			try {
				const { onAuthStateChanged } = await import("firebase/auth");
				if (cancelled) return;
				unsub = onAuthStateChanged(await getFirebaseAuthAsync(), (user) => {
					if (user) {
						dispatchAuth({
							type: "SET_USER",
							payload: mapUser(user),
						});
						dispatchAuth({ type: "SET_ERROR", payload: null });
					} else {
						dispatchAuth({ type: "SET_USER", payload: null });
					}
				});
			} catch (e) {
				console.error("Firebase auth init failed:", e);
			}
		};

		// Defer the SDK load past first paint so session restore never competes
		// with startup rendering; the app renders signed-out meanwhile.
		let handle: number;
		if (typeof window.requestIdleCallback === "function") {
			handle = window.requestIdleCallback(() => void subscribe());
		} else {
			handle = window.setTimeout(() => void subscribe(), 300);
		}

		return () => {
			cancelled = true;
			if (typeof window.cancelIdleCallback === "function") {
				window.cancelIdleCallback(handle);
			} else {
				clearTimeout(handle);
			}
			unsub?.();
		};
	}, []);

	return (
		<AuthContext.Provider value={{ state, dispatchAuth }}>
			{children}
		</AuthContext.Provider>
	);
}
