package app.todotxt.sync

import app.todotxt.BuildConfig

actual object FirebaseProjectConfig {
    actual val apiKey: String = BuildConfig.FIREBASE_API_KEY
    actual val projectId: String = BuildConfig.FIREBASE_PROJECT_ID
}
