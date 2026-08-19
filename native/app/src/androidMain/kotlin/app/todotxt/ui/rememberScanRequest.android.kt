package app.todotxt.ui

/**
 * Android: returns a callback that opens the QR scanner.
 * When a QR code is detected, it connects to the peer via WebSocket.
 */
actual fun rememberScanRequest(): () -> Unit {
    return {
        // Sets a flag that the P2pSyncPage observes to show the scanner
        app.todotxt.service.P2pSyncManager.setScanRequested(true)
    }
}
