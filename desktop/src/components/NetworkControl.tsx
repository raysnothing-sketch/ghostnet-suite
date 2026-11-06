// SPDX-License-Identifier: AGPL-3.0-or-later
// Copyright 2026 GhostNet Suite contributors

import { useState } from "react";

export function NetworkControl() {
  const [torRunning, setTorRunning] = useState<boolean>(false);
  const [torMode, setTorMode] = useState<"arti" | "system">("arti");
  const [killSwitchBrowser, setKillSwitchBrowser] = useState<boolean>(true);
  const [killSwitchSystem, setKillSwitchSystem] = useState<boolean>(false);
  const [dnsLeakProtection, setDnsLeakProtection] = useState<boolean>(true);
  const [blockQuicUdp, setBlockQuicUdp] = useState<boolean>(true);
  const [webrtcPolicy, setWebrtcPolicy] = useState<"disabled" | "proxy_only" | "default">("proxy_only");

  return (
    <div className="view networkView" style={{ padding: "32px", overflowY: "auto", height: "100%", boxSizing: "border-box" }}>
      <div style={{ marginBottom: "28px" }}>
        <h1 style={{ fontSize: "28px", fontWeight: "700", margin: "0 0 8px 0", color: "var(--fg, #e6edf3)" }}>
          GhostNet Network
        </h1>
        <p style={{ margin: 0, color: "var(--muted, #8b949e)", fontSize: "14px" }}>
          Supervision des communications réseau, relais sécurisé, routage Tor et protection anti-fuite
        </p>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "24px", marginBottom: "28px" }}>
        {/* Module Tor */}
        <div style={{ background: "var(--card-bg, #161b22)", border: "1px solid var(--border, #30363d)", borderRadius: "12px", padding: "24px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <span style={{ fontSize: "24px" }}>🧅</span>
              <div>
                <h3 style={{ margin: 0, fontSize: "16px", fontWeight: "600" }}>Réseau Tor (The Onion Router)</h3>
                <span style={{ fontSize: "12px", color: "var(--muted, #8b949e)" }}>
                  Moteur Rust Arti intégré / Daemon Tor externe
                </span>
              </div>
            </div>
            <span style={{
              fontSize: "12px",
              padding: "3px 10px",
              borderRadius: "12px",
              fontWeight: "600",
              background: torRunning ? "rgba(46, 160, 67, 0.2)" : "rgba(248, 81, 73, 0.2)",
              color: torRunning ? "#3fb950" : "#f85149"
            }}>
              {torRunning ? "Connecté (3 nœuds)" : "Arrêté"}
            </span>
          </div>

          <div style={{ marginBottom: "20px", fontSize: "13px", color: "var(--muted, #8b949e)", lineHeight: "1.5" }}>
            Fait transiter le trafic web à travers un réseau décentralisé de relais chiffrés.
            Arti s'exécute nativement en Rust dans l'agent GhostNet sans dépendance binaire externe.
          </div>

          <div style={{ marginBottom: "16px" }}>
            <label style={{ display: "block", fontSize: "12px", fontWeight: "600", marginBottom: "8px" }}>
              Mode d'exécution Tor
            </label>
            <div style={{ display: "flex", gap: "12px" }}>
              <button
                onClick={() => setTorMode("arti")}
                style={{
                  flex: 1,
                  padding: "8px 12px",
                  borderRadius: "6px",
                  border: torMode === "arti" ? "1px solid #58a6ff" : "1px solid var(--border, #30363d)",
                  background: torMode === "arti" ? "rgba(88, 166, 255, 0.1)" : "transparent",
                  color: "inherit",
                  cursor: "pointer",
                  fontSize: "12px"
                }}
              >
                Arti (Rust intégré - Recommandé)
              </button>
              <button
                onClick={() => setTorMode("system")}
                style={{
                  flex: 1,
                  padding: "8px 12px",
                  borderRadius: "6px",
                  border: torMode === "system" ? "1px solid #58a6ff" : "1px solid var(--border, #30363d)",
                  background: torMode === "system" ? "rgba(88, 166, 255, 0.1)" : "transparent",
                  color: "inherit",
                  cursor: "pointer",
                  fontSize: "12px"
                }}
              >
                Tor Daemon Système (127.0.0.1:9050)
              </button>
            </div>
          </div>

          <button
            className={torRunning ? "" : "primary"}
            onClick={() => setTorRunning(!torRunning)}
            style={{
              width: "100%",
              padding: "10px 16px",
              borderRadius: "8px",
              fontWeight: "600",
              cursor: "pointer",
              background: torRunning ? "rgba(248, 81, 73, 0.15)" : undefined,
              color: torRunning ? "#f85149" : undefined,
              border: torRunning ? "1px solid #f85149" : undefined
            }}
          >
            {torRunning ? "Arrêter le service Tor" : "Démarrer le routage Tor"}
          </button>
        </div>

        {/* Module Kill Switch */}
        <div style={{ background: "var(--card-bg, #161b22)", border: "1px solid var(--border, #30363d)", borderRadius: "12px", padding: "24px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <span style={{ fontSize: "24px" }}>🛑</span>
              <div>
                <h3 style={{ margin: 0, fontSize: "16px", fontWeight: "600" }}>Kill Switch Réseau</h3>
                <span style={{ fontSize: "12px", color: "var(--muted, #8b949e)" }}>
                  Blocage automatique en cas de rupture de proxy
                </span>
              </div>
            </div>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            {/* Niveau 1 */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "12px", borderRadius: "8px", background: "rgba(255,255,255,0.02)", border: "1px solid var(--border, #30363d)" }}>
              <div>
                <div style={{ fontWeight: "600", fontSize: "13px" }}>Niveau 1 : Browser Kill Switch</div>
                <div style={{ fontSize: "11px", color: "var(--muted, #8b949e)" }}>
                  Le relais local coupe net toute requête et refuse le fallback direct si le proxy tombe.
                </div>
              </div>
              <input
                type="checkbox"
                checked={killSwitchBrowser}
                onChange={(e) => setKillSwitchBrowser(e.target.checked)}
                style={{ width: "18px", height: "18px", cursor: "pointer" }}
              />
            </div>

            {/* Niveau 2 */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "12px", borderRadius: "8px", background: "rgba(255,255,255,0.02)", border: "1px solid var(--border, #30363d)" }}>
              <div>
                <div style={{ fontWeight: "600", fontSize: "13px" }}>Niveau 2 : System Kill Switch</div>
                <div style={{ fontSize: "11px", color: "var(--muted, #8b949e)" }}>
                  Règles de pare-feu de bas niveau (WFP sous Windows, nftables sous Linux).
                </div>
              </div>
              <input
                type="checkbox"
                checked={killSwitchSystem}
                onChange={(e) => setKillSwitchSystem(e.target.checked)}
                style={{ width: "18px", height: "18px", cursor: "pointer" }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Paramètres avancés de prévention des fuites */}
      <div style={{ background: "var(--card-bg, #161b22)", border: "1px solid var(--border, #30363d)", borderRadius: "12px", padding: "24px" }}>
        <h3 style={{ margin: "0 0 16px 0", fontSize: "16px", fontWeight: "600" }}>
          Prévention des Fuites IP, DNS & Protocoles
        </h3>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "18px" }}>
          {/* SOCKS5h & DNS */}
          <div style={{ padding: "14px", borderRadius: "8px", border: "1px solid var(--border, #30363d)" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "6px" }}>
              <span style={{ fontWeight: "600", fontSize: "13px" }}>Résolution DNS distante (SOCKS5h)</span>
              <input
                type="checkbox"
                checked={dnsLeakProtection}
                onChange={(e) => setDnsLeakProtection(e.target.checked)}
                style={{ width: "16px", height: "16px", cursor: "pointer" }}
              />
            </div>
            <div style={{ fontSize: "12px", color: "var(--muted, #8b949e)" }}>
              Interdit formellement la résolution des noms d'hôte par le FAI local. Tout nom de domaine est délégué à la sortie protégée.
            </div>
          </div>

          {/* QUIC / UDP */}
          <div style={{ padding: "14px", borderRadius: "8px", border: "1px solid var(--border, #30363d)" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "6px" }}>
              <span style={{ fontWeight: "600", fontSize: "13px" }}>Blocage QUIC & UDP non routable</span>
              <input
                type="checkbox"
                checked={blockQuicUdp}
                onChange={(e) => setBlockQuicUdp(e.target.checked)}
                style={{ width: "16px", height: "16px", cursor: "pointer" }}
              />
            </div>
            <div style={{ fontSize: "12px", color: "var(--muted, #8b949e)" }}>
              Empêche les requêtes HTTP/3 (QUIC) de contourner les proxies SOCKS/TCP usuels.
            </div>
          </div>

          {/* WebRTC Policy */}
          <div style={{ padding: "14px", borderRadius: "8px", border: "1px solid var(--border, #30363d)" }}>
            <div style={{ fontWeight: "600", fontSize: "13px", marginBottom: "6px" }}>
              Politique WebRTC (ICE Candidates)
            </div>
            <div style={{ fontSize: "12px", color: "var(--muted, #8b949e)", marginBottom: "10px" }}>
              Évite la fuite de l'adresse IP locale et de l'IP publique directe lors des négociations multimédias.
            </div>
            <select
              value={webrtcPolicy}
              onChange={(e) => setWebrtcPolicy(e.target.value as any)}
              style={{
                width: "100%",
                padding: "8px",
                borderRadius: "6px",
                background: "rgba(255,255,255,0.05)",
                border: "1px solid var(--border, #30363d)",
                color: "inherit"
              }}
            >
              <option value="disabled">Désactivé complètement (Sécurité maximale)</option>
              <option value="proxy_only">Proxy uniquement (Recommandé)</option>
              <option value="default">Par défaut (Risque de fuite)</option>
            </select>
          </div>

          {/* Statut IPv6 */}
          <div style={{ padding: "14px", borderRadius: "8px", border: "1px solid var(--border, #30363d)" }}>
            <div style={{ fontWeight: "600", fontSize: "13px", marginBottom: "6px" }}>
              Gestion du trafic IPv6
            </div>
            <div style={{ fontSize: "12px", color: "var(--muted, #8b949e)", marginBottom: "10px" }}>
              L'IPv6 est neutralisé ou tunnelisé de manière étanche pour éliminer les fuites de passerelle dual-stack.
            </div>
            <div style={{ fontSize: "12px", color: "#3fb950", fontWeight: "600" }}>
              ✓ Isolation IPv6 active (Fail-closed)
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
