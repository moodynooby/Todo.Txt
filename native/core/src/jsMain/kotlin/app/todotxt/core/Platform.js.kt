package app.todotxt.core

actual fun currentTimeMillis(): Long = js("Date.now()").unsafeCast<Double>().toLong()
