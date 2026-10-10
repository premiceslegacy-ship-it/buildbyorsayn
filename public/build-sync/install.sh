#!/bin/sh
set -eu

BUILD_SYNC_ORIGIN="${BUILD_SYNC_BASE_URL:-https://build-system-three.vercel.app}"
BUILD_SYNC_DATA_DIR="${XDG_DATA_HOME:-$HOME/.local/share}/build-sync"
BUILD_SYNC_BIN_DIR="$HOME/.local/bin"

echo
echo "BUILD Sync — préparation de l'installation"
echo

if ! command -v node >/dev/null 2>&1; then
  echo "✗ Node.js n'est pas installé." >&2
  echo "  Installe Node.js 20 ou plus récent depuis https://nodejs.org puis relance cette commande." >&2
  exit 1
fi

BUILD_SYNC_NODE_MAJOR="$(node -p 'Number(process.versions.node.split(".")[0])')"
if [ "$BUILD_SYNC_NODE_MAJOR" -lt 20 ]; then
  echo "✗ Ta version de Node.js est trop ancienne (version détectée : $(node -v))." >&2
  echo "  Installe Node.js 20 ou plus récent depuis https://nodejs.org puis relance cette commande." >&2
  exit 1
fi

echo "✓ Node.js $(node -v)"
echo "→ Téléchargement sécurisé de BUILD Sync…"

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

echo "✓ Commande disponible : $BUILD_SYNC_BIN_DIR/build-skills"
