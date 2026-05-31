# Sentinel Security Journal

## 2025-05-14 - XSS via Plain Text File Import
**Vulnerability:** User-provided plain text files were being converted to HTML paragraphs and inserted into the TipTap editor without escaping. This allowed an attacker to execute arbitrary JavaScript if a user opened a specially crafted .txt file.
**Learning:** Even "plain text" needs to be treated as untrusted if it's being converted into HTML or other structured formats.
**Prevention:** Always use a robust `escapeHtml` function when converting text to HTML. Ensure this function handles `&`, `<`, `>`, `"`, and `'`.

## 2025-05-14 - Improved External Link Security
**Vulnerability:** External links were missing `noopener` in the `rel` attribute (specifically the Groq console link).
**Learning:** While modern browsers often default to `noopener` for `target="_blank"`, explicitly including it with `noreferrer` is a best practice for defense-in-depth and privacy.
**Prevention:** Use `rel="noopener noreferrer"` for all external links.

## 2025-05-15 - Information Exposure via Raw Error Messages
**Vulnerability:** Raw error messages from external APIs (Groq) and internal crashes (ErrorBoundary) were being displayed directly to the user. This could leak internal system details or sensitive API information in production.
**Learning:** Error messages should be sanitized for production. Developers often forget that `error.message` can contain sensitive information that shouldn't reach the end user.
**Prevention:** Use environment flags like `import.meta.env.DEV` to conditionally show detailed error messages in development and generic ones in production.
