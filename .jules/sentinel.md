## 2025-05-15 - [Security Hardening]
**Vulnerability:** Information leakage in ErrorBoundary and potential XSS in file loading.
**Learning:** Raw error messages in React ErrorBoundaries can expose sensitive environment details or stack traces to end users. Additionally, wrapping raw file content directly into HTML tags without escaping creates an XSS risk.
**Prevention:** Always use generic error messages for end-users and escape user-provided plain text before converting it to HTML. Use `rel="noopener noreferrer"` for all external links.
