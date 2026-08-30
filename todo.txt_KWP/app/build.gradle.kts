import org.jetbrains.kotlin.gradle.ExperimentalKotlinGradlePluginApi
import org.jetbrains.kotlin.gradle.ExperimentalWasmDsl
import org.jetbrains.kotlin.gradle.dsl.JvmTarget
import org.jetbrains.kotlin.gradle.tasks.KotlinCompile

plugins {
    alias(libs.plugins.kotlinMultiplatform)
    alias(libs.plugins.composeMultiplatform)
    alias(libs.plugins.composeCompiler)
    alias(libs.plugins.androidApplication)
    alias(libs.plugins.serialization)
}

@OptIn(ExperimentalWasmDsl::class)
kotlin {
    androidTarget {
        @OptIn(ExperimentalKotlinGradlePluginApi::class)
        compilerOptions {
            jvmTarget.set(JvmTarget.JVM_17)
        }
    }

    jvm("desktop") {
        @OptIn(ExperimentalKotlinGradlePluginApi::class)
        compilerOptions {
            jvmTarget.set(JvmTarget.JVM_17)
        }
    }

    // Compose Multiplatform web target. This is the KMP-first browser path;
    // platform-only services receive explicit wasmJs actuals as the target is
    // brought to parity with Android and desktop.
    wasmJs {
        browser()
        binaries.executable()
    }

    sourceSets {
        val commonMain = getByName("commonMain") {
            dependencies {
                implementation(compose.runtime)
                implementation(compose.foundation)
                implementation(compose.material3)
                implementation(compose.materialIconsExtended)
                implementation(compose.ui)
                implementation(compose.components.resources)
                implementation(compose.components.uiToolingPreview)

                implementation(libs.kotlinx.coroutines.core)
                implementation(libs.kotlinx.datetime)
                implementation(libs.kotlinx.serialization.json)
                implementation(libs.ktor.client.core)
                implementation(libs.ktor.client.content.negotiation)
                implementation(libs.ktor.serialization.kotlinx.json)
                implementation(libs.ktor.client.websockets)
                implementation(libs.reorderable)

                api(project(":core"))
            }
        }
        val commonTest = getByName("commonTest") {
            dependencies {
                implementation(kotlin("test"))
                implementation(libs.kotlinx.coroutines.test)
            }
        }
        val androidMain = getByName("androidMain") {
            dependencies {
                implementation(libs.ktor.client.cio)
                implementation(compose.preview)
                implementation(libs.androidx.activity.compose)
                implementation(libs.androidx.glance.appwidget)
                implementation(libs.androidx.glance.material3)
                implementation(libs.camerax)
                implementation(libs.camerax.lifecycle)
                implementation(libs.camerax.view)
                implementation(libs.mlkit.barcode)
            }
        }
        val desktopMain = getByName("desktopMain") {
            dependencies {
                implementation(libs.ktor.client.cio)
                implementation(compose.desktop.currentOs)
            }
        }
        val wasmJsMain = getByName("wasmJsMain") {
            dependencies {
                implementation(libs.kotlinx.browser)
                implementation(libs.ktor.client.js)
            }
        }
    }
}

val firebaseApiKey = providers.gradleProperty("firebaseApiKey").orElse("").get()
val firebaseProjectId = providers.gradleProperty("firebaseProjectId").orElse("").get()

fun String.asBuildConfigLiteral(): String = "\"${replace("\\", "\\\\").replace("\"", "\\\"")}\""

android {
    namespace = "app.todotxt"
    compileSdk = libs.versions.android.compileSdk.get().toInt()

    defaultConfig {
        applicationId = "net.todotxt.app"
        minSdk = libs.versions.android.minSdk.get().toInt()
        targetSdk = libs.versions.android.targetSdk.get().toInt()
        versionCode = 3
        versionName = "0.1.2"
        buildConfigField("String", "FIREBASE_API_KEY", firebaseApiKey.asBuildConfigLiteral())
        buildConfigField("String", "FIREBASE_PROJECT_ID", firebaseProjectId.asBuildConfigLiteral())
    }

    buildFeatures {
        buildConfig = true
    }

    packaging {
        resources {
            excludes += "/META-INF/{AL2.0,LGPL2.1}"
            // Netty jars each ship their own INDEX.LIST/INDEXES — exclude duplicates
            excludes += "META-INF/INDEX.LIST"
            excludes += "META-INF/INDEXES"
            excludes += "META-INF/io.netty.versions.properties"
        }
    }

    lint {
        abortOnError = false
    }

    buildTypes {
        getByName("release") {
            isMinifyEnabled = false
        }
    }

    compileOptions {
        sourceCompatibility = JavaVersion.VERSION_17
        targetCompatibility = JavaVersion.VERSION_17
    }
}

tasks.withType<KotlinCompile>().configureEach {
    compilerOptions {
        optIn.add("kotlin.ExperimentalStdlibApi")
        freeCompilerArgs.add("-Xexpect-actual-classes")
        allWarningsAsErrors.set(false)
    }
}

compose.desktop {
    application {
        mainClass = "app.todotxt.MainKt"
        buildTypes {
            release {
                // CMP 1.7.x bundles ProGuard 7.2 which cannot read JDK 17+ jmods
                // used when building the custom runtime image; ship the app
                // unminified instead (desktop distribution size is not critical).
                proguard.isEnabled.set(false)
            }
        }
        nativeDistributions {
            targetFormats(
                // RPM and DMG are only supported by jpackage on their native hosts,
                // so each CI host builds its own format below (see build filters).
                org.jetbrains.compose.desktop.application.dsl.TargetFormat.Deb,
                // AppImage omitted: jpackage needs appimagetool (not on CI runners); deb covers Linux
                org.jetbrains.compose.desktop.application.dsl.TargetFormat.Msi,
            )
            packageName = "T0do.TxT"
            packageVersion = "0.1.2"

            linux {
                appCategory = "Office"
                iconFile.set(project.file("src/desktopMain/resources/icon.png"))
            }
            windows {
                menuGroup = "T0do.TxT"
                iconFile.set(project.file("src/desktopMain/resources/icon.ico"))
            }
            macOS {
                iconFile.set(project.file("src/desktopMain/resources/icon.icns"))
            }
        }
    }
}
