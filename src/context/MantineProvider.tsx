import {
	createTheme,
	MantineProvider as MantineProviderBase,
} from "@mantine/core";
import type { ReactNode } from "react";

export const theme = createTheme({
	primaryColor: "blue",
	fontFamily:
		"WinkySans, system-ui, -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, sans-serif",
	fontFamilyMonospace:
		"ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace",
	headings: {
		fontFamily:
			"ZillaSlab, system-ui, -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, sans-serif",
		fontWeight: "600",
	},
	defaultRadius: "md",
});

interface MantineProviderProps {
	children: ReactNode;
}

export const MantineProvider = ({ children }: MantineProviderProps) => {
	return (
		<MantineProviderBase theme={theme} defaultColorScheme="dark">
			{children}
		</MantineProviderBase>
	);
};
