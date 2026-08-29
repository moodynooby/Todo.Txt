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

From the `todo.txt_KWP` directory, pass the Firebase values as Gradle properties:

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

## Local backup and Firebase failure recovery

Firebase is not the only copy of the user's data. The native app now keeps three rotating snapshots in platform-private storage:

```text
local_backup_0.json
local_backup_1.json
local_backup_2.json
```

A snapshot is scheduled after local changes and after startup. Writes are debounced for 300 milliseconds so a burst of edits does not create unnecessary disk activity. Each snapshot contains the synced application state, a schema version, a timestamp, a reason, and a deterministic checksum.

The recovery behavior is:

| Failure | Result |
|---|---|
| Firebase is offline | Local data remains usable; the Firebase worker retries later |
| Network changes | Pending Firebase work is retried; local snapshots remain available |
| App is closed or restarted | The latest local files and backup snapshots remain on the device |
| A local JSON file is missing | The newest valid backup is restored at startup |
| A local JSON file is corrupted | The newest checksum-valid backup is restored at startup |
| A remote snapshot is applied | A local backup is created before the remote state is written |
| A backup slot is corrupted | That slot is ignored and an older valid slot is used |

The backup is intended to prevent data loss caused by synchronization failure. It is not a cloud backup: uninstalling the application or losing the physical device can still remove private app storage. A future version can add an explicit encrypted export to the user’s document provider or cloud drive.

## Encrypted portable backup and restore

The Sync screen now provides **Export backup** and **Restore backup** actions on Android. The export creates a `.tdb` file encrypted with AES-GCM. A passphrase-derived key is created with PBKDF2-HMAC-SHA256 and a random salt, so the backup can be stored in Google Drive, GitHub Releases, a USB drive, or any other user-controlled file location without putting the plaintext app data there.

The passphrase is never sent to Firebase and is not stored in the app. Use at least eight characters, preferably a longer unique phrase. If the passphrase is lost, the encrypted backup cannot be restored.

The Android flow is:

| Action | Result |
|---|---|
| Export backup | Encrypts the full app snapshot and opens the Android share sheet to save or send the `.tdb` file |
| Restore backup | Opens the Android document picker, decrypts the selected file, creates a local safety snapshot first, and replaces the current app state only after integrity checks pass |
| Wrong passphrase or damaged file | Rejects the file and leaves current app data unchanged |
| Device loss or app removal | Restore the `.tdb` file on a new installation using the same passphrase |

The portable backup is intentionally separate from Firebase. Firebase remains the live synchronization relay, while the encrypted `.tdb` file is a user-controlled disaster-recovery copy. Automatic upload to Google Drive is not enabled because that would require a cloud account, provider permissions, and additional credential management. The Android share sheet lets the user choose where the encrypted file should be stored.
