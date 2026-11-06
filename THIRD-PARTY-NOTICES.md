# GhostNet Suite — Third-Party Notices & Attribution

This document records the provenance, open-source licenses, and attribution for third-party components reused, adapted, or incorporated into **GhostNet Suite**.

---

## 1. Fury Anti-Detect Browser

* **Source Project:** [fury-antidetect-browser](https://github.com/furyteamtop/fury-antidetect-browser)
* **Copyright:** Copyright © 2026 Bogdan Shapovalov and the Fury authors.
* **License:** GNU Affero General Public License v3.0 or later (AGPL-3.0-or-later).
* **Role in GhostNet:**
  * Core desktop framework (Tauri 2 / React frontend shell).
  * Platform abstraction (`platform-rs`) for Windows and POSIX systems.
  * Local daemon and secure credential vault (`vault.rs`, `store.rs`).
  * Process launcher and local proxy relay (`relay.rs`, `launcher.rs`).
  * Patches applied to Chromium.
* **Modifications:**
  * Rebranded to GhostNet Suite.
  * Replaced commercial anti-detect, persona-spoofing, farming, and warming modules with standardized privacy profiles and local privacy controls.
  * Integrated Tor network routing support and reinforced fail-closed Browser Kill Switch.
  * Added GhostNet Scanner diagnostic engine.
  * Extended cross-platform support for Ubuntu Linux 24.04+ (XDG data dirs, nftables planning).
  * Removed team collaboration server and remote cloud sync mechanisms.

A copy of the AGPL-3.0 license is available in the [LICENSE](file:///C:/Users/raysn/.gemini/antigravity/scratch/fury-antidetect-browser/LICENSE) file.

---

## 2. Chromium & Web Technology Patches

* **Origin:** The Chromium Project (Google LLC and Chromium Authors).
* **License:** BSD 3-Clause License.
* **Patches:** Patches located in `core/patches/` modify WebRTC policies, canvas noise, OS crypt key isolation, and privacy defaults under the terms of the BSD 3-Clause license.

---

## 3. Rust Dependencies

GhostNet Suite relies on several open-source Rust crates:
- **Tokio:** MIT License (Tokio Contributors).
- **Tauri:** MIT / Apache-2.0 License (Tauri Programme within The Commons Conservancy).
- **SQLx:** MIT / Apache-2.0 License (LaunchBadge LLC).
- **Keyring:** MIT / Apache-2.0 License.
- **smoltcp:** 0-clause BSD License.
- **ChaCha20Poly1305 / Argon2:** Apache-2.0 / MIT (RustCrypto).
- **Serde / Serde JSON:** MIT / Apache-2.0 License.

---

## 4. Frontend Dependencies

- **React & React DOM:** MIT License (Meta Platforms, Inc.).
- **Vite:** MIT License (Evan You & Vite Contributors).
- **TypeScript:** Apache-2.0 License (Microsoft Corporation).
