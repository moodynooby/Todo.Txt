# Firebase Anonymous Sync

The native app now contains a local-first Firebase sync worker for Android. There is **no user-facing login screen**. The app signs in anonymously through Firebase, stores the anonymous session in the app-private storage directory, and synchronizes snapshots through Firestore.

## Firebase Console setup

1. Create or select a Firebase project.
2. Enable **Authentication → Sign-in method → Anonymous**.
3. Create a **Cloud Firestore** database.
4. Copy the Firebase Web API key and project ID. The REST-based client only needs these two values; do not commit them to source control.
5. Configure Firestore rules before testing with real data.

For the current MVP group-capability flow, the app uses a high-entropy sync-group ID created on the first device and included in the existing QR pairing URL. The second device reads the group ID from the QR URL and stores it locally. Both devices then write to the same Firestore group while using separate anonymous Firebase identities.

## Local Android build

From the `native` directory, pass the Firebase values as Gradle properties:

```bash
./gradlew :app:assembleDebug \
  -PfirebaseApiKey="YOUR_FIREBASE_WEB_API_KEY" \
  -PfirebaseProjectId="YOUR_FIREBASE_PROJECT_ID"
```

The values are injected into Android `BuildConfig` fields and are not stored in the repository. Firebase web API keys are identifiers rather than service-account secrets, but Firestore Rules and Anonymous Authentication must still be configured correctly.

## Firestore structure

```text
syncGroups/{groupId}/snapshots/{deviceId}
```

Each device writes one snapshot document. The snapshot contains the todo.txt content, notes, habits, timers, app settings, and drawings. The GROQ API key is intentionally excluded from synchronization.

## Development rules

For a local prototype, the following rules allow authenticated anonymous users to use a known high-entropy group path:

```text
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /syncGroups/{groupId}/snapshots/{deviceId} {
      allow read, write: if request.auth != null;
    }
  }
}
```

This is suitable only for an MVP where the group ID is treated as a secret capability and pairing is performed in person. Do not use these rules for sensitive production data without adding membership documents or a server-side pairing function that verifies which anonymous user belongs to each group.

A stronger production model is:

```text
syncGroups/{groupId}/members/{anonymousUid}
syncGroups/{groupId}/snapshots/{deviceId}
```

Then the rules can require that the authenticated anonymous UID has a membership document for the group. The one-time QR pairing service should create that membership only after both devices confirm the pairing code.

## Runtime behavior

When Android starts, the app initializes local storage and starts the Firebase sync worker. If Firebase Gradle properties are absent, synchronization remains disabled and the app stays local-only.

When Firebase is configured:

- Anonymous authentication is performed automatically.
- Local changes remain available while offline.
- The worker retries after temporary network failures.
- Wi-Fi-to-cellular and cellular-to-Wi-Fi changes cause the next sync pass to retry the same group.
- Session refresh uses the stored Firebase refresh token.
- The worker polls Firestore every five seconds while the app process is alive.
- Local changes are written before upload, so the app remains usable without a connection.
- The existing QR pairing flow now carries the Firebase sync-group ID.

The current implementation uses snapshot-level last-write-wins behavior. Before using it for collaborative or high-value records, add per-record versions or a server-side conflict resolver.

## Validation checklist

Test the Android build with two devices or emulators:

1. Start the app with Firebase configured.
2. Create a todo while online and verify the snapshot appears in Firestore.
3. Enable airplane mode and create another todo.
4. Close and reopen the app while offline.
5. Switch from Wi-Fi to cellular or back.
6. Disable airplane mode and verify the pending snapshot uploads.
7. Pair a second device using the existing QR flow.
8. Verify that both devices use the same sync-group ID but different anonymous Firebase UIDs.
9. Confirm that the GROQ API key is absent from the Firestore snapshot.
10. Review Firestore Rules logs and remove any development-only broad rules before release.

## Automated releases

The repository already contains a GitHub Actions release workflow at `.github/workflows/release.yml`. Native desktop and Android jobs now build the commit associated with the release ref instead of checking out a hard-coded branch.

The recommended release process is:

```bash
git checkout main
git pull origin main
git tag app-v0.1.1
git push origin app-v0.1.1
```

The tag starts the workflow. It builds the Windows installer, Linux package, Android release APK, and web bundle, then attaches the artifacts to a GitHub Release.

Configure these repository secrets before creating a release:

| Secret | Purpose |
|---|---|
| `FIREBASE_API_KEY` | Firebase project API key passed to the Android build |
| `FIREBASE_PROJECT_ID` | Firebase project ID passed to the Android build |
| `BASE64_KEYSTORE` | Base64-encoded production Android signing keystore |
| `KEYSTORE_PASSWORD` | Keystore password |
| `KEY_ALIAS` | Android signing key alias |
| `KEY_PASSWORD` | Android signing key password |

If the signing secrets are not configured, the workflow generates a temporary CI keystore. That is acceptable for an installable test APK but not for production distribution, because replacing an Android signing key prevents normal app upgrades.

The release job fails before the Android build if the Firebase API key or project ID is missing. This prevents publishing an APK that silently falls back to local-only synchronization.
