# Frozen React compatibility surface

This directory contains the frozen React/Vite rollback application. It is retained for compatibility and historical comparison while active product development happens in the root KMP/Wasm application under `native/`.

Do not add features, upgrade dependencies, or refactor this surface unless explicitly requested. Its Kotlin/JS core snapshot is vendored at `vendor/todotxt-core/` so the directory remains self-contained.

## Commands

```bash
pnpm install --frozen-lockfile
pnpm run build
pnpm test
pnpm typecheck
```

The root-level `pnpm run build:legacy` command delegates to this directory. If the frozen React surface is retired later, deleting `legacy-react/` and removing that one root compatibility script is the complete removal operation; the KMP/Wasm product does not import from this directory.
