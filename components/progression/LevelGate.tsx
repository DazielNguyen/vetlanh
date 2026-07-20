"use client";

import React from "react";
import { cn } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";
import { useBadgesData } from "@/hooks/useBadges";

interface LevelGateProps {
  /** Level required to reveal `children`. */
  requiredLevel: number;
  /** The single feature this gate protects. Never wrap Thought Records,
   * Safety Plan, or PHQ-9 in this component — they are safety-exempt and
   * must stay reachable via SupportToolsEntryPoint regardless of level. */
  children: React.ReactNode;
  className?: string;
}

/**
 * Level-gated content wrapper. Visually mirrors ProContentGate's
 * blur+gradient-fade+CTA shape, but checks the user's level instead of
 * subscription tier, and uses a distinct "Cấp N" badge/color so it can
 * never be confused with the "PRO" gate.
 */
export function LevelGate({ requiredLevel, children, className }: LevelGateProps) {
  const { level, isLoading } = useBadgesData();

  if (isLoading) {
    return <Skeleton className={cn("rounded-2xl h-32", className)} />;
  }

  if (level >= requiredLevel) {
    return <>{children}</>;
  }

  return (
    <div className={cn("relative", className)}>
      <div className="pointer-events-none select-none blur-sm opacity-50" aria-hidden="true">
        {children}
      </div>

      <div className="absolute inset-0 bg-linear-to-b from-transparent via-background/70 to-background pointer-events-none" />

      <div className="absolute inset-0 z-10 flex flex-col items-center justify-center gap-2 text-center px-4">
        <span className="text-[10px] font-bold tracking-widest uppercase bg-[var(--color-illustration-sky-blue)] text-white px-2.5 py-0.5 rounded-full">
          Cấp {requiredLevel}
        </span>
        <p className="text-xs font-semibold text-foreground/70">
          Mở khoá ở cấp {requiredLevel}
        </p>
      </div>
    </div>
  );
}
