package app.todotxt.core

/** Status shown by the task dependency inspector. */
enum class DependencyStatus {
    ACTIVE,
    BLOCKED,
    COMPLETED,
}

/** One todo task projected into the dependency graph. */
data class DependencyNode(
    val id: String,
    val taskText: String,
    val completed: Boolean,
    val after: List<String>,
    val blocks: List<String>,
)

/** Result of checking a todo document's dependency metadata. */
data class DependencyReport(
    val nodes: List<DependencyNode>,
    val statuses: Map<String, DependencyStatus>,
    val cyclePath: List<String> = emptyList(),
    val missingReferences: List<String> = emptyList(),
) {
    val hasCycle: Boolean get() = cyclePath.isNotEmpty()
}

/**
 * Platform-neutral equivalent of the legacy web dependency inspector.
 * Metadata grammar is delegated to [TaskMetadataParser] so every target uses
 * the same `id:`, `after:`, and `blocks:` interpretation.
 */
object DependencyAnalyzer {
    fun build(tasks: List<Task>): DependencyReport {
        val nodes = tasks.map { task ->
            val metadata = TaskMetadataParser.parse(task.raw.ifBlank { task.text })
            DependencyNode(
                id = metadata.id ?: "line-${task.id + 1}",
                taskText = task.text,
                completed = task.completed,
                after = metadata.after,
                blocks = metadata.blocks,
            )
        }
        val knownIds = nodes.mapTo(mutableSetOf()) { it.id }
        val missing = nodes
            .flatMap { it.after + it.blocks }
            .filter { it !in knownIds }
            .distinct()
            .sorted()
        val statuses = nodes.associate { node ->
            node.id to if (node.completed) {
                DependencyStatus.COMPLETED
            } else if (node.after.any { it !in knownIds || nodes.first { candidate -> candidate.id == it }.completed.not() }) {
                DependencyStatus.BLOCKED
            } else {
                DependencyStatus.ACTIVE
            }
        }
        val adjacency = nodes.associate { node ->
            node.id to (node.blocks + nodes.filter { it.after.contains(node.id) }.map { it.id }).distinct()
        }
        val cyclePath = findCycle(nodes.map { it.id }, adjacency)
        return DependencyReport(
            nodes = nodes,
            statuses = statuses,
            cyclePath = cyclePath,
            missingReferences = missing,
        )
    }

    private fun findCycle(ids: List<String>, adjacency: Map<String, List<String>>): List<String> {
        val visited = mutableSetOf<String>()
        val visiting = mutableSetOf<String>()

        fun visit(id: String, path: List<String>): List<String> {
            if (id in visiting) {
                val start = path.indexOf(id).coerceAtLeast(0)
                return path.drop(start) + id
            }
            if (!visited.add(id)) return emptyList()
            visiting.add(id)
            val nextPath = path + id
            for (neighbor in adjacency[id].orEmpty()) {
                val cycle = visit(neighbor, nextPath)
                if (cycle.isNotEmpty()) return cycle
            }
            visiting.remove(id)
            return emptyList()
        }

        for (id in ids) {
            val cycle = visit(id, emptyList())
            if (cycle.isNotEmpty()) return cycle
        }
        return emptyList()
    }
}
