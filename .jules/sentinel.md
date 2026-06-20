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
**Vulnerability:** Detailed error messages, including potentially sensitive stack traces or API error details, were being displayed directly to users in production.
**Learning:** React ErrorBoundaries and API hooks often default to showing raw error messages which can leak system information.
**Prevention:** Always use `import.meta.env.DEV` (in Vite) or similar environment checks to mask raw error messages with generic user-friendly strings in production environments, while preserving detailed logs for development.
