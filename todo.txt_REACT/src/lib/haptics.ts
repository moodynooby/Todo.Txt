/** Light haptic feedback for primary interactions (task add, habit check,
 * save). Android fires real vibration; iOS Safari and desktops silently
 * no-op, so callers never need to branch. */
export const haptic = (pattern: number | readonly number[] = 10): void => {
	try {
		if (typeof pattern === "number") {
			navigator.vibrate?.(pattern);
		} else {
			navigator.vibrate?.(Array.from(pattern));
		}
	} catch {
		// Vibration API unavailable — fine.
	}
};

/** Distinct tick patterns so each action feels different in the hand. */
export const HAPTIC = {
	tick: 10,
	success: [12, 40, 18],
	save: [8, 30, 8],
} as const;
