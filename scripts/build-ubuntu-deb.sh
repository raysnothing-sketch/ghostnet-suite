#!/usr/bin/env bash
# SPDX-License-Identifier: AGPL-3.0-or-later
# Copyright 2026 GhostNet Suite authors
#
# GhostNet Suite — Ubuntu Linux 24.04+ LTS Build & Packaging Script (.deb)

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
REPO_ROOT="$(cd "${SCRIPT_DIR}/.." && pwd)"

echo "=========================================================="
echo "  GhostNet Suite — Packaging Ubuntu Linux 24.04 LTS"
echo "=========================================================="

cd "${REPO_ROOT}"

# 1. Vérification des outils nécessaires
echo "==> [1/5] Vérification des prérequis système..."
for cmd in node npm cargo rustc; do
  if ! command -v "$cmd" >/dev/null 2>&1; then
    echo "ERREUR: Commande introuvable : $cmd"
    echo "Veuillez installer Node.js 18+, npm et le toolchain Rust (rustup)."
    exit 1
  fi
done

echo "Version Rust: $(rustc --version)"
echo "Version Node: $(node --version)"
echo "Version npm:  $(npm --version)"

# 2. Installation des dépendances apt si nécessaire
echo "==> [2/5] Dépendances Ubuntu 24.04 recommandées :"
echo "  sudo apt install -y build-essential libwebkit2gtk-4.1-dev libgtk-3-dev \\"
echo "                      libayatana-appindicator3-dev libsoup-3.0-dev libssl-dev \\"
echo "                      libsecret-1-dev libsqlite3-dev nftables"

# 3. Compilation du backend Rust (agent)
echo "==> [3/5] Compilation de l'agent système GhostNet..."
cargo build --release -p fury-agent

TRIPLE=$(rustc -vV | sed -n 's/^host: //p')
mkdir -p "${REPO_ROOT}/desktop/src-tauri/binaries"
cp -f "${REPO_ROOT}/target/release/fury-agent" \
      "${REPO_ROOT}/desktop/src-tauri/binaries/fury-agent-${TRIPLE}"
chmod +x "${REPO_ROOT}/desktop/src-tauri/binaries/fury-agent-${TRIPLE}"
echo "Sidecar prêt: desktop/src-tauri/binaries/fury-agent-${TRIPLE}"

# 4. Compilation de l'interface React & Vite
echo "==> [4/5] Compilation du frontend desktop..."
cd "${REPO_ROOT}/desktop"
npm install
npm run build

# 5. Création du paquet Debian (.deb) avec Tauri CLI
echo "==> [5/5] Génération du paquet Debian (.deb)..."
npm run tauri build -- --bundles deb

DEB_FILE=$(find "${REPO_ROOT}/target/release/bundle/deb" -name "*.deb" 2>/dev/null | head -n 1 || true)

if [ -n "${DEB_FILE}" ] && [ -f "${DEB_FILE}" ]; then
  echo ""
  echo "=========================================================="
  echo "  SUCCÈS : Paquet Debian généré avec succès !"
  echo "  Chemin : ${DEB_FILE}"
  echo "  Taille : $(du -h "${DEB_FILE}" | cut -f1)"
  echo "=========================================================="
  echo ""
  echo "Pour installer sur Ubuntu 24.04 LTS :"
  echo "  sudo dpkg -i ${DEB_FILE}"
  echo "  sudo apt-get install -f # (si dépendances manquantes)"

echo ""
echo "Pour activer le System Kill Switch nftables sans élévation root :"
echo "  sudo setcap cap_net_admin+ep /usr/bin/ghostnet-agent"
  echo ""
  echo "Pour lancer GhostNet Suite :"
  echo "  ghostnet-desktop"
  echo "=========================================================="
else
  echo "NOTE: Le bundle deb est configuré dans desktop/src-tauri/tauri.conf.json."
fi
