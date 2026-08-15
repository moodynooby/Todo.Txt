import {
	createTheme,
	MantineProvider as MantineProviderBase,
} from "@mantine/core";
import type { ReactNode } from "react";

export const theme = createTheme({
	primaryColor: "evergreen",
	colors: {
		evergreen: [
			"#eff5ef",
			"#e3ede3",
			"#cadcc9",
			"#a9c2a7",
			"#83a57f",
			"#638a60",
			"#49734b",
			"#365d3d",
			"#294b33",
			"#1d3c28",
		],
		terracotta: [
			"#fff1ea",
			"#ffe1d3",
			"#fbc2aa",
			"#f5a07b",
			"#e98558",
			"#d9784f",
			"#b85b36",
			"#934629",
			"#77391f",
			"#623018",
		],
	},
	fontFamily:
		"WinkySans, system-ui, -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, sans-serif",
	fontFamilyMonospace:
		"ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace",
	headings: {
		fontFamily:
			"ZillaSlab, system-ui, -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, sans-serif",
		fontWeight: "500",
	},
	defaultRadius: "lg",
	components: {
		Button: { defaultProps: { radius: "md" } },
		ActionIcon: { defaultProps: { radius: "md" } },
		Paper: { defaultProps: { radius: "lg" } },
	},
});

interface MantineProviderProps {
	children: ReactNode;
}

export const MantineProvider = ({ children }: MantineProviderProps) => {
	return (
		<MantineProviderBase theme={theme} defaultColorScheme="light">
			{children}
		</MantineProviderBase>
	);
};
