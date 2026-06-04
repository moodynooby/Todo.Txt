import { useLocalStorage } from "@mantine/hooks";
import {
	createContext,
	type ReactNode,
	useCallback,
	useContext,
	useReducer,
} from "react";
import {
	defaults,
	type PersistedState,
	STORAGE_KEY,
} from "@/lib/persistedState";

export interface ViewState {
	viewMode: string;
	sidebarCollapsed: boolean;
}

export type ViewAction =
	| { type: "SET_VIEW_MODE"; payload: string }
	| { type: "TOGGLE_SIDEBAR" };

export function viewReducer(state: ViewState, action: ViewAction): ViewState {
	switch (action.type) {
		case "SET_VIEW_MODE":
			return { ...state, viewMode: action.payload };
		case "TOGGLE_SIDEBAR":
			return { ...state, sidebarCollapsed: !state.sidebarCollapsed };
		default:
			return state;
	}
}

export const initialViewState: ViewState = {
	viewMode: "todo",
	sidebarCollapsed: false,
};

interface ViewContextValue {
	state: ViewState;
	dispatchView: (action: ViewAction) => void;
}

export const ViewContext = createContext<ViewContextValue | null>(null);

export const useViewContext = (): ViewContextValue => {
	const ctx = useContext(ViewContext);
	if (!ctx) {
		throw new Error("useViewContext must be used within ViewContext.Provider");
	}
	return ctx;
};

interface ViewProviderProps {
	children: ReactNode;
}

export function ViewProvider({ children }: ViewProviderProps) {
	const [persisted, setPersisted] = useLocalStorage<PersistedState>({
		key: STORAGE_KEY,
		defaultValue: defaults,
	});

	const [state, dispatchReducer] = useReducer(viewReducer, {
		...initialViewState,
		viewMode: persisted.viewMode ?? "todo",
		sidebarCollapsed: persisted.sidebarCollapsed ?? false,
	});

	const dispatchView = useCallback(
		(action: ViewAction) => {
			dispatchReducer(action);
			if (action.type === "SET_VIEW_MODE") {
				setPersisted((p) => ({ ...p, viewMode: action.payload }));
			}
			if (action.type === "TOGGLE_SIDEBAR") {
				setPersisted((p) => ({ ...p, sidebarCollapsed: !p.sidebarCollapsed }));
			}
		},
		[setPersisted],
	);

	return (
		<ViewContext.Provider value={{ state, dispatchView }}>
			{children}
		</ViewContext.Provider>
	);
}
