# Todo.Txt

Todo.Txt is a local-first productivity application built around the [todo.txt](https://github.com/todotxt/todo.txt) format: plain text, searchable, portable, lightweight, and easy to manipulate.

The active product is a Kotlin Multiplatform and Compose Multiplatform application. One shared UI and domain layer targets Android, desktop JVM, and Kotlin/Wasm in the browser.

## Product surfaces

| Surface | Location | Platforms | Role |
|---|---|---|---|
| Compose application | `todo.txt_KWP/app/` | Android, Windows/Linux desktop, browser/Wasm | Active product and shared UI |
| Shared KMP core | `todo.txt_KWP/core/` | JVM and Kotlin/Wasm | Todo grammar, habits, scheduling, projections, and domain rules |

The primary Compose UI opens on a Home/Capture workspace and links to Todos, Notes, Draw, Habits, Timer, AI, Editor, and Sync. Android provides Glance widgets and action-oriented notifications; desktop provides Compose JVM packaging and tray integration; the browser provides a local-first Wasm application with browser-compatible storage, notifications, file import/export, and encrypted portable backups.

## Prerequisites

| Tool | Requirement |
|---|---|
| JDK | 21; required by the KMP Gradle daemon and Compose toolchain |
| Node.js | 20 or newer; used by the Wasm distribution tooling |
| pnpm | 9 or newer; used by the monorepo workspace |
| Android SDK | API 37 platform and build tools for Android builds |
| Linux Wasm dependency | `libatomic1` |

## Monorepo structure

This repository is a **pnpm workspace monorepo** managed via `pnpm-workspace.yaml`:

| Package | Location | Build system | Role |
|---|---|---|---|
| `todo.txt-monorepo` | `.` (root) | pnpm + Gradle | Workspace root, KMP/Wasm build wrapper, shared tooling |
| `todo.txt-kmp-tooling` | `todo.txt_KWP/` | Gradle (Kotlin) + pnpm (tooling) | Active KMP/Compose app — Kotlin deps via Gradle, JS tooling via pnpm catalog |
| `todo.txt-legacy-react` | `todo.txt_REACT/` | Vite + pnpm | React/Vite app — shares tooling versions via pnpm catalog |

Shared JS tooling (`@biomejs/biome`, `typescript`, `vitest`, `jsdom`) is versioned once in `pnpm-workspace.yaml` `catalog:` and consumed via `catalog:` in each package. Root `biome.json` and `tsconfig.base.json` are the single source of truth; workspace packages extend them.

Gradle remains the sole manager for Kotlin/Compose/Android dependencies (`todo.txt_KWP/gradle/libs.versions.toml`).

## Development workflow

Install all workspace dependencies from the root, then build or run any target:

```bash
pnpm install --frozen-lockfile
pnpm run build              # KMP/Wasm production build → dist/
pnpm run build:react        # React production build → todo.txt_REACT/dist/
pnpm run build:all          # Both builds (pnpm -r)

pnpm run dev:react          # React dev server (Vite)
pnpm run dev:wasm           # KMP Wasm dev server
pnpm run dev:desktop        # KMP desktop (Compose JVM)

pnpm run lint:all           # Biome check across all packages
pnpm run typecheck:all      # tsc --noEmit across all packages
pnpm run test:all           # Vitest across all packages
```

The root build invokes `scripts/build-kmp-web.mjs`, runs `:app:wasmJsBrowserDistribution` with Gradle build cache, copies the production bundle into `dist/`, injects public Firebase configuration into the HTML shell, and removes public source maps.

## Native quality gates

```bash
cd todo.txt_KWP
./gradlew :core:jvmTest --no-daemon --max-workers=1 --console=plain
./gradlew :app:desktopTest --no-daemon --max-workers=1 --console=plain
./gradlew :app:compileKotlinDesktop --no-daemon --max-workers=1 --console=plain
./gradlew :app:compileKotlinWasmJs --no-daemon --max-workers=1 --console=plain
./gradlew :app:compileDebugKotlinAndroid --no-daemon --max-workers=1 --console=plain
```

## Build performance

| Optimization | Location | Effect |
|---|---|---|
| Gradle heap `3g` + `workers.max=4` + `parallel=true` | `todo.txt_KWP/gradle.properties` | Parallel Kotlin compilation, no OOM on Wasm |
| `--build-cache` | `scripts/build-kmp-web.mjs` | Incremental Wasm builds reuse cached outputs |
| `incremental: true` | `todo.txt_REACT/tsconfig.json` | Faster `tsc --noEmit` on rebuild |
| `minify: esbuild` + `target: esnext` + `cssMinify` | `todo.txt_REACT/vite.config.js` | Smaller, faster React production output |
| pnpm catalog + single lockfile | `pnpm-workspace.yaml` | One install, hoisted deps, faster CI |

## Shared KMP core

`todo.txt_KWP/core/` contains the canonical Todo.Txt parser, habit merge and streak calculations, scheduling parser, widget projection, and shared document rules. It targets JVM and Kotlin/Wasm. The core contains no UI, Android APIs, filesystem implementation, network client, or persistence implementation.

Todo.Txt tasks remain plain-text lines. The canonical representation preserves optional completion markers, priorities, creation and completion dates, projects, contexts, and product extensions such as due metadata. Shared parser behavior is tested in the core module and consumed directly by the active application.

## Browser and platform boundaries

Browser APIs cannot provide every native capability identically. Browser due-task reminders use the Notification API while the page is open and recheck on visibility/focus; exact closed-tab alarms require a separate push/service-worker backend. Browser encrypted `.tdb` backup and restore uses the same wire contract as Android and desktop through Web Crypto. These are explicit capability boundaries rather than silent fallbacks.

## Firebase configuration

Firebase Web API keys and project IDs are public client identifiers, not service-account credentials. Configure `FIREBASE_API_KEY` and `FIREBASE_PROJECT_ID` as Netlify environment variables or GitHub repository secrets; the KMP web build injects them into `index.html`. Authentication and restrictive Firestore Rules remain the security boundary.

For Android, pass the corresponding values as Gradle properties when assembling a configured build:

```bash
cd todo.txt_KWP
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
├── pnpm-workspace.yaml         # Workspace + catalog (shared JS tooling versions)
├── biome.json                  # Root Biome config (extended by packages)
├── tsconfig.base.json          # Root TS base config (extended by packages)
├── todo.txt_KWP/               # Active KMP/Compose app (Gradle + pnpm tooling)
│   ├── app/                    # Compose Multiplatform application
│   ├── core/                   # KMP domain and shared core
│   └── package.json            # JS tooling only (Biome, TS via catalog:)
├── todo.txt_REACT/             # React/Vite app (pnpm, catalog: deps)
├── scripts/build-kmp-web.mjs   # Production Wasm build and dist assembly
├── netlify.toml                # KMP/Wasm Netlify configuration
└── .github/workflows/          # CI and release workflows
```

Generated Gradle outputs, Kotlin/Wasm stores, `node_modules`, and `dist/` are ignored. `pnpm install` at the root installs all workspace packages into a single lockfile.

## License

MIT
