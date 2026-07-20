/**
 * Unit tests for lib/constants/progression.ts
 *
 * Pure functions/constants — no React/DOM dependency, so no rendering is
 * needed. Focus on boundary values at each of the 7 level thresholds
 * (0 / 50 / 120 / 220 / 350 / 500 / 700 XP) plus the MAX_LEVEL cap.
 */

import {
  LEVEL_THRESHOLDS,
  MAX_LEVEL,
  XP_PER_ACTION,
  SAFETY_EXEMPT_FEATURES,
  getLevelForXp,
  getXpToNextLevel,
  getLevelThreshold,
} from "@/lib/constants/progression";

describe("LEVEL_THRESHOLDS", () => {
  it("has exactly 7 levels", () => {
    expect(LEVEL_THRESHOLDS).toHaveLength(7);
  });

  it("levels are numbered 1..7 in ascending order", () => {
    expect(LEVEL_THRESHOLDS.map((t) => t.level)).toEqual([1, 2, 3, 4, 5, 6, 7]);
  });

  it("xpRequired is strictly increasing", () => {
    const xps = LEVEL_THRESHOLDS.map((t) => t.xpRequired);
    for (let i = 1; i < xps.length; i++) {
      expect(xps[i]).toBeGreaterThan(xps[i - 1]);
    }
  });

  it("matches the approved thresholds from the plan (0/50/120/220/350/500/700)", () => {
    expect(LEVEL_THRESHOLDS.map((t) => t.xpRequired)).toEqual([0, 50, 120, 220, 350, 500, 700]);
  });

  it("every threshold has a non-empty unlocks description", () => {
    for (const t of LEVEL_THRESHOLDS) {
      expect(typeof t.unlocks).toBe("string");
      expect(t.unlocks.length).toBeGreaterThan(0);
    }
  });
});

describe("MAX_LEVEL", () => {
  it("equals 7 (the last threshold's level)", () => {
    expect(MAX_LEVEL).toBe(7);
  });
});

describe("XP_PER_ACTION", () => {
  it("defines a positive integer reward for every action", () => {
    Object.values(XP_PER_ACTION).forEach((v) => {
      expect(typeof v).toBe("number");
      expect(v).toBeGreaterThan(0);
    });
  });

  it("has the expected action keys", () => {
    expect(Object.keys(XP_PER_ACTION).sort()).toEqual(
      [
        "dailyCheckIn",
        "moodCheckIn",
        "journalEntry",
        "exercise",
        "firstChatMessageOfDay",
        "thoughtRecord",
        "safetyPlan",
        "phq9",
      ].sort()
    );
  });
});

describe("SAFETY_EXEMPT_FEATURES", () => {
  it("has exactly 3 features", () => {
    expect(SAFETY_EXEMPT_FEATURES).toHaveLength(3);
  });

  it("links to thought-records, safety-plan, and assessment", () => {
    const hrefs = SAFETY_EXEMPT_FEATURES.map((f) => f.href);
    expect(hrefs).toEqual([
      "/services/thought-records",
      "/services/safety-plan",
      "/services/assessment",
    ]);
  });

  it("every feature has a non-empty label", () => {
    for (const f of SAFETY_EXEMPT_FEATURES) {
      expect(f.label.length).toBeGreaterThan(0);
    }
  });
});

describe("getLevelForXp", () => {
  it("returns level 1 for xp === 0", () => {
    expect(getLevelForXp(0)).toBe(1);
  });

  it("returns level 1 for xp just below the level-2 threshold (49)", () => {
    expect(getLevelForXp(49)).toBe(1);
  });

  it("returns level 2 exactly at the level-2 threshold (50)", () => {
    expect(getLevelForXp(50)).toBe(2);
  });

  it("returns level 2 just below the level-3 threshold (119)", () => {
    expect(getLevelForXp(119)).toBe(2);
  });

  it("returns level 3 exactly at the level-3 threshold (120)", () => {
    expect(getLevelForXp(120)).toBe(3);
  });

  it("returns level 3 just below the level-4 threshold (219)", () => {
    expect(getLevelForXp(219)).toBe(3);
  });

  it("returns level 4 exactly at the level-4 threshold (220)", () => {
    expect(getLevelForXp(220)).toBe(4);
  });

  it("returns level 4 just below the level-5 threshold (349)", () => {
    expect(getLevelForXp(349)).toBe(4);
  });

  it("returns level 5 exactly at the level-5 threshold (350)", () => {
    expect(getLevelForXp(350)).toBe(5);
  });

  it("returns level 5 just below the level-6 threshold (499)", () => {
    expect(getLevelForXp(499)).toBe(5);
  });

  it("returns level 6 exactly at the level-6 threshold (500)", () => {
    expect(getLevelForXp(500)).toBe(6);
  });

  it("returns level 6 just below the level-7 threshold (699)", () => {
    expect(getLevelForXp(699)).toBe(6);
  });

  it("returns level 7 exactly at the level-7 threshold (700)", () => {
    expect(getLevelForXp(700)).toBe(7);
  });

  it("caps at MAX_LEVEL (7) for xp far beyond the last threshold (10000)", () => {
    expect(getLevelForXp(10000)).toBe(7);
    expect(getLevelForXp(10000)).toBe(MAX_LEVEL);
  });

  it("returns level 1 for negative xp (defensive, should not throw)", () => {
    expect(getLevelForXp(-50)).toBe(1);
  });
});

describe("getXpToNextLevel", () => {
  it("returns 50 at xp === 0 (need 50 to hit level 2)", () => {
    expect(getXpToNextLevel(0)).toBe(50);
  });

  it("returns 1 at xp === 49 (just short of level 2)", () => {
    expect(getXpToNextLevel(49)).toBe(1);
  });

  it("returns 70 exactly at xp === 50 (level 2, needs 120 for level 3)", () => {
    expect(getXpToNextLevel(50)).toBe(70);
  });

  it("returns 0 at xp === 700 (max level reached, nothing next)", () => {
    expect(getXpToNextLevel(700)).toBe(0);
  });

  it("returns 0 for xp beyond the max threshold (10000)", () => {
    expect(getXpToNextLevel(10000)).toBe(0);
  });

  it("returns the correct remainder inside the last non-max bracket (699 -> 1 to level 7)", () => {
    expect(getXpToNextLevel(699)).toBe(1);
  });
});

describe("getLevelThreshold", () => {
  it("returns the threshold matching level 1", () => {
    expect(getLevelThreshold(1)).toEqual(LEVEL_THRESHOLDS[0]);
  });

  it("returns the threshold matching level 7", () => {
    expect(getLevelThreshold(7)).toEqual(LEVEL_THRESHOLDS[6]);
  });

  it("returns the threshold for every valid level 1..7", () => {
    for (let level = 1; level <= 7; level++) {
      expect(getLevelThreshold(level).level).toBe(level);
    }
  });

  it("falls back to the first threshold for an unknown level (0)", () => {
    expect(getLevelThreshold(0)).toEqual(LEVEL_THRESHOLDS[0]);
  });

  it("falls back to the first threshold for an unknown level (99)", () => {
    expect(getLevelThreshold(99)).toEqual(LEVEL_THRESHOLDS[0]);
  });
});

describe("getLevelForXp / getXpToNextLevel consistency", () => {
  it("getXpToNextLevel is 0 exactly when getLevelForXp reaches MAX_LEVEL", () => {
    for (const xp of [700, 800, 5000]) {
      expect(getLevelForXp(xp)).toBe(MAX_LEVEL);
      expect(getXpToNextLevel(xp)).toBe(0);
    }
  });

  it("xp + xpToNextLevel lands exactly on the next threshold's xpRequired", () => {
    for (const xp of [0, 10, 49, 50, 120, 219, 500, 699]) {
      const level = getLevelForXp(xp);
      if (level >= MAX_LEVEL) continue;
      const nextThreshold = getLevelThreshold(level + 1);
      expect(xp + getXpToNextLevel(xp)).toBe(nextThreshold.xpRequired);
    }
  });
});
