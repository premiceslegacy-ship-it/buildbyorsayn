#!/bin/sh
set -eu

BUILD_SYNC_ORIGIN="${BUILD_SYNC_BASE_URL:-https://build-system-three.vercel.app}"

# Même règle que build.mjs : HTTPS, ou http local pour le développement. Rien d'autre n'est téléchargé ni exécuté.
case "$BUILD_SYNC_ORIGIN" in
  https://*|http://127.0.0.1|http://127.0.0.1:*|http://localhost|http://localhost:*) ;;
  *)
    echo "✗ BUILD_SYNC_BASE_URL doit commencer par https:// (ou http://127.0.0.1 en développement local)." >&2
    exit 1
    ;;
esac
case "$BUILD_SYNC_ORIGIN" in
  *[!A-Za-z0-9._~:/-]*)
    echo "✗ BUILD_SYNC_BASE_URL contient des caractères non autorisés." >&2
    exit 1
    ;;
esac

# Entoure une valeur de guillemets simples pour qu'un shell la relise telle quelle (une apostrophe devient '\'').
build_sync_quote() {
  printf "'%s'" "$(printf '%s' "$1" | sed "s/'/'\\\\''/g")"
}

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
BUILD_SYNC_PAYLOAD_TMP="$BUILD_SYNC_DATA_DIR/build.mjs.tmp"
BUILD_SYNC_CHECKSUM_TMP="$BUILD_SYNC_DATA_DIR/build.mjs.sha256.tmp"
curl -fsSL --proto-redir "=https" "$BUILD_SYNC_ORIGIN/build-sync/build.mjs" -o "$BUILD_SYNC_PAYLOAD_TMP"
curl -fsSL --proto-redir "=https" "$BUILD_SYNC_ORIGIN/build-sync/build.mjs.sha256" -o "$BUILD_SYNC_CHECKSUM_TMP"
BUILD_SYNC_EXPECTED="$(awk 'NF { print $1; exit }' "$BUILD_SYNC_CHECKSUM_TMP")"
if ! printf '%s\n' "$BUILD_SYNC_EXPECTED" | grep -Eq '^[[:xdigit:]]{64}$'; then
  echo "✗ Le checksum SHA-256 publié est invalide." >&2
  rm -f "$BUILD_SYNC_PAYLOAD_TMP" "$BUILD_SYNC_CHECKSUM_TMP"
  exit 1
fi
if command -v sha256sum >/dev/null 2>&1; then
  BUILD_SYNC_ACTUAL="$(sha256sum "$BUILD_SYNC_PAYLOAD_TMP" | awk '{ print $1 }')"
elif command -v shasum >/dev/null 2>&1; then
  BUILD_SYNC_ACTUAL="$(shasum -a 256 "$BUILD_SYNC_PAYLOAD_TMP" | awk '{ print $1 }')"
else
  echo "✗ Aucun outil SHA-256 disponible (sha256sum ou shasum)." >&2
  rm -f "$BUILD_SYNC_PAYLOAD_TMP" "$BUILD_SYNC_CHECKSUM_TMP"
  exit 1
fi
if [ "$(printf '%s' "$BUILD_SYNC_EXPECTED" | tr '[:upper:]' '[:lower:]')" != "$BUILD_SYNC_ACTUAL" ]; then
  echo "✗ Le checksum SHA-256 de BUILD Sync ne correspond pas au fichier téléchargé." >&2
  rm -f "$BUILD_SYNC_PAYLOAD_TMP" "$BUILD_SYNC_CHECKSUM_TMP"
  exit 1
fi
rm -f "$BUILD_SYNC_CHECKSUM_TMP"
chmod 700 "$BUILD_SYNC_PAYLOAD_TMP"
mv "$BUILD_SYNC_PAYLOAD_TMP" "$BUILD_SYNC_DATA_DIR/build.mjs"

{
  echo '#!/bin/sh'
  printf 'BUILD_SYNC_CLI_PATH=%s exec %s %s "$@"\n' \
    "$(build_sync_quote "$BUILD_SYNC_DATA_DIR/build.mjs")" \
    "$(build_sync_quote "$(command -v node)")" \
    "$(build_sync_quote "$BUILD_SYNC_DATA_DIR/build.mjs")"
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
