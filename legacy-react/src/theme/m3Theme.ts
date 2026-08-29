import { createTheme } from "@mantine/core";

/**
 * Material 3 Expressive design system for Todo.Txt.
 *
 * This module is the single source of truth for the app's visual language.
 * It expresses the M3 Expressive principles — variety of shapes, rich and
 * nuanced colors, emphasized typography, containment, and fluid motion —
 * through Mantine's theming engine: color scales, the radius system,
 * typography scale, component styles/variants, and CSS custom properties
 * (`mss` style vars) that pages consume instead of inline magic values.
 *
 * Color roles follow the M3 tonal-mapping idea (seed → 10-shade scale),
 * kept here rather than scattered across components. Motion tokens use
 * spring-inspired cubic-bezier curves (spatial overshoot, effects ease).
 */

export const M3_EVERGREEN = [
	"#eef4ee",
	"#e0ebe0",
	"#b9d3b6",
	"#93b88e",
	"#6f9f6a",
	"#578752",
	"#3f6f3d",
	"#2a5829",
	"#144214",
	"#07300a",
] as const;

export const M3_TERRACOTTA = [
	"#fff0e8",
	"#ffe0ce",
	"#ffc9a8",
	"#f5a677",
	"#e98a58",
	"#d7774a",
	"#b55b33",
	"#8f4526",
	"#74361b",
	"#5e2a12",
] as const;

/** Emphasized tertiary role for momentum cues (due/tomorrow) in Expressive */
export const M3_HONEY = [
	"#fff7e8",
	"#feecd1",
	"#f7d9a0",
	"#efc169",
	"#e9ac40",
	"#d6952a",
	"#b17521",
	"#8c5b19",
	"#714812",
	"#5c3a0d",
] as const;

/**
 * M3 Expressive shape scale.
 * xs 4 · sm 8 · md 12 · lg 16 · xl 20 · xxl 28 · "full" = fully rounded.
 */
const RADIUS = {
	xs: "4px",
	sm: "8px",
	md: "12px",
	lg: "16px",
	xl: "20px",
	xxl: "28px",
	full: "9999px",
};

/**
 * M3 Expressive motion tokens (spring approximations for the web).
 * spatial* = position / size / radius motion with a soft overshoot.
 * effects* = color / opacity motion with no overshoot.
 */
const MOTION = {
	spatialFast: "cubic-bezier(0.175, 0.885, 0.32, 1.275)",
	spatialDefault: "cubic-bezier(0.155, 0.9, 0.3, 1.18)",
	spatialSlow: "cubic-bezier(0.13, 0.9, 0.3, 1.12)",
	effectsFast: "cubic-bezier(0.2, 0, 0, 1)",
	effectsDefault: "cubic-bezier(0.15, 0, 0, 1)",
};

export const m3Theme = createTheme({
	primaryColor: "evergreen",
	colors: {
		evergreen: M3_EVERGREEN,
		terracotta: M3_TERRACOTTA,
		honey: M3_HONEY,
	},

	fontFamily:
		"WinkySans, system-ui, -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, sans-serif",
	fontFamilyMonospace:
		"ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace",
	fontSizes: {
		xs: "11px",
		sm: "12px",
		md: "14px",
		lg: "16px",
		xl: "20px",
		xxl: "28px",
	},

	headings: {
		fontFamily:
			"ZillaSlab, system-ui, -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, sans-serif",
		fontWeight: "500",
		sizes: {
			h1: { fontSize: "44px", lineHeight: "1.05" },
			h2: { fontSize: "34px", lineHeight: "1.1" },
			h3: { fontSize: "26px", lineHeight: "1.15" },
			h4: { fontSize: "20px", lineHeight: "1.25" },
		},
	},

	lineHeights: {
		xs: "1.4",
		sm: "1.45",
		md: "1.55",
		lg: "1.55",
		xl: "1.25",
		xxl: "1.15",
	},
	radius: RADIUS,
	defaultRadius: "md",

	spacing: {
		xs: "4px",
		sm: "8px",
		md: "12px",
		lg: "16px",
		xl: "24px",
		xxl: "32px",
	},

	shadows: {
		xs: "0 2px 4px rgba(23, 61, 53, 0.06)",
		sm: "0 4px 10px rgba(23, 61, 53, 0.08)",
		md: "0 8px 22px rgba(23, 61, 53, 0.12)",
		lg: "0 14px 34px rgba(23, 61, 53, 0.18)",
		xl: "0 22px 48px rgba(23, 61, 53, 0.24)",
	},

	components: {
		Button: {
			defaultProps: {
				radius: "md",
			},
			styles: {
				root: {
					transitionProperty:
						"background-color, border-color, color, box-shadow, transform",
					transitionDuration: "160ms",
					transitionTimingFunction: MOTION.effectsFast,
				},
			},
		},

		ActionIcon: {
			defaultProps: {
				radius: "md",
			},
		},

		Paper: {
			defaultProps: {
				radius: "lg",
			},
		},

		Card: {
			defaultProps: {
				radius: "lg",
			},
		},

		Modal: {
			defaultProps: {
				radius: "xl",
				centered: true,
			},
			styles: {
				content: {
					transition: `transform 220ms ${MOTION.spatialDefault}, opacity 220ms ${MOTION.effectsDefault}`,
				},
			},
		},

		Drawer: {
			defaultProps: {
				radius: { sm: "xxl", md: "xxl", lg: "xxl" },
				position: "bottom",
				transitionProps: {
					transition: "slide-up",
					duration: 240,
					timingFunction: MOTION.spatialDefault,
				},
			},
			styles: {
				content: {
					transition: `transform 240ms ${MOTION.spatialDefault}`,
				},
			},
		},

		ThemeIcon: {
			defaultProps: {
				radius: "md",
			},
		},

		TextInput: {
			defaultProps: {
				size: "sm",
			},
			styles: {
				input: {
					transitionProperty: "border-color, box-shadow, background-color",
					transitionDuration: "160ms",
					transitionTimingFunction: MOTION.effectsFast,
				},
			},
		},

		Switch: {
			defaultProps: {
				size: "sm",
			},
		},

		Badge: {
			defaultProps: {
				radius: "xl",
			},
		},

		Burger: {
			defaultProps: {
				size: "md",
			},
		},
	},
});

/**
 * Global CSS variables for the app shell. Kept here (not in App.css) so the
 * Mantine theme remains the canonical theming surface and pages reference
 * tokens instead of hardcoded hex values.
 */
export const M3_VARS = {
	"--m3-radius-control": RADIUS.md,
	"--m3-radius-surface": RADIUS.lg,
	"--m3-radius-pill": RADIUS.full,
	"--m3-ease-spatial": MOTION.spatialDefault,
	"--m3-ease-spatial-fast": MOTION.spatialFast,
	"--m3-ease-effects": MOTION.effectsDefault,
} as const;
