"use client";

import { Progress } from "@/components/ui/progress";
import { useBadgesData } from "@/hooks/useBadges";
import { LEVEL_THRESHOLDS, MAX_LEVEL, getLevelThreshold } from "@/lib/constants/progression";

/** Small, persistent XP/level indicator — sits next to the existing
 * streak/badge display so progress is visible wherever badges currently show. */
export function XpLevelIndicator() {
  const { xp, level, xpToNextLevel, isLoading } = useBadgesData();

  if (isLoading) return null;

  const currentThreshold = getLevelThreshold(level);
  const nextThreshold = LEVEL_THRESHOLDS.find((t) => t.level === level + 1);
  // No next threshold (max level, or a BE-sent level past the known table) — treat as full bar.
  const isMaxLevel = level >= MAX_LEVEL || !nextThreshold;
  const progressPct = isMaxLevel
    ? 100
    : Math.min(
        100,
        Math.max(
          0,
          ((xp - currentThreshold.xpRequired) / (nextThreshold.xpRequired - currentThreshold.xpRequired)) * 100
        )
      );

  return (
    <div className="flex items-center gap-3">
      <span className="text-[10px] font-bold tracking-widest uppercase bg-primary/15 text-primary px-2.5 py-0.5 rounded-full shrink-0">
        Cấp {level}
      </span>
      <div className="flex-1 min-w-0">
        <Progress value={progressPct} className="h-1.5 bg-foreground/10" />
        <p className="text-[10px] text-foreground/40 font-medium mt-1">
          {isMaxLevel ? "Đã đạt cấp tối đa" : `${xpToNextLevel} XP nữa để lên cấp ${level + 1}`}
        </p>
      </div>
    </div>
  );
}
