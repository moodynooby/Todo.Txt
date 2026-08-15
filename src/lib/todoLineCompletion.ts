/** Field Notes Ritual: pure functions for toggling a todo line's completion.
 *
 * Matches the marker grammar of `src/utils/todoParser.ts`:
 *
 * - Checkbox style: `-[ ] task`, `-[x] task` (any single char inside brackets,
 *   case-insensitive `x` means complete)
 * - X-prefix style: `x task` (means complete; un-complete strips the `x `)
 *
 * These helpers rewrite one line so "Mark done" from a native notification
 * can update the document content directly.
 */

/* Parser grammar: optional `-`, `[`, one char, `]`, space. */
const RE_CHECKBOX = /^-?\[.?\]\s/;
const RE_X_PREFIX = /^x\s/i;

/** Rewrite the line at `lineIndex` so it is marked complete (or undone). */
export function setLineCompleted(
	content: string,
	lineIndex: number,
	completed: boolean,
): string {
	const lines = content.split("\n");
	if (lineIndex < 0 || lineIndex >= lines.length) return content;

	const line = lines[lineIndex];

	if (RE_CHECKBOX.test(line)) {
		// Checkbox style: swap the inner flag (`-[ ]` <-> `-[x]`)
		const marker = line.match(/-?\[([ xX])\]/)?.[1];
		lines[lineIndex] = marker
			? completed
				? line.replace(/\[[ xX]\]/, "[x]")
				: line.replace(/\[[ xX]\]/, "[ ]")
			: line;
	} else if (RE_X_PREFIX.test(line)) {
		// `x task` style: strip the prefix to un-complete; never needs marking
		if (!completed) {
			lines[lineIndex] = line.replace(RE_X_PREFIX, "");
		}
	} else if (completed && line.trim()) {
		// Plain line with content: convert to a completed checkbox line
		lines[lineIndex] = `-[x] ${line.trim()}`;
	}

	return lines.join("\n");
}
