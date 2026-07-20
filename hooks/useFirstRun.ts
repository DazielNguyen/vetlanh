"use client";

import { useEffect, useState } from "react";
import { useBadgesData } from "@/hooks/useBadges";

const DISMISSED_KEY = "vetlanh_onboarding_dismissed";

/**
 * First-run detection for the onboarding intro. Gated on the user's
 * server-authoritative level/xp (level 1, 0 xp = never earned anything yet)
 * rather than a client-only "have I seen this" flag, so a returning user on
 * a new device/browser doesn't get re-onboarded — see the Risk mitigation in
 * phase-03-companion-integration-onboarding.md. A local dismiss flag only
 * controls "don't show again after the user closed it this run."
 */
export function useFirstRun() {
  const { level, xp, isLoading } = useBadgesData();
  const [dismissed, setDismissed] = useState(true);

  useEffect(() => {
    setDismissed(localStorage.getItem(DISMISSED_KEY) === "true");
  }, []);

  const isFirstRun = !isLoading && level === 1 && xp === 0 && !dismissed;

  function dismiss() {
    localStorage.setItem(DISMISSED_KEY, "true");
    setDismissed(true);
  }

  return { isFirstRun, dismiss };
}
