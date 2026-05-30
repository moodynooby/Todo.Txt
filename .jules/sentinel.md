# Sentinel Security Journal

## 2025-05-14 - XSS via Plain Text File Import
**Vulnerability:** User-provided plain text files were being converted to HTML paragraphs and inserted into the TipTap editor without escaping. This allowed an attacker to execute arbitrary JavaScript if a user opened a specially crafted .txt file.
**Learning:** Even "plain text" needs to be treated as untrusted if it's being converted into HTML or other structured formats.
**Prevention:** Always use a robust `escapeHtml` function when converting text to HTML. Ensure this function handles `&`, `<`, `>`, `"`, and `'`.

## 2025-05-14 - Improved External Link Security
**Vulnerability:** External links were missing `noopener` in the `rel` attribute (specifically the Groq console link).
**Learning:** While modern browsers often default to `noopener` for `target="_blank"`, explicitly including it with `noreferrer` is a best practice for defense-in-depth and privacy.
**Prevention:** Use `rel="noopener noreferrer"` for all external links.

## 2025-05-14 - Information Exposure via Error Messages
**Vulnerability:** Application errors (in `ErrorBoundary`) and API failures (in `useAiGroq`) were propagating raw error messages to the user. This could leak internal architecture details, environment specifics, or third-party service details.
**Learning:** Raw error objects often contain sensitive information. While useful for debugging in development, they should never reach the user interface in production.
**Prevention:** Use environment-aware rendering (e.g., `import.meta.env.DEV`) to show detailed errors only during development, and provide user-friendly, generic error messages in production.
