import { createContext, type ReactNode, useContext, useEffect } from "react";
import { useLocalStorage } from "../hooks/useLocalStorage";

interface ThemeContextType {
	isDark: boolean;
	toggleTheme: () => void;
	setTheme: (dark: boolean) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const useTheme = (): ThemeContextType => {
	const context = useContext(ThemeContext);
	if (!context) {
		throw new Error("useTheme must be used within a ThemeProvider");
	}
	return context;
};

interface ThemeProviderProps {
	children: ReactNode;
}

export const ThemeProvider = ({ children }: ThemeProviderProps) => {
	const getSystemTheme = (): boolean => {
		return window.matchMedia?.("(prefers-color-scheme: dark)").matches ?? false;
	};

	const [isDark, setIsDark] = useLocalStorage<boolean>(
		"isdark",
		getSystemTheme(),
	);

	useEffect(() => {
		document.documentElement.setAttribute(
			"data-theme",
			isDark ? "sunset" : "fantasy ",
		);
	}, [isDark]);

	const toggleTheme = (): void => {
		setIsDark((prev) => !prev);
	};

	const setTheme = (dark: boolean): void => {
		setIsDark(dark);
	};

	return (
		<ThemeContext.Provider value={{ isDark, toggleTheme, setTheme }}>
			{children}
		</ThemeContext.Provider>
	);
};
