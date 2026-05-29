export function escapeHtml(text: string): string {
	return text
		.replace(/&/g, "&amp;")
		.replace(/</g, "&lt;")
		.replace(/>/g, "&gt;")
		.replace(/"/g, "&quot;")
		.replace(/'/g, "&#039;");
}

export function stripHtml(html: string, replacement = ""): string {
	if (!html) return "";
	if (!html.includes("<")) return html;
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
