# Sentinel Security Journal

## 2025-05-14 - XSS via Plain Text File Import
**Vulnerability:** User-provided plain text files were being converted to HTML paragraphs and inserted into the TipTap editor without escaping. This allowed an attacker to execute arbitrary JavaScript if a user opened a specially crafted .txt file.
**Learning:** Even "plain text" needs to be treated as untrusted if it's being converted into HTML or other structured formats.
**Prevention:** Always use a robust `escapeHtml` function when converting text to HTML. Ensure this function handles `&`, `<`, `>`, `"`, and `'`.

## 2025-05-14 - Improved External Link Security
**Vulnerability:** External links were missing `noopener` in the `rel` attribute (specifically the Groq console link).
**Learning:** While modern browsers often default to `noopener` for `target="_blank"`, explicitly including it with `noreferrer` is a best practice for defense-in-depth and privacy.
**Prevention:** Use `rel="noopener noreferrer"` for all external links.

## 2025-06-13 - Information Leakage via Error Messages
**Vulnerability:** Detailed error messages from the Groq API and React component crashes were being shown directly to users in production. These messages could contain sensitive internal details, stack traces, or API specifics.
**Learning:** "Fail Securely" is a core security principle. Error messages should be helpful to developers during development but generic and safe for users in production.
**Prevention:** Use environment-aware error masking (e.g., `import.meta.env.DEV`) to show generic error messages in production while preserving detailed logs for development.
