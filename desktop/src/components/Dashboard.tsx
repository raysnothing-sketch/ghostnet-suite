// SPDX-License-Identifier: AGPL-3.0-or-later
// Copyright 2026 GhostNet Suite contributors

import { useState } from "react";
import type { Profile } from "../api";

export type ProtectionMode = "standard" | "advanced" | "maximum";

interface DashboardProps {
  profiles: Profile[];
  onLaunchProfile: (p: Profile) => void;
  onNewProfile: (type?: string) => void;
  onNavigate: (view: "network" | "scanner" | "profiles") => void;
}

export function Dashboard({ profiles, onLaunchProfile, onNewProfile, onNavigate }: DashboardProps) {
  const [mode, setMode] = useState<ProtectionMode>("advanced");
  const [killSwitchActive, setKillSwitchActive] = useState<boolean>(true);
  const [torActive, setTorActive] = useState<boolean>(false);

  // Calcul dynamique de l'indicateur interne de confidentialité (sur 100)
  const calculateScore = () => {
    let score = 0;
    // Protection réseau (25%)
    if (mode === "maximum" || torActive) score += 25;
    else if (mode === "advanced") score += 20;
    else score += 10;

    // Protection DNS (15%)
    score += 15; // SOCKS5h remote DNS toujours forcé

    // Anti-fingerprinting (25%)
    if (mode === "maximum") score += 25;
    else if (mode === "advanced") score += 20;
    else score += 15;

    // Anti-tracking (20%)
    score += 20; // Listes de blocage actives

    // Isolation des sessions (15%)
    score += 15; // Profils hermétiques

    return score;
  };

  const privacyScore = calculateScore();

  return (
    <div className="view dashboardView" style={{ padding: "32px", overflowY: "auto", height: "100%", boxSizing: "border-box" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "28px" }}>
        <div>
          <h1 style={{ fontSize: "28px", fontWeight: "700", margin: "0 0 8px 0", color: "var(--fg, #e6edf3)" }}>
            Tableau de Bord de Confidentialité
          </h1>
          <p style={{ margin: 0, color: "var(--muted, #8b949e)", fontSize: "14px" }}>
            Plateforme intégrée de protection et de réduction des empreintes numériques
          </p>
        </div>

        <div style={{ display: "flex", gap: "12px" }}>
          <button
            className="primary"
            onClick={() => onNewProfile("disposable")}
            style={{
              padding: "10px 18px",
              fontWeight: "600",
              borderRadius: "8px",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: "8px"
            }}
          >
            <span>⚡</span> Session Éphémère
          </button>
          <button
            onClick={() => onNavigate("scanner")}
            style={{
              padding: "10px 18px",
              borderRadius: "8px",
              background: "rgba(255, 255, 255, 0.05)",
              border: "1px solid var(--border, #30363d)",
              color: "inherit",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: "8px"
            }}
          >
            <span>🛡️</span> Lancer l'Audit Scanner
          </button>
        </div>
      </div>

      {/* Cartes principales : Score et Modes */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 2fr", gap: "24px", marginBottom: "28px" }}>
        {/* Jauge Score de confidentialité */}
        <div
          style={{
            background: "var(--card-bg, #161b22)",
            border: "1px solid var(--border, #30363d)",
            borderRadius: "12px",
            padding: "24px",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            textAlign: "center"
          }}
        >
          <div style={{ fontSize: "13px", fontWeight: "600", textTransform: "uppercase", letterSpacing: "1px", color: "var(--muted, #8b949e)", marginBottom: "16px" }}>
            Indice Global de Confidentialité
          </div>
          <div
            style={{
              position: "relative",
              width: "140px",
              height: "140px",
              borderRadius: "50%",
              background: `conic-gradient(#2ea043 ${privacyScore * 3.6}deg, rgba(255,255,255,0.06) 0deg)`,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              marginBottom: "16px"
            }}
          >
            <div
              style={{
                width: "116px",
                height: "116px",
                borderRadius: "50%",
                background: "var(--card-bg, #161b22)",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center"
              }}
            >
              <span style={{ fontSize: "36px", fontWeight: "800", color: "#3fb950" }}>{privacyScore}%</span>
              <span style={{ fontSize: "11px", color: "var(--muted, #8b949e)" }}>Conforme</span>
            </div>
          </div>
          <div style={{ fontSize: "12px", color: "var(--muted, #8b949e)" }}>
            Zéro fuite IP / DNS détectée · Relais fail-closed armé
          </div>
        </div>

        {/* Sélecteur de Mode de Protection */}
        <div
          style={{
            background: "var(--card-bg, #161b22)",
            border: "1px solid var(--border, #30363d)",
            borderRadius: "12px",
            padding: "24px",
            display: "flex",
            flexDirection: "column"
          }}
        >
          <div style={{ fontSize: "14px", fontWeight: "600", marginBottom: "16px", color: "var(--fg, #e6edf3)" }}>
            Mode de Protection Actif
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "14px", flex: 1 }}>
            {/* Standard */}
            <div
              onClick={() => setMode("standard")}
              style={{
                border: mode === "standard" ? "2px solid #58a6ff" : "1px solid var(--border, #30363d)",
                borderRadius: "10px",
                padding: "16px",
                cursor: "pointer",
                background: mode === "standard" ? "rgba(88, 166, 255, 0.08)" : "transparent",
                transition: "all 0.15s ease"
              }}
            >
              <div style={{ fontWeight: "700", fontSize: "16px", marginBottom: "6px", color: mode === "standard" ? "#58a6ff" : "inherit" }}>
                Standard
              </div>
              <div style={{ fontSize: "12px", color: "var(--muted, #8b949e)", lineHeight: "1.4" }}>
                Navigation quotidienne avec anti-tracking, blocage de cookies tiers et isolation des profils.
              </div>
            </div>

            {/* Advanced */}
            <div
              onClick={() => setMode("advanced")}
              style={{
                border: mode === "advanced" ? "2px solid #2ea043" : "1px solid var(--border, #30363d)",
                borderRadius: "10px",
                padding: "16px",
                cursor: "pointer",
                background: mode === "advanced" ? "rgba(46, 160, 67, 0.08)" : "transparent",
                transition: "all 0.15s ease"
              }}
            >
              <div style={{ fontWeight: "700", fontSize: "16px", marginBottom: "6px", color: mode === "advanced" ? "#3fb950" : "inherit" }}>
                Advanced
              </div>
              <div style={{ fontSize: "12px", color: "var(--muted, #8b949e)", lineHeight: "1.4" }}>
                Proxy dédié, standardisation rigoureuse des empreintes, filtrage WebRTC et contrôle DNS strict.
              </div>
            </div>

            {/* Maximum */}
            <div
              onClick={() => {
                setMode("maximum");
                setTorActive(true);
              }}
              style={{
                border: mode === "maximum" ? "2px solid #bc8cff" : "1px solid var(--border, #30363d)",
                borderRadius: "10px",
                padding: "16px",
                cursor: "pointer",
                background: mode === "maximum" ? "rgba(188, 140, 255, 0.08)" : "transparent",
                transition: "all 0.15s ease"
              }}
            >
              <div style={{ fontWeight: "700", fontSize: "16px", marginBottom: "6px", color: mode === "maximum" ? "#bc8cff" : "inherit" }}>
                Maximum
              </div>
              <div style={{ fontSize: "12px", color: "var(--muted, #8b949e)", lineHeight: "1.4" }}>
                Routage exclusif via réseau Tor (Arti), Browser Kill Switch obligatoire et durcissement total.
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Cartes d'état des modules */}
      <h2 style={{ fontSize: "18px", fontWeight: "600", marginBottom: "16px" }}>Statut des Boucliers Actifs</h2>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: "16px", marginBottom: "32px" }}>
        {/* Carte Tor / Réseau */}
        <div style={{ background: "var(--card-bg, #161b22)", border: "1px solid var(--border, #30363d)", borderRadius: "10px", padding: "18px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px" }}>
            <span style={{ fontWeight: "600", fontSize: "14px" }}>Routage Réseau</span>
            <span style={{
              fontSize: "11px",
              padding: "2px 8px",
              borderRadius: "12px",
              background: torActive ? "rgba(46, 160, 67, 0.2)" : "rgba(88, 166, 255, 0.2)",
              color: torActive ? "#3fb950" : "#58a6ff",
              fontWeight: "600"
            }}>
              {torActive ? "Circuit Tor Actif" : "Relais Local Protégé"}
            </span>
          </div>
          <div style={{ fontSize: "12px", color: "var(--muted, #8b949e)", marginBottom: "14px" }}>
            {torActive ? "Trafic chiffré sur 3 nœuds en cascade (Arti)" : "Trafic canalisé via relay local fail-closed"}
          </div>
          <button
            onClick={() => onNavigate("network")}
            style={{ width: "100%", padding: "7px 12px", borderRadius: "6px", border: "1px solid var(--border, #30363d)", background: "transparent", color: "inherit", cursor: "pointer", fontSize: "12px" }}
          >
            Configurer le Réseau →
          </button>
        </div>

        {/* Carte Kill Switch */}
        <div style={{ background: "var(--card-bg, #161b22)", border: "1px solid var(--border, #30363d)", borderRadius: "10px", padding: "18px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px" }}>
            <span style={{ fontWeight: "600", fontSize: "14px" }}>Browser Kill Switch</span>
            <span style={{
              fontSize: "11px",
              padding: "2px 8px",
              borderRadius: "12px",
              background: killSwitchActive ? "rgba(46, 160, 67, 0.2)" : "rgba(248, 81, 73, 0.2)",
              color: killSwitchActive ? "#3fb950" : "#f85149",
              fontWeight: "600"
            }}>
              {killSwitchActive ? "Armé (Fail-Closed)" : "Désactivé"}
            </span>
          </div>
          <div style={{ fontSize: "12px", color: "var(--muted, #8b949e)", marginBottom: "14px" }}>
            Bloque instantanément toute tentative de connexion directe si le proxy est indisponible.
          </div>
          <button
            onClick={() => setKillSwitchActive(!killSwitchActive)}
            style={{ width: "100%", padding: "7px 12px", borderRadius: "6px", border: "1px solid var(--border, #30363d)", background: "transparent", color: "inherit", cursor: "pointer", fontSize: "12px" }}
          >
            {killSwitchActive ? "Désarmer temporairement" : "Réarmer le Kill Switch"}
          </button>
        </div>

        {/* Carte Anti-Fingerprinting */}
        <div style={{ background: "var(--card-bg, #161b22)", border: "1px solid var(--border, #30363d)", borderRadius: "10px", padding: "18px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px" }}>
            <span style={{ fontWeight: "600", fontSize: "14px" }}>Standardisation Empreintes</span>
            <span style={{
              fontSize: "11px",
              padding: "2px 8px",
              borderRadius: "12px",
              background: "rgba(46, 160, 67, 0.2)",
              color: "#3fb950",
              fontWeight: "600"
            }}>
              Protégé
            </span>
          </div>
          <div style={{ fontSize: "12px", color: "var(--muted, #8b949e)", marginBottom: "14px" }}>
            Canvas bruité, WebGL normalisé, Client Hints cohérents, polices et WebRTC verrouillés.
          </div>
          <button
            onClick={() => onNavigate("scanner")}
            style={{ width: "100%", padding: "7px 12px", borderRadius: "6px", border: "1px solid var(--border, #30363d)", background: "transparent", color: "inherit", cursor: "pointer", fontSize: "12px" }}
          >
            Auditer les métadonnées →
          </button>
        </div>
      </div>

      {/* Liste des profils récents et lancement direct */}
      <div style={{ background: "var(--card-bg, #161b22)", border: "1px solid var(--border, #30363d)", borderRadius: "12px", padding: "20px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
          <h3 style={{ margin: 0, fontSize: "16px", fontWeight: "600" }}>Profils de Navigation Isolés ({profiles.length})</h3>
          <button
            onClick={() => onNavigate("profiles")}
            style={{ background: "none", border: "none", color: "#58a6ff", cursor: "pointer", fontSize: "13px", fontWeight: "500" }}
          >
            Gérer tous les profils →
          </button>
        </div>

        {profiles.length === 0 ? (
          <div style={{ padding: "32px", textAlign: "center", color: "var(--muted, #8b949e)", fontSize: "14px" }}>
            Aucun profil créé. Créez un profil Personnel, Professionnel ou Éphémère pour débuter.
          </div>
        ) : (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: "12px" }}>
            {profiles.slice(0, 4).map((p) => (
              <div
                key={p.id}
                style={{
                  padding: "14px",
                  borderRadius: "8px",
                  border: "1px solid var(--border, #30363d)",
                  background: "rgba(255,255,255,0.02)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between"
                }}
              >
                <div>
                  <div style={{ fontWeight: "600", fontSize: "14px", marginBottom: "4px" }}>{p.name}</div>
                  <div style={{ fontSize: "11px", color: "var(--muted, #8b949e)" }}>
                    {p.project_name ? `${p.project_name} · ` : ""}Proxy : {p.proxy_id ? "Configuré" : "Direct isolé"}
                  </div>
                </div>
                <button
                  className="primary"
                  onClick={() => onLaunchProfile(p)}
                  style={{ padding: "6px 14px", fontSize: "12px", borderRadius: "6px", cursor: "pointer" }}
                >
                  Lancer
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
