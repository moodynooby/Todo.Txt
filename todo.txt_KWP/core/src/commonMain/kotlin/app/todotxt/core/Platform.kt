package app.todotxt.core

/** Milliseconds since the Unix epoch, resolved per platform (pure arithmetic
 * is intentionally avoided so dates and clocks stay consistent with the host
 * OS timezone and clock). */
expect fun currentTimeMillis(): Long
