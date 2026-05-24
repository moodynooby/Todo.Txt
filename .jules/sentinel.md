## 2025-05-15 - [Information Leakage in Error Boundary]
**Vulnerability:** Raw error messages from `ErrorBoundary` were displayed directly to the user.
**Learning:** React Error Boundaries often default to showing `error.message`, which can leak sensitive internal details, stack traces, or environment specifics that could be useful to an attacker.
**Prevention:** Always use generic, user-friendly error messages in production Error Boundaries. Log the detailed error to an internal monitoring system (or just the console in this client-side app) instead of the UI.
