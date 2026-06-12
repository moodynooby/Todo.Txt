# Sentinel Security Journal

## 2025-05-14 - XSS via Plain Text File Import
**Vulnerability:** User-provided plain text files were being converted to HTML paragraphs and inserted into the TipTap editor without escaping. This allowed an attacker to execute arbitrary JavaScript if a user opened a specially crafted .txt file.
**Learning:** Even "plain text" needs to be treated as untrusted if it's being converted into HTML or other structured formats.
**Prevention:** Always use a robust `escapeHtml` function when converting text to HTML. Ensure this function handles `&`, `<`, `>`, `"`, and `'`.

## 2025-05-14 - Improved External Link Security
**Vulnerability:** External links were missing `noopener` in the `rel` attribute (specifically the Groq console link).
**Learning:** While modern browsers often default to `noopener` for `target="_blank"`, explicitly including it with `noreferrer` is a best practice for defense-in-depth and privacy.
**Prevention:** Use `rel="noopener noreferrer"` for all external links.

## 2025-05-14 - Information Leakage via Raw Error Messages
**Vulnerability:** Raw error messages from the Groq API and internal application errors (via ErrorBoundary) were being displayed directly to users. These messages could contain sensitive implementation details, API specifics, or stack traces.
**Learning:** Error messages that are helpful during development can be a security risk in production by providing attackers with information about the system's internals.
**Prevention:** Always mask detailed error messages in production using environment checks (e.g., `import.meta.env.DEV`). Show generic, user-friendly messages instead while maintaining detailed logs for developers.
