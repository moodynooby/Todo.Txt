package app.todotxt.core.crdt

import kotlinx.serialization.Serializable

/**
 * A Last-Write-Wins (LWW) CRDT Map.
 *
 * This data structure is designed for offline-first P2P synchronization.
 * It ensures eventual consistency without requiring a central server.
 *
 * @param K The key type (e.g., Task ID, Habit ID).
 * @param V The value type.
 */
@Serializable
class LwwMap<K, V>(
    private val entries: Map<K, LwwEntry<V>> = emptyMap()
) {
    /**
     * The device ID of the node that owns this map.
     * Used for deterministic tie-breaking when timestamps are equal.
     */
    var deviceId: String = "unknown"

    constructor(deviceId: String) : this(emptyMap()) {
        this.deviceId = deviceId
    }

    /**
     * Updates a value.
     * @param key The unique identifier.
     * @param value The new value.
     * @param timestamp The logical clock or server timestamp (milliseconds).
     */
    fun put(key: K, value: V, timestamp: Long): LwwMap<K, V> {
        val newEntries = entries.toMutableMap()
        newEntries[key] = LwwEntry(value, timestamp, deviceId)
        return LwwMap(newEntries)
    }

    /**
     * Retrieves the current value for a key.
     */
    fun get(key: K): V? = entries[key]?.value

    /**
     * Returns all current values.
     */
    fun values(): Collection<V> = entries.values.map { it.value }

    /**
     * Merges another LWW Map into this one.
     * The merge rule is:
     * 1. Higher timestamp wins.
     * 2. If timestamps are equal, the higher (lexicographically) deviceId wins.
     */
    fun merge(other: LwwMap<K, V>): LwwMap<K, V> {
        val merged = entries.toMutableMap()
        other.entries.forEach { (key, otherEntry) ->
            val currentEntry = merged[key]
            if (currentEntry == null || otherEntry.winsOver(currentEntry)) {
                merged[key] = otherEntry
            }
        }
        return LwwMap(merged)
    }
}

/**
 * An entry in the LWW Map.
 */
@Serializable
data class LwwEntry<V>(
    val value: V,
    val timestamp: Long,
    val deviceId: String
) {
    /**
     * Determines if this entry should overwrite [other].
     */
    fun winsOver(other: LwwEntry<V>): Boolean {
        return when {
            this.timestamp > other.timestamp -> true
            this.timestamp == other.timestamp -> this.deviceId > other.deviceId
            else -> false
        }
    }
}
