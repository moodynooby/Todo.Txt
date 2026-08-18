plugins {
    kotlin("jvm") version "2.1.21"
    id("org.jetbrains.kotlin.plugin.serialization") version "2.1.21"
    `java-library`
    `maven-publish`
}

group = "app.todotxt"
version = "1.0.0"

repositories {
    mavenCentral()
}

kotlin {
    jvmToolchain(21)
}

dependencies {
    api("org.jetbrains.kotlinx:kotlinx-serialization-json:1.7.3")
    testImplementation(kotlin("test"))
}

tasks.test {
    useJUnitPlatform()
}

publishing {
    publications {
        create<MavenPublication>("mavenJava") {
            from(components["java"])
            artifactId = "todotxt-core"
            groupId = "app.todotxt"
            version = "1.0.0"
        }
    }
    repositories {
        mavenLocal()
    }
}
