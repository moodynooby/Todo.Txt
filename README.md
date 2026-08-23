# Todo.Txt

A full-featured todo application built on the philosophy of
[todo.txt](https://github.com/todotxt/todo.txt) — plain text, OS-agnostic,
searchable, portable, lightweight, and easily manipulated.

This repository ships **three surfaces** in the same repo: the native app is
the frontrunner, the web app shares logic with it through a common Kotlin
Multiplatform core module, and an optional Tauri shell wraps the web UI for
desktop/Android with its own widget stack.

| Product | Location | Platform | Stack |
|---|---|---|---|
| **Native app** | `native/` | Android + Desktop (Windows / Linux) | Kotlin, Compose Multiplatform |
| **Web app** | repo root (`src/`) | Browser / PWA | React 19 + Vite + TypeScript + Mantine |
| **Tauri shell** | `src-tauri/` | Desktop + Android (optional build) | Rust + system webview (same web UI) |
| **Shared core** | `native/core/` | JVM + JS/IR | Kotlin Multiplatform |

All three consume the shared core: the native and Tauri widget stacks render
the same `WidgetData` projection, habit merges go through one canonical
`HabitMerge`, and the web app imports the compiled `@todotxt/core` bundle.

## Features

- todo.txt-based plain text todos, notes, projects, contexts, and priority
- Rich notes with TipTap-style Markdown editor and Excalidraw-style vector
  drawing (native: `RichEditor` + `DrawPage`; web: TipTap + Excalidraw)
- Habits with streaks, heatmap, and momentum tracking — **shared core logic**
  (LWW-CRDT merge, scheduling parser) used identically by native and web
- QR-based bidirectional P2P sync (LWW CRDT + continuous WebSocket), pairing
  Android, Desktop, and Web devices
- Android: seven Glance widgets (Todo, Habits, Momentum, Heatmap, Quick-Check,
  Streaks, Week-Grid) fed by one shared projection; the Tauri shell's
  RemoteViews widgets read the same JSON contract. Notification actions
  (Mark Done / Snooze), exact-alarm permission UX
- Multi-timer support, Firebase Auth + Firestore cloud sync (web), AI tools
  via GROQ (user-supplied key)

## Prerequisites

- **JDK 21** — Gradle wrapper builds the native app and core module
- **Android SDK** with `platforms;android-35`, `build-tools;34.0.0` /
  `35.0.0`, and `platform-tools`; set `ANDROID_HOME`
  (e.g. `export ANDROID_HOME=$HOME/android-sdk`)
- **Node.js 20+** with npm (web app)
- For the native app: a connected Android device / emulator, or simply a
  Windows / Linux desktop for the Desktop JVM target

## Development workflow (dev servers + hot reload)

Daily development runs two dev servers, one per product:

```bash
# Terminal 1 — web app dev server (http://localhost:5173)
npm install          # repo root, on main or native/kotlin-compose
npm run dev

# Terminal 2 — native desktop app with Compose hot reload
cd native
./gradlew :app:run -DmainClass=app.todotxt.MainKt
```

The desktop Compose app opens in its own window and picks up UI changes via
Compose's hot reload. For Android, open `native/` in Android Studio (best
experience: layout inspector, logcat, emulator) or connect a device and run
`./gradlew :app:installDebug`.

## Build all platforms

```bash
# --- Native app (native/kotlin-compose branch) ---
cd native && export ANDROID_HOME=$HOME/android-sdk

# Typecheck / compile only (fastest full verification, both targets)
./gradlew :app:compileKotlinDesktop :app:compileDebugKotlinAndroid \
    --no-daemon --console=plain

# Android APK
./gradlew :app:assembleDebug            # debug
./gradlew :app:assembleRelease          # universal release APK

# Desktop installer for the host OS (Windows or Linux)
./gradlew :app:packageDistributionForCurrentOS
./gradlew :app:packageReleaseDistributionForCurrentOS

# Shared core unit tests (JVM)
./gradlew :core:jvmTest --no-daemon

# --- Web app (repo root, main branch) ---
npm run check          # biome lint + tsc --noEmit
npm run build          # production bundle → dist/
npm test               # vitest
```

### Shared core and the web app

`native/core/` is a KMP module with `jvm` (native app) and `js(IR)` (web app)
targets. It exports todo-content parsing, habit merge, streak / heatmap
calculation, and the scheduling parser — `CoreEntry.kt` (JS/IR) and `LwwMap`
(JVM).

The web app consumes the Kotlin/JS bundle as a local package:

```json
"@todotxt/core": "file:native/core/npm-package"
```

`npm-package/` **is committed to git** — Netlify (and fresh clones) have no
Gradle toolchain, so the compiled bundle is treated as a source artifact.
After changing core code, regenerate and commit it:

```bash
cd native && ./rebuild-npm-package.sh
git add native/core/npm-package && git commit   # required for deploys
```

`./rebuild-npm-package.sh` runs `:core:jsBrowserProductionWebpack` and copies
the resulting bundle (`build/js/packages/todotxt-native-core/`) into
`core/npm-package/` with the correct `@todotxt/core` package.json.

## Cross-platform releases (GitHub Actions)

`.github/workflows/release.yml` builds installers for every platform in
parallel and assembles them into a GitHub Release.

| Job | Host | Artifact |
|---|---|---|
| Desktop — Windows | `windows-latest` (JDK 17) | MSI installer |
| Desktop — Linux | `ubuntu-latest` (JDK 17) | `.deb` package |
| Android — APK | `ubuntu-latest` | Universal release APK |
| Web — static bundle | `ubuntu-latest` | `web-dist.zip` (PWA-ready) |

To trigger a release, either push a tag matching `app-v*` / `v*` on any branch,
or run it manually from the Actions tab ("Release" workflow → Run workflow).
All assets land on a GitHub Release named after the tag/ref. Requirements met
on CI: full Gradle wrapper (including `gradlew.bat`), `icon.ico` for jpackage,
`binutils` + `fakeroot` for Linux packaging, pnpm for the web app, and ProGuard
disabled for desktop release packaging (the bundled ProGuard 7.x cannot read
JDK 17+ jmods — desktop distributions ship unminified instead).

### Android signing

The Android job always produces a **signed** (and therefore installable) APK.
By default it generates a CI-only keystore — fine for sideloading, but do not
use it for Play Store distribution (replacing the signing key breaks upgrades).
For production signing, set these repository secrets:

| Secret | Value |
|---|---|
| `BASE64_KEYSTORE` | `base64` of your `.jks` / `.keystore` file |
| `KEYSTORE_PASSWORD` | Store password |
| `KEY_ALIAS` | Key alias |
| `KEY_PASSWORD` | Key password |

When the secrets are present the workflow signs with your keystore instead.

## Quality gates (run before committing)

| Check | Command |
|---|---|
| Native compile, both targets | `cd native && ./gradlew :app:compileKotlinDesktop :app:compileDebugKotlinAndroid --no-daemon` |
| Core unit tests | `cd native && ./gradlew :core:jvmTest` |
| Web lint + typecheck | `npm run check` (repo root / main) |
| Web production build | `npm run build` |

## Repo layout

```
Todo.Txt/
├── src/                     # Web app source (repo root, main)
├── package.json             # Web app manifest
├── src-tauri/               # Optional Tauri shell (desktop + Android) wrapping the web UI
├── native/
│   ├── app/                 # Compose Multiplatform app (android + desktop)
│   ├── core/                # Shared KMP module: JVM + JS/IR targets
│   │   ├── rebuild-npm-package.sh  # one-command JS bundle rebuild
│   │   └── npm-package/     # committed JS bundle for the web app (Netlify can't rebuild it)
│   ├── kotlin-js-store/     # (gitignored) yarn lockfile
│   └── build/               # (gitignored) Gradle outputs
├── AGENTS.md, CI.md, DESIGN.md, ADVANCED_PARSER.md
└── README.md
```

## Out of scope

- iOS / macOS targets (Android + Desktop JVM only)
- Committing `build/`, `kotlin-js-store/yarn.lock`, or any other reproducible
  artifacts to git — the one exception is `native/core/npm-package/`, which
  IS committed (see above: Netlify cannot run Gradle)

## Deploy the web app (Netlify)

The web app deploys to Netlify with zero extra configuration beyond the
included `netlify.toml` (base dir `.`, build command
`npm install && npm run build`, publish dir `dist`, SPA fallback redirect,
and long-lived cache headers for hashed assets).

1. On [Netlify](https://app.netlify.com) choose "Add new site → Import an
   existing project", connect the `moodynooby/Todo.Txt` repository, and pick
   the `main` branch.
2. Netlify reads `netlify.toml` automatically — no manual settings needed.
3. Every push to `main` redeploys automatically; the site URL is
   `https://todotxt.netlify.app/`.

If you want a deterministic package manager, set the Netlify environment
variable `NETLIFY_USE_PNPM=true` (the lockfile is pnpm). The production build
includes the PWA service worker, so the app installs offline on all
platforms.

## Links

- [Todo.txt philosophy](https://github.com/todotxt/todo.txt)
- [Website](https://todotxt.netlify.app/)

## License

MIT

## Android build (Tauri)

Toolchain: JDK 21, Gradle 8.14.3, AGP 8.13.0, NDK r30 (`30.0.15729638`), Rust with
`aarch64-linux-android` target. Export before building:

```bash
export JAVA_HOME=/usr/lib/jvm/java-21-openjdk-amd64   # adjust to your JDK 21
export ANDROID_HOME=/path/to/android-sdk
export NDK_HOME=$ANDROID_HOME/ndk/30.0.15729638
pnpm tauri android build --apk
```

Do not upgrade to AGP 9.x — Tauri's bundled Gradle modules still apply the
standalone Kotlin plugin and fail under AGP 9's built-in Kotlin (see
`ANDROID_BUILD_FIX_PLAN.md`).
