package app.todotxt.core

import kotlin.time.Clock
import kotlinx.datetime.DateTimeUnit
import kotlinx.datetime.LocalDate
import kotlinx.datetime.TimeZone
import kotlinx.datetime.plus
import kotlinx.datetime.toLocalDateTime

actual fun todayString(): String =
    Clock.System.now().toLocalDateTime(TimeZone.currentSystemDefault()).date.toString()

actual fun addDaysString(base: String, days: Int): String =
    LocalDate.parse(base).plus(days, DateTimeUnit.DAY).toString()
