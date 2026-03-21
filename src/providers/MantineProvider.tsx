import {
	createTheme,
	MantineProvider as MantineProviderBase,
} from "@mantine/core";
import { Notifications } from "@mantine/notifications";
import type { ReactNode } from "react";

export const theme = createTheme({
	primaryColor: "violet",
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
	components: {
		Button: {
			defaultProps: {
				size: "sm",
			},
		},
		ActionIcon: {
			defaultProps: {
				variant: "subtle",
			},
		},
		Modal: {
			defaultProps: {
				radius: "lg",
				centered: true,
			},
		},
		Paper: {
			defaultProps: {
				radius: "md",
			},
		},
		TextInput: {
			defaultProps: {
				radius: "md",
			},
		},
		Textarea: {
			defaultProps: {
				radius: "md",
			},
		},
		Menu: {
			defaultProps: {
				radius: "md",
			},
		},
		Tooltip: {
			defaultProps: {
				radius: "md",
			},
		},
	},
});

interface MantineProviderProps {
	children: ReactNode;
}

export const MantineProvider = ({ children }: MantineProviderProps) => {
	return (
		<MantineProviderBase theme={theme} defaultColorScheme="dark">
			<Notifications position="top-right" />
			{children}
		</MantineProviderBase>
	);
};
