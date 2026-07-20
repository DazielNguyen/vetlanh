"use client";

import CompanionCharacter, { type CompanionState } from "@/components/illustrations/CompanionCharacter";
import { CompanionErrorBoundary } from "@/components/illustrations/CompanionErrorBoundary";
import { env } from "@/lib/env";

interface SafeCompanionProps {
  state?: CompanionState;
  className?: string;
}

/**
 * The one mount point every surface (dashboard, chat) should use instead of
 * CompanionCharacter directly — respects the app-wide disable flag and
 * isolates render errors so the mascot can never break its host page.
 */
export function SafeCompanion({ state, className }: SafeCompanionProps) {
  if (!env.enableCompanion) return null;

  return (
    <CompanionErrorBoundary>
      <CompanionCharacter state={state} className={className} />
    </CompanionErrorBoundary>
  );
}
