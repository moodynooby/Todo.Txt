# Active KMP design guide

The active Todo.Txt product is a Kotlin Multiplatform and Compose Multiplatform application. Visual changes belong in `native/app/src/commonMain` first and should use Material 3 semantic colors, typography, shapes, and spacing rather than platform-specific constants.

## Surface ownership

The shared Compose UI is the source of truth for Android, desktop JVM, and Kotlin/Wasm. Platform source sets may provide capability adapters, file dialogs, notifications, widgets, tray integration, or browser APIs, but they should not fork page layout or domain behavior without a documented platform constraint.

## Visual rules

Use the shared Material 3 theme and semantic roles from the native UI layer. Prefer readable foreground/background pairs selected from theme roles and runtime contrast helpers. Do not introduce fixed black or white text for arbitrary user-selected surfaces. Keep interactive controls keyboard reachable, provide content descriptions for icon-only actions, and preserve visible focus indicators.

Workspace pages should use the common page header, navigation model, timer overlay, editor entry points, and responsive layout primitives. New shared UI belongs in common source sets whenever the required behavior is available on all three active targets.

## Verification

After visual changes, compile desktop, Wasm, and Android targets and run the relevant common tests.
