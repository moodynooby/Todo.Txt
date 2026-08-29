package app.todotxt.platform

import android.media.AudioManager
import android.media.ToneGenerator

/** Android: a short system-style tone via `ToneGenerator`. */
actual fun playBeep() {
    runCatching {
        val tone = ToneGenerator(AudioManager.STREAM_ALARM, 200)
        tone.startTone(ToneGenerator.TONE_CDMA_ABBR_ALERT, 500)
    }
}
