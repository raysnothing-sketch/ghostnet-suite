# GhostNet Suite

**Plateforme intégrée de protection de la confidentialité et de réduction des empreintes numériques.**

GhostNet Suite est une application desktop open source conçue pour protéger la confidentialité des communications et des activités de navigation, standardiser les métadonnées d'empreintes numériques et fournir un audit continu des risques d'exposition.

---

## 🛡️ Fonctionnalités Principales

1. **GhostNet Desktop :**
   - Tableau de bord centralisé avec indice de confidentialité dynamique.
   - Modes de protection adaptatifs : **Standard**, **Advanced**, **Maximum**.
   - Interface moderne construite avec Tauri 2, React 19 et TypeScript.

2. **GhostNet Network :**
   - Routage sécurisé via le réseau **Tor** (support Arti en Rust et daemon Tor système).
   - Relais proxy local *fail-closed* avec prise en charge SOCKS5, SOCKS5h, HTTP et WireGuard.
   - **Browser Kill Switch** de Niveau 1 (interruption immédiate en cas de rupture de proxy).
   - Protection stricte contre les fuites DNS (résolution distante obligatoire) et neutralisation QUIC/UDP.

3. **GhostNet Browser :**
   - Moteur Chromium personnalisé avec patches natifs au niveau C++.
   - **Standardisation des empreintes numériques** (vs manipulation artificielle/spoofing).
   - Filtrage et restriction des canaux WebRTC, Canvas, WebGL, Audio et métadonnées Client Hints.
   - Chiffrement étanche des conteneurs de cookies et profils (`os_crypt_key`).

4. **GhostNet Identity :**
   - Profils de navigation hermétiques et isolés : *Personnel*, *Professionnel*, *Recherche*.
   - Mode **Session Éphémère (Disposable)** sans persistance sur disque.
   - Zéro compte distant requis, architecture 100 % *local-first*, zéro télémétrie.

5. **GhostNet Scanner :**
   - Centre de diagnostic d'exposition en temps réel (IPv4/IPv6, fuites DNS, candidats ICE WebRTC).
   - Vérification de la cohérence des empreintes matérielles et de la liste des traceurs neutralisés.
   - Génération et export de rapports d'audit de sécurité au format JSON.

---

## 🏗️ Architecture & Technologies

| Composant | Technologie |
|---|---|
| Desktop Shell | Tauri 2 (Rust) |
| Interface Utilisateur | React 19, TypeScript, Vite |
| Moteur Système (Agent) | Rust, Tokio, Serde |
| Base de Données Locale | SQLite (`sqlx`) chiffré au repos via trousseau d'accès OS (`keyring`) |
| Navigateur | Chromium C++ personnalisé (Patches natifs) |
| Systèmes d'exploitation cibles | Windows 11 (64-bit) & Ubuntu Linux 24.04+ LTS |

---

## 🚀 Démarrage Rapide

### Prérequis
- [Node.js](https://nodejs.org/) v20+
- [Rust](https://rustup.rs/) v1.80+ (avec cible `x86_64-pc-windows-msvc` sous Windows ou gcc sous Linux)

### Lancer l'interface de développement
```bash
# Aller dans le répertoire desktop
cd desktop

# Installer les dépendances
npm install

# Lancer le serveur Vite de développement
npm run dev

# Tester la compilation TypeScript et le bundle de production
npm run build
```

---

## 📜 Licence & Attribution

* **GhostNet Suite** est distribué sous licence **AGPL-3.0-or-later**.
* Ce projet reprend et fait évoluer des composants techniques issus de [Fury Anti-Detect Browser](https://github.com/furyteamtop/fury-antidetect-browser) (Copyright © 2026 Bogdan Shapovalov et contributeurs Fury), réorientés vers une finalité de Privacy Engineering et de standardisation de la confidentialité.
* Consultez [`THIRD-PARTY-NOTICES.md`](THIRD-PARTY-NOTICES.md) pour le détail des attributions et licences tierces.
