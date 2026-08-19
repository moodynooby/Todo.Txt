package app.todotxt.core

import java.time.LocalDate

actual fun todayString(): String = LocalDate.now().toString()

actual fun addDaysString(base: String, days: Int): String =
    LocalDate.parse(base).plusDays(days.toLong()).toString()
