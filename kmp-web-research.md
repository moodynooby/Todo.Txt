# KMP web research notes

## Official sources

1. https://kotlinlang.org/docs/wasm-get-started.html — Kotlin’s official Kotlin/Wasm + Compose Multiplatform tutorial. It shows a Kotlin Multiplatform project with a Web target using `wasmJs`, a browser run configuration, and the `wasmJsBrowserDistribution` Gradle task for publishable artifacts.

2. https://kotlinlang.org/docs/wasm-overview.html — Kotlin/Wasm documentation last modified 2026-08-12. Kotlin/Wasm is marked Beta. Compose Multiplatform web uses the `wasm-js` target and runs in browsers. Browser support requires WebAssembly garbage collection and legacy exception handling proposals. The docs describe browser API declarations and JS interop.

3. https://blog.jetbrains.com/kotlin/2025/09/compose-multiplatform-1-9-0-compose-for-web-beta/ — JetBrains announced Compose Multiplatform for Web powered by Wasm as Beta in Compose Multiplatform 1.9.0. The post describes shared Compose UI, Material 3, adaptive layouts, browser navigation/deep links, accessibility, HTML interop, and older-browser fallback. It positions the target as suitable for early adopters, not yet a fully stable final target.

## Repository-specific findings

- The native app currently targets Android and desktop JVM only; `native/core` already has JVM and Kotlin/JS targets consumed by the React web app.
- A first `wasmJs` target was added experimentally to `native/app`, and a matching `wasmJs` target was added to `native/core`.
- The existing native Gradle setup loaded Kotlin plugins multiple times; root plugin resolution was centralized and the core module now uses the version catalog.
- The shared core initially lacked Wasm actuals for `currentTimeMillis`, `todayString`, and `addDaysString`; Wasm actuals were added using `kotlinx.datetime`.
- Common app code contained JVM-only `Dispatchers.IO` and `System.currentTimeMillis()` calls. They were replaced with `Dispatchers.Default` and a shared `app.todotxt.platform.nowMillis()` helper using `kotlinx.datetime`.
- Shared sync managers constructed `HttpClient(CIO)` in common code; they were changed to `HttpClient()` and CIO was moved to Android/Desktop target dependencies. A JS/Wasm Ktor client alias was added.
- The common native Notes screen depended on `richeditor-compose`, which blocked Wasm resolution. It was replaced with a Compose multiline text editor aligned with the web’s current plain-text notes model, and the rich-editor dependency was removed.
- Browser actuals were added for storage, import/export, portable backup status, beep, alarm/reminders, device ID, Firebase config, keyboard hooks, and release URLs.
- The Wasm compiler progressed to compiling the full app but currently runs out of heap during `:app:compileDevelopmentExecutableKotlinWasmJs`, specifically in the Wasm IR-to-Wasm declaration generator. The environment has about 3.8 GiB RAM and a 3 GiB Gradle/Kotlin heap; increasing the daemon heap did not prevent the OOM.
- Native desktop/core baseline compiled successfully before these Wasm changes. Android validation is blocked in the sandbox because no Android SDK is installed.
