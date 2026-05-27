# Sentinel Security Journal

## 2025-05-15 - [Information Leakage in Error Boundary]
**Vulnerability:** Raw error messages from `ErrorBoundary` were displayed directly to the user.
**Learning:** React Error Boundaries often default to showing `error.message`, which can leak sensitive internal details, stack traces, or environment specifics that could be useful to an attacker.
**Prevention:** Always use generic, user-friendly error messages in production Error Boundaries. Log the detailed error to an internal monitoring system (or just the console in this client-side app) instead of the UI.

## 2025-05-14 - XSS via Plain Text File Import
**Vulnerability:** User-provided plain text files were being converted to HTML paragraphs and inserted into the TipTap editor without escaping. This allowed an attacker to execute arbitrary JavaScript if a user opened a specially crafted .txt file.
**Learning:** Even "plain text" needs to be treated as untrusted if it's being converted into HTML or other structured formats.
**Prevention:** Always use a robust `escapeHtml` function when converting text to HTML. Ensure this function handles `&`, `<`, `>`, `"`, and `'`.

## 2025-05-14 - Improved External Link Security
**Vulnerability:** External links were missing `noopener` in the `rel` attribute (specifically the Groq console link).
**Learning:** While modern browsers often default to `noopener` for `target="_blank"`, explicitly including it with `noreferrer` is a best practice for defense-in-depth and privacy.
**Prevention:** Use `rel="noopener noreferrer"` for all external links.
