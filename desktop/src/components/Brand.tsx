// SPDX-License-Identifier: AGPL-3.0-or-later
// Copyright 2026 GhostNet Suite contributors

import { useI18n } from "../i18n";

/** The name at the top of every screen before signing in, with the version
 *  under it. */
export function Brand({ version }: { version?: string }) {
  const { t } = useI18n();
  return (
    <>
      <h1>GhostNet Suite</h1>
      {version && <p className="loginVersion">{t("auth.version", { version })}</p>}
    </>
  );
}
