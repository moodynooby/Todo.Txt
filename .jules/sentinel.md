# Sentinel Security Journal

## 2025-05-14 - XSS via Plain Text File Import
**Vulnerability:** User-provided plain text files were being converted to HTML paragraphs and inserted into the TipTap editor without escaping. This allowed an attacker to execute arbitrary JavaScript if a user opened a specially crafted .txt file.
**Learning:** Even "plain text" needs to be treated as untrusted if it's being converted into HTML or other structured formats.
**Prevention:** Always use a robust `escapeHtml` function when converting text to HTML. Ensure this function handles `&`, `<`, `>`, `"`, and `'`.

## 2025-05-14 - Improved External Link Security
**Vulnerability:** External links were missing `noopener` in the `rel` attribute (specifically the Groq console link).
**Learning:** While modern browsers often default to `noopener` for `target="_blank"`, explicitly including it with `noreferrer` is a best practice for defense-in-depth and privacy.
**Prevention:** Use `rel="noopener noreferrer"` for all external links.

## 2025-05-15 - Masking Error Messages in Production
**Vulnerability:** Raw error messages and stack traces were being exposed in the UI and console in production environments, potentially leaking internal implementation details.
**Learning:** Production environments should never expose raw error details to the end-user. `import.meta.env.DEV` is a reliable way to differentiate between environments in Vite-based projects.
**Prevention:** Always wrap sensitive error logging and UI error display in a check for `import.meta.env.DEV`. Show generic, safe messages to users in production.
