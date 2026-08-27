export function relativeLuminance(hex: string): number | null {
	const value = hex.trim().replace(/^#/, "");
	const expanded = value.length === 3
		? value.split("").map((channel) => channel + channel).join("")
		: value.length === 6 || value.length === 8
			? value.slice(-6)
			: null;
	if (!expanded || !/^[0-9a-f]{6}$/i.test(expanded)) return null;
	const channels = [0, 2, 4].map((index) => Number.parseInt(expanded.slice(index, index + 2), 16) / 255);
	const linear = channels.map((channel) =>
		channel <= 0.03928 ? channel / 12.92 : ((channel + 0.055) / 1.055) ** 2.4,
	);
	return 0.2126 * linear[0] + 0.7152 * linear[1] + 0.0722 * linear[2];
}

export function contrastRatio(first: string, second: string): number | null {
	const firstLum = relativeLuminance(first);
	const secondLum = relativeLuminance(second);
	if (firstLum === null || secondLum === null) return null;
	const lighter = Math.max(firstLum, secondLum);
	const darker = Math.min(firstLum, secondLum);
	return (lighter + 0.05) / (darker + 0.05);
}

export function chooseForeground(
	background: string,
	darkCandidate = "#111827",
	lightCandidate = "#FFFFFF",
): string {
	const darkRatio = contrastRatio(background, darkCandidate);
	const lightRatio = contrastRatio(background, lightCandidate);
	if (darkRatio === null && lightRatio === null) return darkCandidate;
	if (lightRatio === null) return darkCandidate;
	if (darkRatio === null) return lightCandidate;
	return lightRatio >= darkRatio ? lightCandidate : darkCandidate;
}
