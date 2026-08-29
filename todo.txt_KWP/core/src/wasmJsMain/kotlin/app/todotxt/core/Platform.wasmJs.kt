package app.todotxt.core

import kotlin.time.Clock

actual fun currentTimeMillis(): Long = Clock.System.now().toEpochMilliseconds()
