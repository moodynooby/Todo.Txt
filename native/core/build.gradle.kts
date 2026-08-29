import org.jetbrains.kotlin.gradle.ExperimentalWasmDsl
import org.jetbrains.kotlin.gradle.dsl.JvmTarget

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
        val commonMain by getting {
            dependencies {
                api("org.jetbrains.kotlinx:kotlinx-serialization-json:1.7.3")
                implementation(libs.kotlinx.datetime)
            }
        }
        val commonTest by getting {
            dependencies {
                implementation(kotlin("test"))
            }
        }
    }
}

publishing {
    repositories {
        mavenLocal()
    }
}
