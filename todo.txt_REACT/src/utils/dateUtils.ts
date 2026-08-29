// Fix F11: all date strings are authored-device-local `YYYY-MM-DD`. That is
// the portable todo.txt convention, so relativity (`today` / `tomorrow` /
// `overdue`) is evaluated against the VIEWING device's clock at parse time,
// never mutated in the file. If a file authored in one timezone is opened on
// a device whose local date differs, due-task groupings can shift by a day —
// this is inherent to the plain-text format, not a bug to paper over here.
const formatDate = (d: Date): string =>
	`${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;

// An optional `now` anchor makes relativity testable and lets callers pin a
// reference moment instead of always using the ambient clock.
export const getToday = (now: Date = new Date()): string => formatDate(now);

export const getTomorrow = (now: Date = new Date()): string => {
	const d = new Date(now);
	d.setDate(d.getDate() + 1);
	return formatDate(d);
};

export const getYesterday = (now: Date = new Date()): string => {
	const d = new Date(now);
	d.setDate(d.getDate() - 1);
	return formatDate(d);
};

/** A Date as device-local `YYYY-MM-DD` (same authoring convention as getToday). */
export const formatLocalDate = (date: Date): string => formatDate(date);

/** The last [count] local dates ending today, oldest first, midnight-clamped. */
export const getLastDays = (count: number): Date[] =>
	Array.from({ length: count }, (_, index) => {
		const date = new Date();
		date.setHours(0, 0, 0, 0);
		date.setDate(date.getDate() - (count - 1 - index));
		return date;
	});
