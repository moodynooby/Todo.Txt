import { createContext, type ReactNode, useContext, useReducer } from "react";
import type { SyncStatus } from "@/hooks/useFirestoreSync";

export interface AuthState {
	user: {
		photoURL: string | null;
		displayName: string | null;
		isAnonymous: boolean;
	} | null;
	isConnected: boolean;
	syncStatus: SyncStatus;
	authError: string | null;
}

export type AuthAction =
	| {
			type: "SET_USER";
			payload: {
				photoURL: string | null;
				displayName: string | null;
				isAnonymous: boolean;
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

export function AuthProvider({ children }: AuthProviderProps) {
	const [state, dispatchAuth] = useReducer(authReducer, initialAuthState);

	return (
		<AuthContext.Provider value={{ state, dispatchAuth }}>
			{children}
		</AuthContext.Provider>
	);
}
