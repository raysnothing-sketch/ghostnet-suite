// SPDX-License-Identifier: AGPL-3.0-or-later
// Copyright 2026 GhostNet Suite contributors

import { useI18n } from "../i18n";
import { useState } from "react";
import type { Me, Project, Shell } from "../api";

export type View =
  | "dashboard"
  | "profiles"
  | "network"
  | "scanner"
  | "proxies"
  | "extensions"
  | "trash"
  | "sharedWithMe"
  | "assistants"
  | "users";

const navLabels: Record<string, string> = {
  dashboard: "Tableau de bord",
  profiles: "Identités & Profils",
  network: "Réseau & Tor",
  scanner: "Scanner & Audit",
  proxies: "Proxies & Relais",
  extensions: "Extensions",
  trash: "Corbeille",
  sharedWithMe: "Partagés avec moi",
  assistants: "Assistants IA",
  users: "Utilisateurs",
};

const navIcons: Record<string, string> = {
  dashboard: "📊",
  profiles: "👤",
  network: "🧅",
  scanner: "🛡️",
  proxies: "🌐",
  extensions: "🧩",
  trash: "🗑️",
};

export function Sidebar({
  projects,
  active,
  shell,
  me,
  onSelect,
  onNewProject,
  onSendProject,
  onShareProject,
  onRenameProject,
  onDeleteProject,
  onNewProfile,
  view,
  onView,
  onSettings,
}: {
  projects: Project[];
  active: Project | null;
  shell: Shell;
  me: Me | null;
  onSelect: (p: Project | null) => void;
  onNewProject: (origin: "local" | "team") => void;
  /** Copy every profile in a local folder onto the server, into a project of
   *  the same name. */
  onSendProject: (p: Project) => void;
  /** Give every profile currently in a server project to somebody. */
  onShareProject: (p: Project) => void;
  onRenameProject: (p: Project) => void;
  onDeleteProject: (p: Project) => void;
  view: View;
  onView: (v: View) => void;
  onNewProfile: () => void;
  onSettings: () => void;
}) {
  const { t } = useI18n();
  const local = shell.mode === "local";
  const [menu, setMenu] = useState<string | null>(null);

  const mainNav = ["dashboard", "profiles", "network", "scanner", "proxies", "extensions", "trash"] as const;

  return (
    <aside className="sidebar">
      <div className="brand" style={{ fontWeight: 800, letterSpacing: "-0.5px", fontSize: "18px", color: "var(--fg, #e6edf3)" }}>
        GhostNet Suite
      </div>

      <button className="primary newProfile" onClick={onNewProfile}>
        {t("bar.newProfile")}
      </button>

      <nav>
        {mainNav.map((v) => (
          <button
            key={v}
            className={view === v && !(v === "profiles" && active) ? "nav active" : "nav"}
            onClick={() => {
              if (v === "profiles") onSelect(null);
              onView(v);
            }}
            style={{ display: "flex", alignItems: "center", gap: "10px" }}
          >
            <span>{navIcons[v]}</span>
            <span>{navLabels[v] ?? t(`nav.${v}` as never)}</span>
          </button>
        ))}

        <div className="groupHeader">
          <span>{t("app.projects")}</span>
          <button
            className="iconBtn small"
            onClick={() => onNewProject("local")}
            title={t("app.newProject")}
            aria-label={t("app.newProject")}
          >
            +
          </button>
        </div>

        <div className="projects">
          {projects.map((p) => (
            <div key={p.id} className="projectRow">
              <button
                className={view === "profiles" && active?.id === p.id ? "project active" : "project"}
                onClick={() => {
                  onSelect(p);
                  onView("profiles");
                }}
              >
                <span className="ellipsis">{p.name}</span>
                <span className="count">{p.profile_count}</span>
              </button>
              <button
                className="iconBtn small more"
                onClick={(e) => {
                  e.stopPropagation();
                  setMenu(menu === p.id ? null : p.id);
                }}
                aria-label="Options"
              >
                ···
              </button>
              {menu === p.id && (
                <div className="projectMenu" onMouseLeave={() => setMenu(null)}>
                  <button
                    onClick={() => {
                      setMenu(null);
                      onRenameProject(p);
                    }}
                  >
                    {t("proj.rename")}
                  </button>
                  <button
                    className="danger"
                    onClick={() => {
                      setMenu(null);
                      onDeleteProject(p);
                    }}
                  >
                    {t("proj.delete")}
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      </nav>

      <div className="foot">
        {me && <div className="who ellipsis">{me.email}</div>}
        <div className="muted small ellipsis" title={shell.server_url ?? ""}>
          {local ? t("app.workingLocally") : shell.server_url}
        </div>
        <div className="footRow">
          <div className="muted small ellipsis" title={shell.machine_name}>
            {shell.machine_name}
            {!shell.native && ` · ${t("app.browserDev")}`}
          </div>
          <button
            className="iconBtn"
            onClick={onSettings}
            title={t("app.settings")}
            aria-label={t("app.settings")}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <circle cx="12" cy="12" r="3.2" stroke="currentColor" strokeWidth="1.6" />
              <path
                d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 1 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 1 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.6a1.65 1.65 0 0 0 1-1.51V3a2 2 0 1 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9v0a1.65 1.65 0 0 0 1.51 1H21a2 2 0 1 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        </div>
      </div>
    </aside>
  );
}
