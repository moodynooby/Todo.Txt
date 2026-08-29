package app.todotxt.update

import io.ktor.client.HttpClient
import io.ktor.client.request.accept
import io.ktor.client.request.get
import io.ktor.client.statement.bodyAsText
import io.ktor.http.ContentType
import io.ktor.http.HttpHeaders
import io.ktor.http.HttpStatusCode
import kotlinx.serialization.Serializable
import kotlinx.serialization.json.Json

object AppRelease {
    const val currentVersion = "0.1.1"
    const val repository = "moodynooby/Todo.Txt"
    const val releasesPage = "https://github.com/$repository/releases"
    private const val latestReleaseEndpoint = "https://api.github.com/repos/$repository/releases/latest"

    private val json = Json { ignoreUnknownKeys = true }
    private val client = HttpClient()

    suspend fun checkLatest(): ReleaseUpdate? {
        val response = client.get(latestReleaseEndpoint) {
            headers.append(HttpHeaders.UserAgent, "TodoTxt/$currentVersion")
            accept(ContentType.Application.Json)
        }
        if (response.status != HttpStatusCode.OK) return null

        val release = json.decodeFromString<GithubRelease>(response.bodyAsText())
        val version = parseVersion(release.tagName) ?: return null
        if (version <= Version.parse(currentVersion) || release.draft || release.prerelease) return null

        return ReleaseUpdate(
            version = version.toString(),
            name = release.name?.takeIf { it.isNotBlank() } ?: "Todo.Txt $version",
            notes = release.body?.trim().orEmpty(),
            url = release.htmlUrl,
        )
    }

    private fun parseVersion(tag: String): Version? {
        val match = Regex("(?:app-)?v?(\\d+)\\.(\\d+)\\.(\\d+)(?:[-+].*)?").matchEntire(tag.trim())
            ?: return null
        return Version(
            major = match.groupValues[1].toInt(),
            minor = match.groupValues[2].toInt(),
            patch = match.groupValues[3].toInt(),
        )
    }
}

@Serializable
private data class GithubRelease(
    @kotlinx.serialization.SerialName("tag_name") val tagName: String,
    val name: String? = null,
    val body: String? = null,
    @kotlinx.serialization.SerialName("html_url") val htmlUrl: String,
    val draft: Boolean = false,
    val prerelease: Boolean = false,
)

data class ReleaseUpdate(
    val version: String,
    val name: String,
    val notes: String,
    val url: String,
)

data class Version(
    val major: Int,
    val minor: Int,
    val patch: Int,
) : Comparable<Version> {
    override fun compareTo(other: Version): Int = compareValuesBy(
        this,
        other,
        Version::major,
        Version::minor,
        Version::patch,
    )

    override fun toString(): String = "$major.$minor.$patch"

    companion object {
        fun parse(value: String): Version {
            val parts = value.removePrefix("v").split(".")
            return Version(
                major = parts.getOrNull(0)?.toIntOrNull() ?: 0,
                minor = parts.getOrNull(1)?.toIntOrNull() ?: 0,
                patch = parts.getOrNull(2)?.takeWhile { it.isDigit() }?.toIntOrNull() ?: 0,
            )
        }
    }
}

sealed class UpdateStatus {
    data object Idle : UpdateStatus()
    data object Checking : UpdateStatus()
    data object UpToDate : UpdateStatus()
    data class Available(val release: ReleaseUpdate) : UpdateStatus()
    data class Failed(val message: String) : UpdateStatus()
}

suspend fun checkForReleaseUpdate(): UpdateStatus = runCatching {
    val update = AppRelease.checkLatest()
    if (update == null) UpdateStatus.UpToDate else UpdateStatus.Available(update)
}.getOrElse { error ->
    UpdateStatus.Failed(error.message ?: "Could not check for updates")
}

expect fun openReleaseUrl(url: String): Boolean
