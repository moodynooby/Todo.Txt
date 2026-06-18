# Sentinel Security Journal

## 2025-05-14 - XSS via Plain Text File Import
**Vulnerability:** User-provided plain text files were being converted to HTML paragraphs and inserted into the TipTap editor without escaping. This allowed an attacker to execute arbitrary JavaScript if a user opened a specially crafted .txt file.
**Learning:** Even "plain text" needs to be treated as untrusted if it's being converted into HTML or other structured formats.
**Prevention:** Always use a robust `escapeHtml` function when converting text to HTML. Ensure this function handles `&`, `<`, `>`, `"`, and `'`.

## 2025-05-14 - Improved External Link Security
**Vulnerability:** External links were missing `noopener` in the `rel` attribute (specifically the Groq console link).
**Learning:** While modern browsers often default to `noopener` for `target="_blank"`, explicitly including it with `noreferrer` is a best practice for defense-in-depth and privacy.
**Prevention:** Use `rel="noopener noreferrer"` for all external links.

## 2025-05-14 - Information Leakage via Error Messages
**Vulnerability:** Raw error messages and stack traces were displayed to users in production via the global ErrorBoundary and AI service hooks. This could leak technical details about the application's environment, API structure, or internal logic.
**Learning:** Error handling should be environment-aware. While detailed errors are vital for development, production users should only see generic, safe messages.
**Prevention:** Use environment checks like `import.meta.env.DEV` to conditionally render error details. Always log full errors to the console (or a logging service) for debugging, but keep the UI safe.
