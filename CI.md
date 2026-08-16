# Continuous Integration & Releases

The repository ships a GitHub Actions workflow (`.github/workflows/tauri.yml`)
that turns every git tag into a full set of native installers, and gives fast
feedback on every push and pull request.

## What the workflow does

| Job | Trigger | Output |
|---|---|---|
| `check` | Every push / PR | Lint + typecheck + Linux desktop build (`tauri build`) |
| `build-desktop` | Tagged releases only | `.deb`, `.rpm`, `.AppImage` (Ubuntu), `.exe`/`.msi` (Windows), `.dmg` (macOS) |
| `build-android` | Tagged releases only | Universal `.apk` and Google Play-ready `.aab` |
| `release` | Tagged releases only | Assembles all artifacts into a GitHub Release with auto-generated notes |

## Releasing

1. Bump `version` in `src-tauri/tauri.conf.json` (e.g. `1.0.2`).
2. Tag and push: `git tag v1.0.2 && git push origin v1.0.2`.
3. The workflow runs; when it finishes a GitHub Release appears under
   [Releases](https://github.com/moodynooby/Todo.Txt/releases) with every
   installer attached.

Tags containing `beta`, `alpha`, or `rc` are marked as pre-releases.

## Required repository secrets

Desktop builds work with zero configuration. Android Play Store builds need
signing; upload these secrets in
[Settings → Secrets and variables → Actions](https://github.com/moodynooby/Todo.Txt/settings/secrets/actions):

| Secret | Purpose | How to create |
|---|---|---|
| `ANDROID_KEYSTORE_BASE64` | Release signing keystore | `base64 -w0 app/release.keystore` after generating one with `keytool` |
| `ANDROID_KEYSTORE_PASSWORD` | Keystore password | Same as in `key.properties` |
| `ANDROID_KEY_ALIAS` | Key alias | Same as in `key.properties` |
| `ANDROID_KEY_PASSWORD` | Key password | Same as in `key.properties` |
| `APPLE_CERTIFICATE` | macOS signing (optional) | Exported `.p12`, base64-encoded |
| `APPLE_CERTIFICATE_PASSWORD`, `KEYCHAIN_PASSWORD` | Unlock certificate in CI | Chosen when exporting the `.p12` |

Without the Android secrets the workflow still produces a debug-signed APK,
which is fine for sideloading but will be rejected by the Play Store.

### Generating an Android keystore (one time)

```bash
keytool -genkeypair -v -keystore release.keystore -alias todotxt \
  -keyalg RSA -keysize 2048 -validity 10000
base64 -w0 release.keystore  # paste into ANDROID_KEYSTORE_BASE64
```

Keep `release.keystore` somewhere safe and permanent — losing it means you
can never update the app on the Play Store under the same package identity.

## Local development

The workflow mirrors the local commands, so nothing in CI is surprising:

```bash
pnpm install        # dependencies (pnpm, required by this repo)
pnpm check          # biome lint + typecheck
pnpm tauri build    # desktop installer for your platform
pnpm tauri android build --apk   # Android APK
pnpm tauri android build --aab   # Android App Bundle
```
