package app.todotxt.core

import kotlin.test.Test
import kotlin.test.assertEquals
import kotlin.test.assertFalse
import kotlin.test.assertTrue

class ParityContractsTest {
    @Test
    fun timerTransitionsRemainDeterministic() {
        val timer = TimerState(
            id = "focus",
            elapsed = 5_000,
            isActive = true,
            startedAt = 1_000,
            durationMs = 60_000,
        )
        assertEquals(14_000, TimerRuntime.elapsedAt(timer, 10_000))
        assertEquals(46_000, TimerRuntime.remainingAt(timer, 10_000))
        assertFalse(TimerRuntime.pause(timer, 10_000).isActive)
        assertEquals(14_000, TimerRuntime.pause(timer, 10_000).elapsed)
        assertEquals(0, TimerRuntime.reset(timer).elapsed)
        assertEquals(60_000, TimerRuntime.advance(timer, 100_000).elapsed)
        assertFalse(TimerRuntime.advance(timer, 100_000).isActive)
    }

    @Test
    fun contrastChoosesReadableForegroundForLightAndDarkSurfaces() {
        val darkOnLight = DynamicContrast.chooseForeground("#fff475")
        val lightOnDark = DynamicContrast.chooseForeground("#1e1e1e")
        assertTrue((DynamicContrast.contrastRatio("#fff475", darkOnLight) ?: 0.0) >= 4.5)
        assertTrue((DynamicContrast.contrastRatio("#1e1e1e", lightOnDark) ?: 0.0) >= 4.5)
    }

    @Test
    fun invalidColorsUseSafeCandidate() {
        assertEquals("#111827", DynamicContrast.chooseForeground("not-a-color"))
        assertEquals(null, DynamicContrast.contrastRatio("#fff", "zzzz"))
    }

    @Test
    fun validatorRejectsMarkdownWrappersAndAcceptsTaskLines() {
        assertTrue(TodoDocumentValidator.validate("(A) ship release +work @office").valid)
        assertFalse(TodoDocumentValidator.validate("```\nship release\n```").valid)
        assertFalse(TodoDocumentValidator.validate("# Tasks\nship release").valid)
    }
}
