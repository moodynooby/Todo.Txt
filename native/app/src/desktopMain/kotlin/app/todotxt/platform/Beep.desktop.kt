package app.todotxt.platform

import java.awt.Toolkit

/** Desktop: system alert beep via the AWT toolkit. */
actual fun playBeep() {
    runCatching { Toolkit.getDefaultToolkit().beep() }
}
