import { createContext, useContext } from "react";

interface ViewModeContextValue {
	viewMode: string;
	setViewMode: (mode: string) => void;
}

export const ViewModeContext = createContext<ViewModeContextValue | null>(null);

export const useViewMode = (): ViewModeContextValue => {
	const ctx = useContext(ViewModeContext);
	if (!ctx) {
		throw new Error("useViewMode must be used within ViewModeContext.Provider");
	}
	return ctx;
};
