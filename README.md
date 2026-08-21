# Todo.Txt

A simple todo app based on the philosophy of [todo.txt](https://github.com/todotxt/todo.txt). It is a plain text, software and operating system agnostic, searchable, portable, lightweight, and easily manipulated todo application.

## Links

- [Todo.txt](https://github.com/todotxt/todo.txt)
- [Website](https://todotxt.netlify.app/)

## Features

- Simple and lightweight
- Based on the todo.txt philosophy
- Plain text based
- Searchable and portable
- Built with Vite, React, and Mantine
- Includes Excalidraw for drawing

## License

MIT

## Android build (Tauri)

Toolchain: JDK 21, Gradle 8.14.3, AGP 8.13.0, NDK r30 (`30.0.15729638`), Rust with
`aarch64-linux-android` target. Export before building:

```bash
export JAVA_HOME=/usr/lib/jvm/java-21-openjdk-amd64   # adjust to your JDK 21
export ANDROID_HOME=/path/to/android-sdk
export NDK_HOME=$ANDROID_HOME/ndk/30.0.15729638
pnpm tauri android build --apk
```

Do not upgrade to AGP 9.x — Tauri's bundled Gradle modules still apply the
standalone Kotlin plugin and fail under AGP 9's built-in Kotlin (see
`ANDROID_BUILD_FIX_PLAN.md`).
