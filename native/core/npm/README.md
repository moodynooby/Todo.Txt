# todotxt-core

The language-agnostic core of **Todo.Txt**, compiled from a single Kotlin
Multiplatform module (JVM + JS targets) so the **Kotlin Compose native app**
and the **TypeScript web app** run the exact same todo.txt parser, domain
types, and habit math.

## Contents

| Export | What it is |
|--------|-----------|
| `core.$_$.e()` | `TodoParser` object — `parseTodoLine`, `parseTodoContent`, `setLineCompleted`, `today`/`tomorrow`/`yesterday` |
| `core.$_$.d()` | `HabitUtils` object — `getHabitStreak`, `getBestStreak`, `getCompletionRate`, `getMomentum`, `getHeatmap`, `toggleDate`, `getLastDays`, `formatLocalDate` |
| `core.$_$.a` | `Habit` data class constructor |
| `core.$_$.b` | `addDaysString(date, days)` free function |

## Usage

The bundle is a universal module: CommonJS (`require`/`module.exports`), AMD,
or browser global (`window.todotxtCore`). In an ESM project where the file is
loaded as a module, import it once and read the global:

```ts
import "todotxt-core";
const core = globalThis.todotxtCore!;

const parser = core.$_$.e(); // TodoParser
const parsed = parser.parseTodoLine_q1yik5_k$("(A) Buy milk +shopping @grocery due:2026-08-20");

const habits = core.$_$.d(); // HabitUtils
const streak = habits.getHabitStreak_ds8es7_k$(habit);
```

Member names are Kotlin/JS-IR mangled (e.g. `parseTodoLine_q1yik5_k$`) because
the package ships the IR compiler's development output for small size and tree
friendliness. Stable symbol roots (`$_$.a..e`) are documented in
`index.d.ts`. A thin TypeScript wrapper in the web app (`src/lib/todoTxtCore.ts`)
hides the mangling.

## Building

```bash
cd ~/Todo.Txt/native
./gradlew :core:compileTestDevelopmentExecutableKotlinJs
node ~/core-npm-bundle/build-package.cjs   # writes native/core/npm/dist/todotxt-core.js
```

Tests: `./gradlew :core:jsBrowserTest` (ChromeHeadless) and `:core:jvmTest`.
