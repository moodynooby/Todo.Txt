import java.io.File
import javax.inject.Inject
import org.apache.tools.ant.taskdefs.condition.Os
import org.gradle.api.DefaultTask
import org.gradle.api.GradleException
import org.gradle.api.logging.LogLevel
import org.gradle.api.tasks.Input
import org.gradle.api.tasks.TaskAction
import org.gradle.process.ExecOperations
import org.gradle.api.Action
import org.gradle.process.ExecSpec

abstract class BuildTask : DefaultTask() {
    @get:Inject
    abstract val execOperations: ExecOperations

    @Input
    var rootDirRel: String? = null
    @Input
    var projectDir: String? = null
    @Input
    var target: String? = null
    @Input
    var release: Boolean? = null

    @TaskAction
    fun assemble() {
        val executable = "pnpm"
        try {
            runTauriCli(executable)
        } catch (e: Exception) {
            if (Os.isFamily(Os.FAMILY_WINDOWS)) {
                val fallbacks = listOf(
                    "$executable.exe",
                    "$executable.cmd",
                    "$executable.bat"
                )
                
                var lastException: Exception = e
                for (fallback in fallbacks) {
                    try {
                        runTauriCli(fallback)
                        return
                    } catch (fallbackException: Exception) {
                        lastException = fallbackException
                    }
                }
                throw lastException
            } else {
                throw e
            }
        }
    }

    private fun runTauriCli(executable: String) {
        val rootDirRel = rootDirRel ?: throw GradleException("rootDirRel cannot be null")
        val projectDir = projectDir ?: throw GradleException("projectDir cannot be null")
        val target = target ?: throw GradleException("target cannot be null")
        val release = release ?: throw GradleException("release cannot be null")
        
        val ndkEnv = NdkLinkerEnv(projectDir)

        execOperations.exec(object : Action<ExecSpec> {
            override fun execute(spec: ExecSpec) {
                spec.workingDir(File(projectDir, rootDirRel))
                spec.executable(executable)
                spec.args("tauri", "android", "android-studio-script")
                if (logger.isEnabled(LogLevel.DEBUG)) {
                    spec.args("-vv")
                } else if (logger.isEnabled(LogLevel.INFO)) {
                    spec.args("-v")
                }
                if (release) {
                    spec.args("--release")
                }
                spec.args("--target", target)
                ndkEnv.environment().forEach { (key, value) -> spec.environment(key, value) }
            }
        }).assertNormalExitValue()
    }
}

class NdkLinkerEnv(projectDir: String) {
    private val ndkHome: File? = findNdkHome(projectDir)
    private val apiLevel = System.getenv("ANDROID_NATIVE_API_LEVEL") ?: "24"

    private val linkerTriples = listOf(
        "aarch64-linux-android" to "aarch64-linux-android",
        "armv7-linux-androideabi" to "armv7a-linux-androideabi",
        "i686-linux-android" to "i686-linux-android",
        "x86_64-linux-android" to "x86_64-linux-android"
    )

    fun environment(): Map<String, String> {
        val ndkHome = ndkHome ?: throw GradleException(
            "Android NDK not found. Set NDK_HOME or ANDROID_NDK_HOME, or configure sdk.dir in local.properties."
        )
        val binDir = File(
            File(File(ndkHome, "toolchains"), "llvm"),
            "prebuilt/${prebuiltHost()}/bin"
        )
        if (!binDir.isDirectory) {
            throw GradleException("NDK toolchain not found at $binDir")
        }

        val rustflags = "-Clink-arg=-landroid -Clink-arg=-llog -Clink-arg=-lOpenSLES"
        val env = mutableMapOf<String, String>()
        for ((triple, clangTriple) in linkerTriples) {
            val linker = findLinker(binDir, clangTriple)
            val prefix = "CARGO_TARGET_" + triple.replace('-', '_').uppercase()
            env[prefix + "_LINKER"] = linker
            env[prefix + "_RUSTFLAGS"] = rustflags
        }
        return env
    }

    private fun findLinker(binDir: File, clangTriple: String): String {
        val versioned = File(binDir, "$clangTriple$apiLevel-clang")
        if (versioned.isFile) {
            return versioned.absolutePath
        }
        return binDir.listFiles()
            ?.filter { it.isFile && it.name.startsWith("$clangTriple") && it.name.endsWith("-clang") }
            ?.sortedBy { it.name }
            ?.firstOrNull()
            ?.absolutePath
            ?: throw GradleException("Android NDK clang linker for $clangTriple not found in $binDir")
    }

    private fun prebuiltHost(): String {
        return when {
            Os.isFamily(Os.FAMILY_MAC) && System.getProperty("os.arch") == "aarch64" -> "darwin-arm64"
            Os.isFamily(Os.FAMILY_MAC) -> "darwin-x86_64"
            Os.isFamily(Os.FAMILY_WINDOWS) -> "windows-x86_64"
            else -> "linux-x86_64"
        }
    }

    private fun findNdkHome(projectDir: String): File? {
        for (key in listOf("NDK_HOME", "ANDROID_NDK_HOME", "ANDROID_NDK_ROOT")) {
            System.getenv(key)?.let { if (File(it).isDirectory) return File(it) }
        }

        val localProperties = File(File(projectDir, "app"), "local.properties")
        val propertiesDir = if (localProperties.isFile) {
            localProperties
        } else {
            File(projectDir, "local.properties")
        }
        val sdkDir = if (propertiesDir.isFile) {
            propertiesDir.readLines()
                .firstOrNull { it.trim().startsWith("sdk.dir=") }
                ?.substringAfter("=")
                ?.trim()
                ?.let { File(it) }
        } else {
            null
        }

        val ndkRoot = sdkDir?.let { File(it, "ndk") }
        if (ndkRoot?.isDirectory == true) {
            return ndkRoot.listFiles()
                ?.filter { it.isDirectory }
                ?.maxByOrNull { it.name }
                ?: ndkRoot
        }
        return null
    }
}
