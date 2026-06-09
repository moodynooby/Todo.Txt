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
**Vulnerability:** Detailed error messages, including potentially sensitive stack traces or internal implementation details, were being displayed to users in production when the AI tool failed or a React component crashed.
**Learning:** React Error Boundaries and try/catch blocks that update UI state can inadvertently leak internal system information if they display raw error objects or messages.
**Prevention:** Always use environment-aware error handling (e.g., `import.meta.env.DEV`) to show detailed errors only during development and generic, safe messages in production.
