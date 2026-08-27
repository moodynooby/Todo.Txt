package app.todotxt.platform

/** Wall-clock milliseconds shared by persistence, sync, UI, and the core domain. */
fun nowMillis(): Long = app.todotxt.core.currentTimeMillis()
