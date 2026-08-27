# Todo.Txt

Todo.Txt is a local-first productivity application built around the [todo.txt](https://github.com/todotxt/todo.txt) format: plain text, searchable, portable, lightweight, and easy to manipulate.

The repository’s primary product is now the **Kotlin Multiplatform / Compose Multiplatform application**. The same common UI and domain layer targets Android, desktop JVM, and Kotlin/Wasm in the browser. The former React/Vite application remains as a rollback and compatibility surface; the optional Tauri shell remains available for teams that still need its Rust/webview packaging or widget integrations.

| Product surface | Location | Platform | Role |
|---|---|---|---|
| **Compose application** | `native/app/` | Android, Windows/Linux desktop, browser/Wasm | Primary product and shared UI |
| **Shared KMP core** | `native/core/` | JVM, Kotlin/JS, Kotlin/Wasm | Todo parsing, habits, streaks, scheduling, projections, and document rules |
| Legacy web application | `src/` | Browser/PWA | Compatibility and rollback build via `build:legacy` |
| Optional Tauri shell | `src-tauri/` | Desktop/Android | Existing Rust/webview packaging and widget path |

## Product model and unified capture

The primary Compose UI opens on a Google Keep-style **Home / Capture** workspace. It provides one quick-capture entry point for tasks and notes, previews open todos and recent notes, and links to the specialized Todo, Notes, Draw, Habits, Timer, AI, Editor, and Sync tools.

The unified entry point does **not** flatten the underlying models. Todo documents retain todo.txt parsing, projects, contexts, priorities, completion, and scheduling semantics. Notes retain their rich-text document model, and Draw retains its Excalidraw-style scene graph and editor behavior. Each model keeps separate persistence, synchronization, undo, and export semantics while sharing navigation and capture affordances.

## Features

The shared application supports todo.txt-compatible tasks, notes, priorities, projects, contexts, habits with streaks and heatmaps, multiple timers, rich notes, vector drawing, AI tools using a user-supplied Groq key, Firebase Auth/Firestore synchronization, QR-based device pairing, and platform-specific notification/widget integrations where the operating system exposes them.

Android continues to provide Glance widgets and action-oriented notifications. Desktop uses Compose JVM packaging. Browser storage is local-first through `localStorage`, and browser sync can use the injected public Firebase project configuration when authentication and Firestore rules are configured.

## Prerequisites

| Tool | Requirement |
|---|---|
| JDK | 21; required by the native Gradle daemon and current Compose toolchain |
| Node.js | 20 or newer; Netlify uses Node 20 |
| pnpm | 9; install dependencies with the committed lockfile |
| Android SDK | Required only for Android builds; set `ANDROID_HOME` and install the project’s Android platform/build tools |
| Desktop host | Windows or Linux for the corresponding Compose desktop installer |

## Development workflow

Install the JavaScript dependencies with pnpm, then choose the primary browser or desktop target:

```bash
pnpm install --frozen-lockfile

# Primary browser application, with hot reload through the Wasm dev tooling as needed.
pnpm run build

# Optional compatibility/rollback browser build.
pnpm run build:legacy

# Compose desktop application.
cd native
./gradlew :app:run -DmainClass=app.todotxt.MainKt
```

For Android, open `native/` in Android Studio or run `./gradlew :app:installDebug` after configuring `ANDROID_HOME`.

## Build commands

The default root build is the production KMP/Wasm distribution. It invokes the native Gradle build, copies the generated executable bundle into `dist/`, injects public Firebase configuration into the HTML shell, and removes the public source map.

```bash
# Primary production web build.
pnpm run build
pnpm run build:kmp

# Legacy React/Vite rollback build.
pnpm run build:legacy

# Web quality gates.
pnpm exec biome check src scripts package.json
pnpm test
pnpm typecheck

# Native quality gates.
cd native
./gradlew :core:jvmTest --no-daemon --max-workers=1 --console=plain
./gradlew :app:compileKotlinDesktop --no-daemon --max-workers=1 --console=plain
./gradlew :app:compileKotlinWasmJs --no-daemon --max-workers=1 --console=plain
```

The full production Wasm optimizer is memory-sensitive. CI and deployment use one Gradle worker and bounded JVM settings from `native/gradle.properties`; hosted builds should retain those settings rather than enabling parallel compiler workers.

## Shared KMP core and compatibility package

`native/core/` targets JVM, Kotlin/JS IR, and Kotlin/Wasm. It contains the canonical todo-content parser, habit merge and streak calculations, scheduling parser, widget projection, and shared document rules. The Compose application consumes this core directly for Android, desktop, and browser builds.

The legacy React application imports the committed Kotlin/JS compatibility package:

```json
"@todotxt/core": "file:native/core/npm-package"
```

When shared core code changes, regenerate the package and commit the result because a fresh Netlify checkout must not depend on a local Gradle output directory:

```bash
cd native
./rebuild-npm-package.sh
git add core/npm-package
```

## Browser parity and platform boundaries

The browser and native applications share the common Compose UI and core data rules, but browser APIs cannot provide every native capability identically. Browser import uses a file picker and browser export opens an encoded text download. Browser due-task reminders use the Notification API when permission is granted; scheduled background habit reminders and Android exact-alarm actions are not equivalent in a closed browser tab. Browser portable encrypted `.tdb` backup/restore is intentionally reported as unavailable until a compatible Web Crypto implementation is completed. Browser Firebase sync also requires valid public project configuration, authentication, and secure Firestore rules.

These are explicit capability boundaries rather than silent fallbacks. Local browser persistence remains available without Firebase, while Android and desktop retain their platform-private backup and encrypted portable-backup flows.

## Firebase configuration

Firebase Web API keys and project IDs are public client identifiers, not service-account credentials. Configure `FIREBASE_API_KEY` and `FIREBASE_PROJECT_ID` as Netlify environment variables or GitHub repository secrets; the KMP web build injects them into `index.html`. Authentication and Firestore Rules remain the security boundary, and the application must be tested with restrictive production rules before release.

For Android, pass the corresponding values as Gradle properties when assembling a configured build:

```bash
cd native
./gradlew :app:assembleDebug \
  -PfirebaseApiKey="$FIREBASE_API_KEY" \
  -PfirebaseProjectId="$FIREBASE_PROJECT_ID"
```

## Netlify deployment

`netlify.toml` is configured for the primary KMP/Wasm site:

```toml
command = "pnpm install --frozen-lockfile && pnpm run build:kmp"
publish = "dist"
```

The build environment pins Node 20 and Java 21, serves Wasm with the correct MIME type, caches hashed Wasm/JavaScript assets, and routes application paths back to `index.html`. Set the two Firebase variables in Netlify site settings if browser account sync is desired. Without them, the browser remains local-first.

## GitHub Actions

The repository has two distinct workflow roles:

| Workflow | Trigger | Purpose |
|---|---|---|
| `ci.yml` | Pushes, pull requests, and manual dispatch | Frozen pnpm install, Biome, tests, typecheck, legacy build, KMP core tests, desktop compile, and Wasm source compile |
| `release.yml` | Release tags (`v*`/`app-v*`) or manual dispatch | Windows MSI, Linux `.deb`, Android APK, and KMP/Wasm web artifact |

All native Gradle jobs use JDK 21. The Web release job installs `libatomic1`, uses the frozen pnpm lockfile, and runs the same KMP build used by Netlify. Release web configuration is read from the `FIREBASE_API_KEY` and `FIREBASE_PROJECT_ID` repository secrets.

For production Android signing, configure the repository secrets below. If they are absent, the workflow can create an installable CI-only signed APK, but that key must not be used for Play Store upgrades.

| Secret | Purpose |
|---|---|
| `BASE64_KEYSTORE` | Base64-encoded production keystore |
| `KEYSTORE_PASSWORD` | Keystore password |
| `KEY_ALIAS` | Signing key alias |
| `KEY_PASSWORD` | Signing key password |

## Repository layout

```text
Todo.Txt/
├── native/app/                 # Primary Compose Multiplatform application
├── native/core/                # Shared KMP domain and compatibility core
├── native/core/npm-package/    # Committed Kotlin/JS package for legacy web
├── src/                        # Legacy React/Vite compatibility surface
├── src-tauri/                  # Optional Rust/webview shell
├── scripts/build-kmp-web.mjs   # KMP/Wasm build and dist assembly
├── netlify.toml                # Primary Netlify build configuration
└── .github/workflows/          # CI and release workflows
```

Generated Gradle outputs, Kotlin JS/Wasm stores, and other reproducible build products are ignored. The exception is `native/core/npm-package/`, which remains committed for the legacy build and deployment compatibility.

## License

MIT
