// XP/level progression constants — approved values from
// plans/gaming-companion-redesign/plan.md's Research Summary (human-approved
// at the Phase 2 gate). Treat these as tunable config: once the BE endpoint
// exposes xp/level itself, these thresholds should move server-side and this
// file becomes the fallback used only when the BE hasn't sent them yet.

export interface LevelThreshold {
  level: number;
  xpRequired: number;
  unlocks: string;
}

export const LEVEL_THRESHOLDS: LevelThreshold[] = [
  { level: 1, xpRequired: 0, unlocks: "Trò chuyện AI, Tâm trạng, 1 bài tập" },
  { level: 2, xpRequired: 50, unlocks: "Nhật ký, Huy hiệu" },
  { level: 3, xpRequired: 120, unlocks: "Thư viện" },
  { level: 4, xpRequired: 220, unlocks: "Âm thanh" },
  { level: 5, xpRequired: 350, unlocks: "Cộng đồng" },
  { level: 6, xpRequired: 500, unlocks: "Gợi ý cá nhân hoá từ AI" },
  { level: 7, xpRequired: 700, unlocks: "Trang trí (cosmetic)" },
];

export const MAX_LEVEL = LEVEL_THRESHOLDS[LEVEL_THRESHOLDS.length - 1].level;

export const XP_PER_ACTION = {
  dailyCheckIn: 10,
  moodCheckIn: 10,
  journalEntry: 15,
  exercise: 20,
  firstChatMessageOfDay: 15,
  thoughtRecord: 30,
  safetyPlan: 30,
  phq9: 40,
} as const;

/** Features that always earn XP but must never be level-gated, per the
 * Phase 2 safety exemption (non-negotiable — see phase-02 plan file). They
 * are reached via a persistent, always-visible support-tools entry point
 * instead of the level-gated discovery surface. */
export const SAFETY_EXEMPT_FEATURES = [
  { label: "Hồ sơ tư duy", href: "/services/thought-records" },
  { label: "Kế hoạch an toàn", href: "/services/safety-plan" },
  { label: "Đánh giá PHQ-9", href: "/services/assessment" },
] as const;

export function getLevelForXp(xp: number): number {
  let level = LEVEL_THRESHOLDS[0].level;
  for (const threshold of LEVEL_THRESHOLDS) {
    if (xp >= threshold.xpRequired) level = threshold.level;
  }
  return level;
}

export function getXpToNextLevel(xp: number): number {
  const next = LEVEL_THRESHOLDS.find((t) => t.xpRequired > xp);
  return next ? next.xpRequired - xp : 0;
}

export function getLevelThreshold(level: number): LevelThreshold {
  return LEVEL_THRESHOLDS.find((t) => t.level === level) ?? LEVEL_THRESHOLDS[0];
}
