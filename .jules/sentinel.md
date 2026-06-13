# Sentinel Security Journal

## 2025-05-14 - XSS via Plain Text File Import
**Vulnerability:** User-provided plain text files were being converted to HTML paragraphs and inserted into the TipTap editor without escaping. This allowed an attacker to execute arbitrary JavaScript if a user opened a specially crafted .txt file.
**Learning:** Even "plain text" needs to be treated as untrusted if it's being converted into HTML or other structured formats.
**Prevention:** Always use a robust `escapeHtml` function when converting text to HTML. Ensure this function handles `&`, `<`, `>`, `"`, and `'`.

## 2025-05-14 - Improved External Link Security
**Vulnerability:** External links were missing `noopener` in the `rel` attribute (specifically the Groq console link).
**Learning:** While modern browsers often default to `noopener` for `target="_blank"`, explicitly including it with `noreferrer` is a best practice for defense-in-depth and privacy.
**Prevention:** Use `rel="noopener noreferrer"` for all external links.

## 2026-06-04 - Generic Error Messages in Production
**Vulnerability:** Raw API error messages and React component stack traces were potentially exposed to users in production, which could leak internal system details, API paths, or data structures.
**Learning:** Detailed error messages are invaluable for debugging in development but a liability in production. Environment-aware error handling is essential for a secure application.
**Prevention:** Use `import.meta.env.DEV` (or equivalent) to toggle between detailed debug information and generic user-friendly error messages. Always mask external API errors before showing them to the user.
