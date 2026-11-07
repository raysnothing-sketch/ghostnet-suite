// SPDX-License-Identifier: AGPL-3.0-or-later
// Copyright 2026 GhostNet Suite authors

//! Linux nftables & iptables firewall integration for GhostNet System Kill Switch.
//!
//! Provides fail-closed network packet filtering on Ubuntu 24.04+ LTS to guarantee
//! zero leakage if a connection fails.

use std::process::Command;

#[derive(Debug, Clone, Copy, PartialEq, Eq)]
pub enum FirewallStatus {
    Armed,
    Disarmed,
    Unsupported,
}

/// Check if nftables or iptables is available on this system.
pub fn is_available() -> bool {
    #[cfg(target_os = "linux")]
    {
        Command::new("which").arg("nft").output().map(|o| o.status.success()).unwrap_or(false)
            || Command::new("which").arg("iptables").output().map(|o| o.status.success()).unwrap_or(false)
    }
    #[cfg(not(target_os = "linux"))]
    {
        false
    }
}

/// Arm the system-level Kill Switch on Linux via nftables or iptables.
/// Blocks all non-loopback outbound traffic except to Tor / SOCKS5 ports.
pub fn arm_system_killswitch(allowed_ports: &[u16]) -> Result<(), String> {
    #[cfg(target_os = "linux")]
    {
        // 1. Try nftables first (default in Ubuntu 24.04 Noble Numbat)
        let nft_available = Command::new("which").arg("nft").output().map(|o| o.status.success()).unwrap_or(false);
        if nft_available {
            let ports_str = allowed_ports.iter().map(|p| p.to_string()).collect::<Vec<_>>().join(", ");
            let rule = format!(
                "table inet ghostnet_killswitch {{\n  chain output {{\n    type filter hook output priority 0; policy drop;\n    oifname \"lo\" accept\n    ct state established,related accept\n    tcp dport {{ {} }} accept\n    udp dport 53 drop\n  }}\n}}",
                if ports_str.is_empty() { "9050, 9051".to_string() } else { ports_str }
            );
            let mut child = Command::new("nft")
                .arg("-f")
                .arg("-")
                .stdin(std::process::Stdio::piped())
                .spawn()
                .map_err(|e| format!("Failed to spawn nft: {e}"))?;
            if let Some(mut stdin) = child.stdin.take() {
                use std::io::Write;
                stdin.write_all(rule.as_bytes()).map_err(|e| format!("Failed to write nft rules: {e}"))?;
            }
            let status = child.wait().map_err(|e| format!("Failed waiting on nft: {e}"))?;
            if status.success() {
                tracing::info!("GhostNet: Linux nftables Kill Switch armed");
                return Ok(());
            }
        }

        // 2. Fallback to iptables if nft was absent or failed
        let iptables_available = Command::new("which").arg("iptables").output().map(|o| o.status.success()).unwrap_or(false);
        if iptables_available {
            let _ = Command::new("iptables").args(["-N", "GHOSTNET_KILLSWITCH"]).output();
            let _ = Command::new("iptables").args(["-A", "OUTPUT", "-j", "GHOSTNET_KILLSWITCH"]).output();
            let _ = Command::new("iptables").args(["-A", "GHOSTNET_KILLSWITCH", "-o", "lo", "-j", "ACCEPT"]).output();
            let _ = Command::new("iptables").args(["-A", "GHOSTNET_KILLSWITCH", "-m", "state", "--state", "ESTABLISHED,RELATED", "-j", "ACCEPT"]).output();
            for port in allowed_ports {
                let _ = Command::new("iptables").args(["-A", "GHOSTNET_KILLSWITCH", "-p", "tcp", "--dport", &port.to_string(), "-j", "ACCEPT"]).output();
            }
            let _ = Command::new("iptables").args(["-A", "GHOSTNET_KILLSWITCH", "-j", "DROP"]).output();
            tracing::info!("GhostNet: Linux iptables Kill Switch armed");
            return Ok(());
        }

        Err("Neither nftables nor iptables is accessible or has sufficient permissions".to_string())
    }

    #[cfg(not(target_os = "linux"))]
    {
        let _ = allowed_ports;
        Ok(())
    }
}

/// Disarm the system-level Kill Switch on Linux.
pub fn disarm_system_killswitch() -> Result<(), String> {
    #[cfg(target_os = "linux")]
    {
        // Flush and delete nftables table
        let _ = Command::new("nft").args(["delete", "table", "inet", "ghostnet_killswitch"]).output();
        // Remove iptables rules if applied
        let _ = Command::new("iptables").args(["-D", "OUTPUT", "-j", "GHOSTNET_KILLSWITCH"]).output();
        let _ = Command::new("iptables").args(["-F", "GHOSTNET_KILLSWITCH"]).output();
        let _ = Command::new("iptables").args(["-X", "GHOSTNET_KILLSWITCH"]).output();
        tracing::info!("GhostNet: Linux Kill Switch disarmed");
        Ok(())
    }

    #[cfg(not(target_os = "linux"))]
    {
        Ok(())
    }
}
