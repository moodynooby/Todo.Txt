# Sentinel Security Journal

## 2025-05-14 - XSS via Plain Text File Import
**Vulnerability:** User-provided plain text files were being converted to HTML paragraphs and inserted into the TipTap editor without escaping. This allowed an attacker to execute arbitrary JavaScript if a user opened a specially crafted .txt file.
**Learning:** Even "plain text" needs to be treated as untrusted if it's being converted into HTML or other structured formats.
**Prevention:** Always use a robust `escapeHtml` function when converting text to HTML. Ensure this function handles `&`, `<`, `>`, `"`, and `'`.

## 2025-05-14 - Improved External Link Security
**Vulnerability:** External links were missing `noopener` in the `rel` attribute (specifically the Groq console link).
**Learning:** While modern browsers often default to `noopener` for `target="_blank"`, explicitly including it with `noreferrer` is a best practice for defense-in-depth and privacy.
**Prevention:** Use `rel="noopener noreferrer"` for all external links.

## 2025-05-15 - Secure Error Handling and Information Leakage Prevention
**Vulnerability:** Raw error messages and stack traces were potentially exposed to users via the UI and console logs in production, which could leak internal implementation details or environment specifics.
**Learning:** Core components like `ErrorBoundary` and `useAiGroq` often default to showing the full error object. While useful for debugging, this violates the principle of failing securely.
**Prevention:** Always gate detailed error logs and user-facing error messages behind `import.meta.env.DEV`. Provide generic, safe fallback messages for production users.
