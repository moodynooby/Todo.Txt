# Todo.Txt

Todo.Txt is a local-first productivity application built around the [todo.txt](https://github.com/todotxt/todo.txt) format: plain text, searchable, portable, lightweight, and easy to manipulate.

The active product is a Kotlin Multiplatform and Compose Multiplatform application. One shared UI and domain layer targets Android, desktop JVM, and Kotlin/Wasm in the browser.

## Product surfaces

| Surface | Location | Platforms | Role |
|---|---|---|---|
| Compose application | `native/app/` | Android, Windows/Linux desktop, browser/Wasm | Active product and shared UI |
| Shared KMP core | `native/core/` | JVM and Kotlin/Wasm | Todo grammar, habits, scheduling, projections, and domain rules |

The primary Compose UI opens on a Home/Capture workspace and links to Todos, Notes, Draw, Habits, Timer, AI, Editor, and Sync. Android provides Glance widgets and action-oriented notifications; desktop provides Compose JVM packaging and tray integration; the browser provides a local-first Wasm application with browser-compatible storage, notifications, file import/export, and encrypted portable backups.

## Prerequisites

| Tool | Requirement |
|---|---|
| JDK | 21; required by the native Gradle daemon and Compose toolchain |
| Node.js | 20 or newer; used by the Wasm distribution tooling |
| pnpm | 9 or newer; used by the root build wrapper |
| Android SDK | API 37 platform and build tools for Android builds |
| Linux Wasm dependency | `libatomic1` |

## Development workflow

Install the small root build wrapper, then run the active browser or native target:

```bash
pnpm install --frozen-lockfile
pnpm run build

cd native
./gradlew :app:run -DmainClass=app.todotxt.MainKt
./gradlew :app:installDebug
```

The root build invokes `scripts/build-kmp-web.mjs`, runs `:app:wasmJsBrowserDistribution`, copies the production bundle into `dist/`, injects public Firebase configuration into the HTML shell, and removes public source maps.

## Native quality gates

```bash
cd native
./gradlew :core:jvmTest --no-daemon --max-workers=1 --console=plain
./gradlew :app:desktopTest --no-daemon --max-workers=1 --console=plain
./gradlew :app:compileKotlinDesktop --no-daemon --max-workers=1 --console=plain
./gradlew :app:compileKotlinWasmJs --no-daemon --max-workers=1 --console=plain
./gradlew :app:compileDebugKotlinAndroid --no-daemon --max-workers=1 --console=plain
```

The full production Wasm optimizer is memory-sensitive. Keep the one-worker and bounded compiler settings in `native/gradle.properties` rather than enabling parallel compiler workers.

## Shared KMP core

`native/core/` contains the canonical Todo.Txt parser, habit merge and streak calculations, scheduling parser, widget projection, and shared document rules. It targets JVM and Kotlin/Wasm. The core contains no UI, Android APIs, filesystem implementation, network client, or persistence implementation.

Todo.Txt tasks remain plain-text lines. The canonical representation preserves optional completion markers, priorities, creation and completion dates, projects, contexts, and product extensions such as due metadata. Shared parser behavior is tested in the core module and consumed directly by the active application.

## Browser and platform boundaries

Browser APIs cannot provide every native capability identically. Browser due-task reminders use the Notification API while the page is open and recheck on visibility/focus; exact closed-tab alarms require a separate push/service-worker backend. Browser encrypted `.tdb` backup and restore uses the same wire contract as Android and desktop through Web Crypto. These are explicit capability boundaries rather than silent fallbacks.

## Firebase configuration

Firebase Web API keys and project IDs are public client identifiers, not service-account credentials. Configure `FIREBASE_API_KEY` and `FIREBASE_PROJECT_ID` as Netlify environment variables or GitHub repository secrets; the KMP web build injects them into `index.html`. Authentication and restrictive Firestore Rules remain the security boundary.

For Android, pass the corresponding values as Gradle properties when assembling a configured build:

```bash
cd native
./gradlew :app:assembleDebug \
  -PfirebaseApiKey="$FIREBASE_API_KEY" \
  -PfirebaseProjectId="$FIREBASE_PROJECT_ID"
```

## Netlify deployment

`netlify.toml` builds and publishes the KMP/Wasm distribution:

```toml
[build]
command = "pnpm install --frozen-lockfile && pnpm run build:kmp"
publish = "dist"
```

The deployment serves Wasm with the correct MIME type, caches hashed Wasm and JavaScript assets, and routes application paths to `index.html`. Without Firebase variables, the browser remains local-first.

## GitHub Actions

The CI workflow validates the root install, production KMP/Wasm build, core tests, desktop tests and compilation, Wasm compilation, and Android compilation. Release workflows produce desktop installers, an Android APK, and the KMP/Wasm web artifact.

## Repository layout

```text
Todo.Txt/
├── native/app/                 # Active Compose Multiplatform application
├── native/core/                # Active KMP domain and shared core
├── scripts/build-kmp-web.mjs   # Production Wasm build and dist assembly
├── netlify.toml                # KMP/Wasm Netlify configuration
├── package.json                # Minimal KMP build wrapper
└── .github/workflows/          # CI and release workflows
```

Generated Gradle outputs, Kotlin/Wasm stores, `node_modules`, and `dist/` are ignored.

## License

MIT
