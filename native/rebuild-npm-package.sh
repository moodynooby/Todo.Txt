#!/usr/bin/env bash
# Regenerate native/core/npm-package/ (gitignored) from the Kotlin/JS build.
# The web app (package.json) depends on it as a local file package:
#   "@todotxt/core": "file:../Todo.Txt/native/core/npm-package"
# Usage: cd native && ./rebuild-npm-package.sh
set -euo pipefail

cd "$(dirname "$0")"

./gradlew :core:jsBrowserProductionWebpack --no-daemon --console=plain

SRC=build/js/packages/todotxt-native-core
DST=core/npm-package

rm -rf "$DST"
mkdir -p "$DST"

# core.js requires its stdlib siblings via require('./...'), so flatten
# everything into the package root (self-contained CommonJS bundle).
cp "$SRC/kotlin/todotxt-native-core.js"                     "$DST/core.js"
cp "$SRC/kotlin/kotlin-kotlin-stdlib.js"                    "$DST/"
cp "$SRC/kotlin/kotlinx-serialization-kotlinx-serialization-core.js" "$DST/"
cp "$SRC/kotlin/kotlinx-serialization-kotlinx-serialization-json.js" "$DST/"
cp "$SRC/kotlin/kotlin_org_jetbrains_kotlin_kotlin_dom_api_compat.js"  "$DST/" 2>/dev/null || true

cat > "$DST/package.json" <<'EOF'
{
  "name": "@todotxt/core",
  "version": "1.0.0",
  "description": "Todo.Txt shared core logic compiled from Kotlin to JavaScript",
  "main": "core.js",
  "files": ["core.js", "kotlin-*.js", "kotlinx-*.js"],
  "license": "MIT"
}
EOF

echo "npm-package regenerated at $DST/"
echo "Next: npm install (or pnpm install) at the repo root"
