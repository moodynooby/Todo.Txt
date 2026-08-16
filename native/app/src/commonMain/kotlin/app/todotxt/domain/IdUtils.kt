package app.todotxt.domain

/** Simple monotonic-ish id generator mirroring the web `nanoid`-style ids. */
object IdUtils {
    private val alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789"

    fun newId(length: Int = 10): String {
        val bytes = ByteArray(length)
        // Deterministic free random source available on all KMP targets
        (0 until length).forEach { bytes[it] = (kotlin.random.Random.nextInt(alphabet.length)).toByte() }
        return bytes.map { alphabet[it.toInt()] }.joinToString("")
    }
}
