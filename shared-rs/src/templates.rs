// SPDX-License-Identifier: AGPL-3.0-or-later
// Copyright 2026 GhostNet Suite authors

//! Standardized privacy profile templates and modes.
//!
//! Replaces commercial anti-detect spoofing/personas with standardized,
//! consistent privacy profiles as required by the GhostNet Suite specifications.

use serde::{Deserialize, Serialize};
use crate::catalogue;
use crate::overrides::{CanvasMode, MachineOverrides, ScreenOverride};

/// Privacy protection level for a GhostNet profile.
#[derive(Debug, Clone, Copy, PartialEq, Eq, Serialize, Deserialize)]
#[serde(rename_all = "lowercase")]
pub enum PrivacyMode {
    /// Balanced everyday protection, relies on host OS baseline to prevent anti-bot flags.
    Standard,
    /// Enhanced crowd protection, standardized screen/GPU and strict leak prevention.
    Advanced,
    /// Maximum anonymity, strict Tor routing, Browser Kill Switch, and hardened surfaces.
    Maximum,
}

impl PrivacyMode {
    pub fn as_str(&self) -> &'static str {
        match self {
            Self::Standard => "standard",
            Self::Advanced => "advanced",
            Self::Maximum => "maximum",
        }
    }

    pub fn from_str(s: &str) -> Self {
        match s.to_ascii_lowercase().as_str() {
            "advanced" => Self::Advanced,
            "maximum" | "strict" | "tor" => Self::Maximum,
            _ => Self::Standard,
        }
    }
}

/// Profile isolation category.
#[derive(Debug, Clone, Copy, PartialEq, Eq, Serialize, Deserialize)]
#[serde(rename_all = "lowercase")]
pub enum ProfileCategory {
    /// Personal everyday browsing, persistent cookies and sessions.
    Personal,
    /// Work and professional tasks, separated workspace.
    Professional,
    /// Security investigations, privacy audit, OSINT.
    Research,
    /// Ephemeral disposable sessions, completely destroyed upon closing.
    Disposable,
}

impl ProfileCategory {
    pub fn as_str(&self) -> &'static str {
        match self {
            Self::Personal => "personal",
            Self::Professional => "professional",
            Self::Research => "research",
            Self::Disposable => "disposable",
        }
    }

    pub fn from_str(s: &str) -> Self {
        match s.to_ascii_lowercase().as_str() {
            "professional" | "work" => Self::Professional,
            "research" | "osint" => Self::Research,
            "disposable" | "ephemeral" => Self::Disposable,
            _ => Self::Personal,
        }
    }
}

/// A standardized privacy profile template.
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct PrivacyTemplate {
    pub id: String,
    pub name: String,
    pub mode: PrivacyMode,
    pub category: ProfileCategory,
    pub description: String,
    pub persona_id: String,
    pub overrides: MachineOverrides,
    pub default_blocklists: Vec<String>,
    pub allow_no_proxy: bool,
    pub require_tor: bool,
    pub webrtc_policy: String,
    pub is_disposable: bool,
}

/// Get the best standardized persona ID for a given OS and mode.
pub fn recommended_persona_for_os(os: Option<&str>, mode: PrivacyMode) -> String {
    let host = os.or_else(catalogue::host_os).unwrap_or("Windows");
    match (host, mode) {
        ("Linux", _) => "ubuntu24-intel-uhd-1920x1080".to_string(),
        ("macOS", _) => "macos-15-m-series-1728x1117".to_string(),
        _ => match mode {
            PrivacyMode::Standard => "win11-iris-xe-1920x1080".to_string(),
            PrivacyMode::Advanced => "win11-iris-xe-1920x1080".to_string(),
            PrivacyMode::Maximum => "win11-iris-xe-1920x1080".to_string(),
        },
    }
}

/// Built-in GhostNet privacy templates.
pub fn standard_templates(os: Option<&str>) -> Vec<PrivacyTemplate> {
    let host = os.or_else(catalogue::host_os).unwrap_or("Windows");
    let persona_std = recommended_persona_for_os(Some(host), PrivacyMode::Standard);
    let persona_adv = recommended_persona_for_os(Some(host), PrivacyMode::Advanced);
    let persona_max = recommended_persona_for_os(Some(host), PrivacyMode::Maximum);

    vec![
        PrivacyTemplate {
            id: "ghostnet-template-standard".to_string(),
            name: "Standard Protection".to_string(),
            mode: PrivacyMode::Standard,
            category: ProfileCategory::Personal,
            description: "Balanced everyday privacy: native host OS persona, basic canvas noise, direct or proxy network, low anti-bot friction.".to_string(),
            persona_id: persona_std,
            overrides: MachineOverrides {
                canvas: Some(CanvasMode::Noise),
                screen: Some(ScreenOverride {
                    width: 1920,
                    height: 1080,
                    avail_width: 1920,
                    avail_height: 1032,
                    scale_factor: 1.0,
                }),
                ..Default::default()
            },
            default_blocklists: vec!["easylist".to_string(), "easyprivacy".to_string()],
            allow_no_proxy: true,
            require_tor: false,
            webrtc_policy: "default_public_interface_only".to_string(),
            is_disposable: false,
        },
        PrivacyTemplate {
            id: "ghostnet-template-advanced".to_string(),
            name: "Advanced Shield".to_string(),
            mode: PrivacyMode::Advanced,
            category: ProfileCategory::Professional,
            description: "High privacy: normalized 1080p display, proxy with remote DNS leak prevention, anti-tracking blocklists, WebRTC IP masking.".to_string(),
            persona_id: persona_adv,
            overrides: MachineOverrides {
                canvas: Some(CanvasMode::Noise),
                cores: Some(8),
                memory_gb: Some(16),
                screen: Some(ScreenOverride {
                    width: 1920,
                    height: 1080,
                    avail_width: 1920,
                    avail_height: 1032,
                    scale_factor: 1.0,
                }),
                ..Default::default()
            },
            default_blocklists: vec![
                "easylist".to_string(),
                "easyprivacy".to_string(),
                "peter-lowe-adservers".to_string(),
            ],
            allow_no_proxy: false,
            require_tor: false,
            webrtc_policy: "disable_non_proxied_udp".to_string(),
            is_disposable: false,
        },
        PrivacyTemplate {
            id: "ghostnet-template-maximum".to_string(),
            name: "Maximum Anonymity (Tor)".to_string(),
            mode: PrivacyMode::Maximum,
            category: ProfileCategory::Research,
            description: "Hardened anonymity: mandatory Tor network routing, fail-closed kill switch, WebRTC disabled, restricted fonts, maximum tracking protection.".to_string(),
            persona_id: persona_max,
            overrides: MachineOverrides {
                canvas: Some(CanvasMode::Noise),
                cores: Some(8),
                memory_gb: Some(16),
                screen: Some(ScreenOverride {
                    width: 1920,
                    height: 1080,
                    avail_width: 1920,
                    avail_height: 1032,
                    scale_factor: 1.0,
                }),
                fonts_hidden: Some(vec![
                    "Arial Black".to_string(),
                    "Comic Sans MS".to_string(),
                    "Impact".to_string(),
                ]),
                ..Default::default()
            },
            default_blocklists: vec![
                "easylist".to_string(),
                "easyprivacy".to_string(),
                "peter-lowe-adservers".to_string(),
                "fanboy-annoyance".to_string(),
            ],
            allow_no_proxy: false,
            require_tor: true,
            webrtc_policy: "disable".to_string(),
            is_disposable: false,
        },
        PrivacyTemplate {
            id: "ghostnet-template-disposable".to_string(),
            name: "Disposable Session".to_string(),
            mode: PrivacyMode::Advanced,
            category: ProfileCategory::Disposable,
            description: "Ephemeral isolated browsing: creates a temporary workspace that is completely shredded and erased upon closing.".to_string(),
            persona_id: recommended_persona_for_os(Some(host), PrivacyMode::Advanced),
            overrides: MachineOverrides {
                canvas: Some(CanvasMode::Noise),
                screen: Some(ScreenOverride {
                    width: 1920,
                    height: 1080,
                    avail_width: 1920,
                    avail_height: 1032,
                    scale_factor: 1.0,
                }),
                ..Default::default()
            },
            default_blocklists: vec!["easylist".to_string(), "easyprivacy".to_string()],
            allow_no_proxy: true,
            require_tor: false,
            webrtc_policy: "default_public_interface_only".to_string(),
            is_disposable: true,
        },
    ]
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_standard_templates_exist() {
        let tmpls = standard_templates(Some("Linux"));
        assert_eq!(tmpls.len(), 4);
        assert_eq!(tmpls[0].mode, PrivacyMode::Standard);
        assert_eq!(tmpls[1].mode, PrivacyMode::Advanced);
        assert_eq!(tmpls[2].mode, PrivacyMode::Maximum);
        assert!(tmpls[2].require_tor);
        assert!(tmpls[3].is_disposable);
    }
}
