# Todo.Txt — Kotlin Multiplatform application

This directory contains the active Todo.Txt product built with Kotlin Multiplatform and Compose Multiplatform. It targets Android, desktop JVM, and Kotlin/Wasm in the browser.

## Targets

| Target | Source set | Main output |
|---|---|---|
| Android | `app/src/androidMain` | Debug/release APK and Android widgets |
| Desktop JVM | `app/src/desktopMain` | Compose desktop application and native distributions |
| Browser/Wasm | `app/src/wasmJsMain` | Production browser distribution copied to the repository `dist/` directory |

The shared core in `core/` is consumed directly by the active KMP app and targets JVM and Wasm.

## Build and test

```bash
cd native

# Core tests and platform checks
./gradlew :core:jvmTest --no-daemon --max-workers=1 --console=plain
./gradlew :app:desktopTest --no-daemon --max-workers=1 --console=plain
./gradlew :app:compileKotlinDesktop --no-daemon --max-workers=1 --console=plain
./gradlew :app:compileKotlinWasmJs --no-daemon --max-workers=1 --console=plain
./gradlew :app:compileDebugKotlinAndroid --no-daemon --max-workers=1 --console=plain

# Android APK
./gradlew :app:assembleDebug

# Desktop distribution
./gradlew :app:packageDeb
```

From the repository root, `pnpm run build` invokes the production KMP/Wasm distribution and copies it to `dist/`. It requires JDK 21, Node.js, pnpm, and `libatomic1` on Linux. Android builds additionally require the configured Android SDK platform and build tools.

## Architecture

The active application is organized around `app/src/commonMain`, with explicit platform implementations in `androidMain`, `desktopMain`, and `wasmJsMain`. The common layer owns the UI, domain behavior, persistence contracts, sync, timers, Notes, Draw, AI, and shared parity rules. Platform source sets provide only capabilities that cannot be shared, such as file dialogs, Web Crypto, notifications, Android widgets, and desktop tray/window integration.


## License

Same as the parent repository.
