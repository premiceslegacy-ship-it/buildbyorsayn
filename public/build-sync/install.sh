#!/bin/sh
set -eu

BUILD_SYNC_ORIGIN="${BUILD_SYNC_BASE_URL:-https://build-system-three.vercel.app}"
BUILD_SYNC_DATA_DIR="${XDG_DATA_HOME:-$HOME/.local/share}/build-sync"
BUILD_SYNC_BIN_DIR="$HOME/.local/bin"

echo
echo "BUILD Sync : préparation de l'installation"
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
  printf 'BUILD_SYNC_CLI_PATH="%s" exec "%s" "%s" "$@"\n' "$BUILD_SYNC_DATA_DIR/build.mjs" "$(command -v node)" "$BUILD_SYNC_DATA_DIR/build.mjs"
} > "$BUILD_SYNC_BIN_DIR/build-skills"
chmod 700 "$BUILD_SYNC_BIN_DIR/build-skills"

"$(command -v node)" "$BUILD_SYNC_DATA_DIR/build.mjs" skills setup --base-url="$BUILD_SYNC_ORIGIN" "$@"

echo "✓ Commande disponible : $BUILD_SYNC_BIN_DIR/build-skills"

# La synchronisation automatique utilise le chemin complet ; la commande tapée à la main a besoin du PATH.
# On l'ajoute au profil du shell une seule fois (BUILD_SYNC_NO_PROFILE=1 pour ne pas y toucher).
case ":${PATH:-}:" in
  *":$BUILD_SYNC_BIN_DIR:"*) ;;
  *)
    BUILD_SYNC_PATH_LINE='export PATH="$HOME/.local/bin:$PATH"'
    BUILD_SYNC_SHELL="$(basename "${SHELL:-sh}")"
    case "$BUILD_SYNC_SHELL" in
      zsh) BUILD_SYNC_PROFILE="${ZDOTDIR:-$HOME}/.zshrc" ;;
      bash) if [ "$(uname -s)" = "Darwin" ]; then BUILD_SYNC_PROFILE="$HOME/.bash_profile"; else BUILD_SYNC_PROFILE="$HOME/.bashrc"; fi ;;
      fish) BUILD_SYNC_PROFILE="" ;;
      *) BUILD_SYNC_PROFILE="$HOME/.profile" ;;
    esac
    echo
    if [ "${BUILD_SYNC_NO_PROFILE:-0}" = "1" ]; then
      echo "→ $BUILD_SYNC_BIN_DIR n'est pas dans ton PATH (profil laissé intact, BUILD_SYNC_NO_PROFILE=1)."
    elif [ "$BUILD_SYNC_SHELL" = "fish" ]; then
      if command -v fish >/dev/null 2>&1 && fish -c 'fish_add_path -U $HOME/.local/bin' >/dev/null 2>&1; then
        echo "✓ $BUILD_SYNC_BIN_DIR ajouté au PATH de fish. Ouvre un nouveau terminal pour utiliser build-skills."
      else
        echo "→ Ajoute $BUILD_SYNC_BIN_DIR au PATH avec : fish_add_path \$HOME/.local/bin"
      fi
    elif [ -f "$BUILD_SYNC_PROFILE" ] && grep -Eqs '^[^#]*PATH=.*\.local/bin' "$BUILD_SYNC_PROFILE"; then
      echo "✓ $BUILD_SYNC_PROFILE ajoute déjà $BUILD_SYNC_BIN_DIR au PATH. Ouvre un nouveau terminal pour utiliser build-skills."
    elif { printf '\n# BUILD Sync : commande build-skills\n%s\n' "$BUILD_SYNC_PATH_LINE" >> "$BUILD_SYNC_PROFILE"; } 2>/dev/null; then
      echo "✓ $BUILD_SYNC_BIN_DIR ajouté au PATH dans $BUILD_SYNC_PROFILE. Ouvre un nouveau terminal pour utiliser build-skills."
    else
      echo "→ Impossible d'écrire dans $BUILD_SYNC_PROFILE. Ajoute cette ligne à ton profil : $BUILD_SYNC_PATH_LINE"
    fi
    echo "  Tout de suite, dans ce terminal : $BUILD_SYNC_BIN_DIR/build-skills status"
    ;;
esac
