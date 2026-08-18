package app.todotxt.core

import kotlin.js.Date

/**
 * JS date arithmetic over the browser `Date` API (stdlib external class,
 * which emits `new Date(...)` correctly): arithmetic in local time
 * automatically normalises month/year overflow, so add-days works on any
 * ISO date string without a calendar library.
 */
actual fun todayString(): String = Date().iso()

actual fun addDaysString(base: String, days: Int): String {
    val parts = base.split("-")
    // Rebuilding through the constructor lets the JS engine normalise
    // overflow (e.g. day 32 of a month rolls into the next month).
    val d = Date(
        parts[0].toInt(),
        parts[1].toInt() - 1,
        parts[2].toInt() + days,
    )
    return d.iso()
}

private fun Date.iso(): String {
    val y = this.getFullYear().toString().padStart(4, '0')
    val m = (this.getMonth() + 1).toString().padStart(2, '0')
    val day = this.getDate().toString().padStart(2, '0')
    return "$y-$m-$day"
}
