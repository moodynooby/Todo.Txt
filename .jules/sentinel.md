# Sentinel Security Journal

## 2025-05-14 - XSS via Plain Text File Import
**Vulnerability:** User-provided plain text files were being converted to HTML paragraphs and inserted into the TipTap editor without escaping. This allowed an attacker to execute arbitrary JavaScript if a user opened a specially crafted .txt file.
**Learning:** Even "plain text" needs to be treated as untrusted if it's being converted into HTML or other structured formats.
**Prevention:** Always use a robust `escapeHtml` function when converting text to HTML. Ensure this function handles `&`, `<`, `>`, `"`, and `'`.

## 2025-05-14 - Improved External Link Security
**Vulnerability:** External links were missing `noopener` in the `rel` attribute (specifically the Groq console link).
**Learning:** While modern browsers often default to `noopener` for `target="_blank"`, explicitly including it with `noreferrer` is a best practice for defense-in-depth and privacy.
**Prevention:** Use `rel="noopener noreferrer"` for all external links.

## 2025-05-14 - Information Exposure via Raw Error Messages
**Vulnerability:** React ErrorBoundaries and API hook error states were displaying raw error messages and potentially stack traces to users in all environments. This could leak internal architecture details or sensitive API error data.
**Learning:** UX for developers (seeing raw errors) should be decoupled from UX for users in production. Using `import.meta.env.DEV` allows for high-visibility debugging locally while maintaining a secure, generic posture in production.
**Prevention:** Always wrap error message displays in environment checks. Use generic fallback messages in production for both global catch-alls (`ErrorBoundary`) and feature-specific error states (AI/Sync hooks).
