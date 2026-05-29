# Sentinel Security Journal

## 2025-05-14 - XSS via Plain Text File Import
**Vulnerability:** User-provided plain text files were being converted to HTML paragraphs and inserted into the TipTap editor without escaping. This allowed an attacker to execute arbitrary JavaScript if a user opened a specially crafted .txt file.
**Learning:** Even "plain text" needs to be treated as untrusted if it's being converted into HTML or other structured formats.
**Prevention:** Always use a robust `escapeHtml` function when converting text to HTML. Ensure this function handles `&`, `<`, `>`, `"`, and `'`.

## 2025-05-14 - Improved External Link Security
**Vulnerability:** External links were missing `noopener` in the `rel` attribute (specifically the Groq console link).
**Learning:** While modern browsers often default to `noopener` for `target="_blank"`, explicitly including it with `noreferrer` is a best practice for defense-in-depth and privacy.
**Prevention:** Use `rel="noopener noreferrer"` for all external links.

## 2025-05-20 - Prevented Information Leakage in Error Boundary
**Vulnerability:** The global `ErrorBoundary` was displaying raw error messages to users. In production, this could expose sensitive internal details about the application's state, stack traces (if included in message), or environment.
**Learning:** Error boundaries are great for resilience but must be environment-aware to avoid over-sharing during failures.
**Prevention:** Use `import.meta.env.DEV` to conditionally show detailed errors in development and generic, safe messages in production.
