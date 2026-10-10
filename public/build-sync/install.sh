#!/bin/sh
set -eu

BUILD_SYNC_ORIGIN="${BUILD_SYNC_BASE_URL:-https://build-system-three.vercel.app}"
BUILD_SYNC_DATA_DIR="${XDG_DATA_HOME:-$HOME/.local/share}/build-sync"
BUILD_SYNC_BIN_DIR="$HOME/.local/bin"

if ! command -v node >/dev/null 2>&1; then
  echo "BUILD Sync nécessite Node.js 20 ou plus récent." >&2
  exit 1
fi

BUILD_SYNC_NODE_MAJOR="$(node -p 'Number(process.versions.node.split(".")[0])')"
if [ "$BUILD_SYNC_NODE_MAJOR" -lt 20 ]; then
  echo "BUILD Sync nécessite Node.js 20 ou plus récent." >&2
  exit 1
fi

mkdir -p "$BUILD_SYNC_DATA_DIR" "$BUILD_SYNC_BIN_DIR"
curl -fsSL "$BUILD_SYNC_ORIGIN/build-sync/build.mjs" -o "$BUILD_SYNC_DATA_DIR/build.mjs.tmp"
chmod 700 "$BUILD_SYNC_DATA_DIR/build.mjs.tmp"
mv "$BUILD_SYNC_DATA_DIR/build.mjs.tmp" "$BUILD_SYNC_DATA_DIR/build.mjs"

{
  echo '#!/bin/sh'
  printf 'exec "%s" "%s" "$@"\n' "$(command -v node)" "$BUILD_SYNC_DATA_DIR/build.mjs"
} > "$BUILD_SYNC_BIN_DIR/build-skills"
chmod 700 "$BUILD_SYNC_BIN_DIR/build-skills"

"$(command -v node)" "$BUILD_SYNC_DATA_DIR/build.mjs" skills setup --base-url="$BUILD_SYNC_ORIGIN" "$@"

echo "BUILD Sync est installé. Commande disponible : $BUILD_SYNC_BIN_DIR/build-skills"
