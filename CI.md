# Continuous Integration & Releases

The repository contains two products in the same repo:

1. **Web app** (`webapp-src/`, `main` branch) — React + Vite SPA served as a
   browser app / PWA.
2. **Native app** (`native/`, `native/kotlin-compose` branch) — Kotlin
   Compose Multiplatform targeting **Android** and **Desktop JVM** (Windows /
   Linux). No Tauri, no iOS, no macOS.

Each has its own build system, and both are expected to compile cleanly on the
`native/kotlin-compose` branch:

```bash
# Web app (main branch)
cd webapp-src && npm install && npm run build        # Vite production build
cd webapp-src && npx tsc --noEmit                    # typecheck

# Native app (native/kotlin-compose branch)
cd native
export ANDROID_HOME=$HOME/android-sdk
./gradlew :app:compileKotlinDesktop                  # desktop JVM target
./gradlew :app:compileDebugKotlinAndroid             # android target
./gradlew :core:jvmTest                              # shared-core tests
./gradlew :core:jsBrowserProductionWebpack           # rebuild @todotxt/core JS bundle
```

The shared core (`native/core/`) ships a Kotlin/JS bundle consumed by the web
app as a local file dependency (`@todotxt/core` →
`file:../Todo.Txt/native/core/npm-package`). The `npm-package/` directory is
**not committed** (see `.gitignore`); regenerate it with the Gradle command
above and then `npm install` inside `webapp-src/`.

## Releasing the web app

1. Bump `version` in `webapp-src/package.json`.
2. Tag and push on `main`: `git tag v1.0.2 && git push origin v1.0.2`.

The web app is deployable as a static build from `webapp-src/dist/` on any
static host or served behind any HTTP server.

## Releasing the native app

1. Bump `versionName` / `versionCode` in
   `native/app/build.gradle.kts`.
2. Tag and push on `native/kotlin-compose`:
   `git tag app-v1.0.2 && git push origin app-v1.0.2`.
3. Build installers locally (or wire up a GitHub Actions workflow per the
   commands above):

```bash
cd native && ./gradlew assembleRelease            # universal APK
cd native && ./gradlew packageReleaseDistributionForCurrentOS  # desktop installer
```

## Android release signing (one time)

Play Store builds need a keystore; upload these secrets to
[Settings → Secrets and variables → Actions](https://github.com/moodynooby/Todo.Txt/settings/secrets/actions):

| Secret | Purpose |
|---|---|
| `ANDROID_KEYSTORE_BASE64` | Release signing keystore (`base64 -w0 app/release.keystore`) |
| `ANDROID_KEYSTORE_PASSWORD` | Keystore password |
| `ANDROID_KEY_ALIAS` | Key alias |
| `ANDROID_KEY_PASSWORD` | Key password |

```bash
keytool -genkeypair -v -keystore release.keystore -alias todotxt \
  -keyalg RSA -keysize 2048 -validity 10000
```

Keep `release.keystore` safe and permanent — losing it means you can never
update the app on the Play Store under the same package identity.

## Local development

```bash
# Web app
cd webapp-src && pnpm install && pnpm dev     # Vite dev server (port 5173)

# Native app
cd native
./gradlew :app:run -DmainClass=app.todotxt.MainKt   # desktop run
./gradlew :app:installDebug                          # install on connected device/emulator
```
