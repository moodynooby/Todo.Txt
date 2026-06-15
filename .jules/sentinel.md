# Sentinel Security Journal

## 2025-05-14 - XSS via Plain Text File Import
**Vulnerability:** User-provided plain text files were being converted to HTML paragraphs and inserted into the TipTap editor without escaping. This allowed an attacker to execute arbitrary JavaScript if a user opened a specially crafted .txt file.
**Learning:** Even "plain text" needs to be treated as untrusted if it's being converted into HTML or other structured formats.
**Prevention:** Always use a robust `escapeHtml` function when converting text to HTML. Ensure this function handles `&`, `<`, `>`, `"`, and `'`.

## 2025-05-14 - Improved External Link Security
**Vulnerability:** External links were missing `noopener` in the `rel` attribute (specifically the Groq console link).
**Learning:** While modern browsers often default to `noopener` for `target="_blank"`, explicitly including it with `noreferrer` is a best practice for defense-in-depth and privacy.
**Prevention:** Use `rel="noopener noreferrer"` for all external links.

## 2025-05-14 - Environment-Aware Error Masking
**Vulnerability:** Detailed error messages, including potentially sensitive API error details or stack traces, were being exposed to users in production environments via the global `ErrorBoundary` and AI service hooks.
**Learning:** React error boundaries and try-catch blocks often default to showing `error.message`, which is helpful for debugging but risky for production information leakage.
**Prevention:** Use `import.meta.env.DEV` to conditionally show detailed errors only during development. In production, provide generic, user-friendly messages that do not expose internal implementation details.
