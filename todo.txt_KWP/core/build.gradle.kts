import org.jetbrains.kotlin.gradle.ExperimentalWasmDsl
import org.jetbrains.kotlin.gradle.dsl.JvmTarget
import org.jetbrains.kotlin.gradle.tasks.KotlinCompile

plugins {
    alias(libs.plugins.kotlinMultiplatform)
    alias(libs.plugins.serialization)
    `maven-publish`
}

group = "app.todotxt"
version = "1.0.0"

repositories {
    mavenCentral()
}

kotlin {
    // JVM target consumed by the Compose Multiplatform native app
    jvm {
        compilerOptions {
            jvmTarget.set(JvmTarget.JVM_17)
        }
    }

    @OptIn(ExperimentalWasmDsl::class)
    wasmJs {
        browser()
    }

    sourceSets {
        val commonMain = getByName("commonMain") {
            dependencies {
                api("org.jetbrains.kotlinx:kotlinx-serialization-json:1.7.3")
                implementation(libs.kotlinx.datetime)
            }
        }
        val commonTest = getByName("commonTest") {
            dependencies {
                implementation(kotlin("test"))
            }
        }
    }
}

tasks.withType<KotlinCompile>().configureEach {
    compilerOptions {
        optIn.add("kotlin.ExperimentalStdlibApi")
        freeCompilerArgs.add("-Xexpect-actual-classes")
    }
}

publishing {
    repositories {
        mavenLocal()
    }
}
