# Guide de Déploiement et d'Utilisation : Ubuntu Linux 24.04+ LTS

Ce document décrit les spécificités, prérequis et étapes de compilation et d'exécution de **GhostNet Suite** sous **Ubuntu 24.04 LTS (Noble Numbat)** et distributions Linux compatibles.

---

## 1. Architecture et Spécificités Linux

GhostNet Suite est nativement conçu pour l'environnement moderne d'Ubuntu 24.04+ LTS :

* **Affichage :** Support de **Wayland** par défaut et **X11 / XWayland**. Le rendu graphique s'appuie sur WebKit2GTK 4.1 et ANGLE Mesa (OpenGL 4.6).
* **Conformité XDG Base Directory Specification :**
  * Données persistantes : `$XDG_DATA_HOME/ghostnet` (par défaut `~/.local/share/ghostnet`)
  * Configuration : `$XDG_CONFIG_HOME/ghostnet` (par défaut `~/.config/ghostnet`)
  * Cache : `$XDG_CACHE_HOME/ghostnet` (par défaut `~/.cache/ghostnet`)
  * Runtime Sockets : `$XDG_RUNTIME_DIR/ghostnet` (par défaut `/run/user/$UID/ghostnet`) avec permissions strictes `0700`.
* **Pare-feu & Kill Switch Système :**
  * Utilisation prioritaire de `nftables` (moteur de filtrage natif sous Ubuntu 24.04).
  * Repli transparent vers `iptables` si `nft` n'est pas disponible.
  * Politique fail-closed bloquant toute fuite en clair hors de la boucle locale `lo` et du port SOCKS5 / Tor (`9050`).
* **Gestion des Clés :** Intégration avec `libsecret` (FreeDesktop Secret Service / GNOME Keyring) pour sceller les coffres et clés sans invite superutilisateur intrusive.

---

## 2. Prérequis Système

Pour compiler et exécuter GhostNet Suite sur Ubuntu 24.04 LTS :

```bash
# Mise à jour des dépôts
sudo apt update

# Outils de build et bibliothèques C/GTK nécessaires
sudo apt install -y \
  build-essential \
  curl \
  wget \
  file \
  libssl-dev \
  libgtk-3-dev \
  libwebkit2gtk-4.1-dev \
  libayatana-appindicator3-dev \
  librsvg2-dev \
  libsoup-3.0-dev \
  libsecret-1-dev \
  libsqlite3-dev \
  nftables \
  iptables

# Installation de Node.js (version 20+ recommandée)
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs

# Installation de Rust (toolchain stable)
curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh -s -- -y
source "$HOME/.cargo/env"
```

---

## 3. Génération du Paquet Debian (`.deb`)

Le script automatisé [`scripts/build-ubuntu-deb.sh`](../scripts/build-ubuntu-deb.sh) permet de construire l'application et de générer le paquet Debian d'installation :

```bash
chmod +x scripts/build-ubuntu-deb.sh
./scripts/build-ubuntu-deb.sh
```

Le paquet est généré dans le répertoire :
```
target/release/bundle/deb/ghostnet-desktop_0.1.0_amd64.deb
```

---

## 4. Installation sur Ubuntu 24.04 LTS

Pour installer le paquet produit :

```bash
sudo dpkg -i target/release/bundle/deb/ghostnet-desktop_0.1.0_amd64.deb

# Si des dépendances sont manquantes :
sudo apt-get install -f
```

L'application s'enregistre automatiquement dans le menu des applications GNOME (`GhostNet Suite`) et expose les actions rapides du lanceur :
* *Lancer GhostNet Suite*
* *Nouvelle session jetable (Disposable)*
* *Nouvelle session Tor (Maximum)*

---

## 5. Exécution et Dépannage

### Lancement en ligne de commande :
```bash
ghostnet-desktop
```

### Vérification des permissions du Kill Switch :
Si le System Kill Switch est activé dans l'interface Réseau, le processus peut nécessiter l'autorisation de manipuler les tables de filtrage :
```bash
# Autoriser le binaire agent à configurer nftables sans mot de passe root complet :
sudo setcap cap_net_admin,cap_net_raw+ep /usr/bin/ghostnet-agent
# Ou pour lien symbolique rétrocompatible :
# sudo setcap cap_net_admin,cap_net_raw+ep /usr/bin/fury-agent
```

### Emplacement des journaux :
Les logs de diagnostic sont consultables en continu :
```bash
tail -f ~/.local/share/ghostnet/agent.log
```
