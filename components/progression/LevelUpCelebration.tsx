"use client";

import { motion, useReducedMotion } from "motion/react";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import CompanionCharacter from "@/components/illustrations/CompanionCharacter";
import { getLevelThreshold } from "@/lib/constants/progression";
import { EASING } from "@/lib/motion";

interface LevelUpCelebrationProps {
  levelUpTo: number | null;
  dismissLevelUp: () => void;
}

/**
 * Level-up celebration overlay. Fires once per level crossed (dedup lives in
 * useBadges' sessionStorage-backed levelUpTo state, cloning the existing
 * badge-toast pattern) — remounting this component does not re-trigger it.
 * levelUpTo/dismissLevelUp are owned by the single useBadges() call in
 * DashboardContent so this component stays a pure display concern.
 */
export function LevelUpCelebration({ levelUpTo, dismissLevelUp }: LevelUpCelebrationProps) {
  const prefersReduced = useReducedMotion();

  if (levelUpTo === null) return null;

  const { unlocks } = getLevelThreshold(levelUpTo);
  const enter = prefersReduced
    ? { initial: {}, animate: {}, transition: { duration: 0 } }
    : {
        initial: { opacity: 0, scale: 0.92 },
        animate: { opacity: 1, scale: 1 },
        transition: { duration: 0.3, ease: EASING },
      };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm"
      onClick={dismissLevelUp}
      onKeyDown={(e) => {
        if (e.key === "Escape") dismissLevelUp();
      }}
      tabIndex={-1}
      // eslint-disable-next-line jsx-a11y/no-noninteractive-element-interactions
    >
      <motion.div
        initial={enter.initial}
        animate={enter.animate}
        transition={enter.transition}
        className="relative bg-white dark:bg-slate-900 rounded-3xl shadow-xl w-full max-w-sm p-6 space-y-4 text-center dark:border dark:border-white/10"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={dismissLevelUp}
          aria-label="Đóng"
          className="absolute right-4 top-4 w-8 h-8 rounded-full flex items-center justify-center text-slate-400 hover:bg-slate-100 transition"
        >
          <X className="w-4 h-4" />
        </button>

        <CompanionCharacter state="happy" className="w-32 h-32 mx-auto" />

        <div>
          <h2 className="text-lg font-bold text-slate-800 dark:text-white">
            Chúc mừng! Bạn đã đạt Cấp {levelUpTo}
          </h2>
          <p className="text-sm text-slate-500 mt-1">Mở khoá: {unlocks}</p>
        </div>

        <Button className="w-full rounded-2xl" onClick={dismissLevelUp}>
          Tuyệt vời!
        </Button>
      </motion.div>
    </div>
  );
}
