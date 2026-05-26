export function stripHtml(html: string, replacement = ""): string {
	if (!html) return "";
	return html.replace(/<[^>]*>/g, replacement);
}

export function isEmptyHtml(html: string): boolean {
	const trimmed = html.trim();
	return !trimmed || trimmed === "<p></p>" || trimmed === "<p><br></p>";
}

export function extractLines(html: string): string[] {
	const text = stripHtml(html, "\n");
	return text
		.split("\n")
		.map((l) => l.trim())
		.filter((l) => l.length > 0);
}
