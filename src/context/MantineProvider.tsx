import { MantineProvider as MantineProviderBase } from "@mantine/core";
import type { ReactNode } from "react";
import { m3Theme } from "@/theme/m3Theme";

interface MantineProviderProps {
	children: ReactNode;
}

/**
 * Root design provider for Todo.Txt.
 *
 * All visual customization flows through the Mantine theming engine:
 * the `m3Theme` module defines the Material 3 Expressive color scales,
 * shape system, typography scale, and component defaults. Pages should
 * consume Mantine style props and tokens (`--m3-*` vars) instead of
 * writing inline magic values.
 */
export const MantineProvider = ({ children }: MantineProviderProps) => {
	return (
		<MantineProviderBase theme={m3Theme} defaultColorScheme="light">
			{children}
		</MantineProviderBase>
	);
};
