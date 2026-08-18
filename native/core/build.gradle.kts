plugins {
    kotlin("multiplatform") version "2.1.21"
    id("org.jetbrains.kotlin.plugin.serialization") version "2.1.21"
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
        compilations.all {
            kotlinOptions.jvmTarget = "21"
        }
        withJava()
    }

    // JS target consumed by the TypeScript web app (npm package `todotxt-core`)
    js(IR) {
        browser {
            testTask {
                useKarma {
                    useChromeHeadless()
                }
            }
            distribution {
                outputDirectory = file("$buildDir/dist/js")
            }
        }
    }

    sourceSets {
        val commonMain by getting {
            dependencies {
                api("org.jetbrains.kotlinx:kotlinx-serialization-json:1.7.3")
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
