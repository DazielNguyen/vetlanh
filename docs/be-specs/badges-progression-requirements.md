# BE API Requirements — Badges Endpoint XP/Level Fields

**Date:** 2026-07-21  
**Requested by:** FE Team (Phase 2: XP/Level System)  
**Status:** ⏳ Pending BE implementation  
**Context:** Phase 2 of the Gaming-Companion redesign adds an XP/level progression layer. The FE currently derives `xp`, `level`, and `xp_to_next_level` client-side; these fields should eventually be sent by the backend for authoritative tracking.

---

## Existing Endpoint

| Method | Endpoint | Used for |
|--------|----------|----------|
| `GET` | `api/v1/badges` | Fetch user's streak and earned badges |

Current FE type (`types/dashboard.ts`):
```typescript
export interface BadgesData {
  streak_days: number;
  badges: BadgeItem[];
  // Optional: BE doesn't send these yet. FE derives client-side until BE ships them.
  xp?: number;
  level?: number;
  xp_to_next_level?: number;
}
```

---

## New Fields Required

### Overview
The `GET api/v1/badges` response should eventually include three new optional fields on the root `BadgesData` object. These are **additive only** — adding them must not break existing clients that ignore them.

### Field Definitions

| Field | Type | Example | Notes |
|-------|------|---------|-------|
| `xp` | `number` | `145` | Total XP earned by the user (cumulative). |
| `level` | `number` | `3` | Current level derived from `xp` (read-only, computed server-side). |
| `xp_to_next_level` | `number` | `85` | Remaining XP needed to reach the next level. Derived as `(next_threshold - xp)`; if already at max level, can be `0` or omitted. |

### Response Format

```json
{
  "streak_days": 42,
  "badges": [
    {
      "slug": "day-7",
      "label": "7-Day Streak",
      "milestone_days": 7,
      "unlocked": true,
      "is_new": false
    }
  ],
  "xp": 145,
  "level": 3,
  "xp_to_next_level": 85
}
```

### XP Reference (FE Source of Truth)

Until the BE owns XP computation, the FE maintains `lib/constants/progression.ts` with the official thresholds and per-action XP values. Once the BE ships these fields, the FE will trust the BE's `xp` and `level` values and derive only `xp_to_next_level` locally if needed.

**Current thresholds (approved per Phase 2 gate):**
| Level | Cumulative XP Required | Unlocks |
|-------|------------------------|---------|
| 1 | 0 | Chat, mood check-in, 1 exercise |
| 2 | 50 | Journal, Badges/streak view |
| 3 | 120 | Library |
| 4 | 220 | Sounds |
| 5 | 350 | Community 1-1 matching |
| 6 | 500 | AI-personalized recommendations |
| 7 | 700 | Full companion cosmetic state |

**Current per-action XP (BE-owned award logic, FE-owned display):**
| Action | XP | Notes |
|--------|-----|-------|
| Daily check-in (streak trigger) | 10 | Existing feature, now earns XP |
| Mood check-in | 10 | Same cadence as check-in |
| Journal entry | 15 | Slightly more effort |
| Exercise completion | 20 | Session-length action |
| Chat message (first per day, capped at 1 grant/day) | 15 | Prevent XP farming via spam |
| Thought Record completion | 30 | Clinical depth; always available (not level-gated) |
| Safety Plan completion/update | 30 | Very high value; always available (not level-gated) |
| PHQ-9 completion | 40 | Highest single-action reward; always available (not level-gated) |

---

## Safety Exemption

**Non-negotiable:** Thought Records, Safety Plan, and PHQ-9 Assessment must **never** be level-gated, even though they earn XP. The FE enforces this with a separate, always-visible "Công cụ hỗ trợ" (support tools) entry point reachable from Level 1 regardless of progression state.

---

## Implementation Notes

### Phase
- **Phase 2** (FE): Client-side derivation of XP/level from a FE constant table, no BE changes.
- **Phase 3+** (FE): Wire derived level/XP to feature gates across the app.
- **BE (not scoped here):** When ready, BE computes and returns `xp`/`level`/`xp_to_next_level` from the existing action-tracking audit log; FE will accept these fields as optional and prefer them over client-side derivation.

### Backward Compatibility
- **No breaking change.** If BE does not send these fields, FE continues to derive them locally from `streak_days` and the FE's constant thresholds.
- Existing clients that don't know about these fields will simply ignore them on upgrade.
- Once the BE ships these fields, FE will migrate to preferring the BE values for true authoritative tracking.

### Rate Limit
- Inherits the rate limit of the existing `GET /badges` endpoint (if any).

---

## FE Integration Status

| Component | Integration | Notes |
|-----------|-------------|-------|
| `useBadgesData()` | ✅ Reads `xp`, `level`, `xp_to_next_level` if present; derives locally if absent | `hooks/useBadgesData.ts` |
| `XpLevelIndicator` | ✅ Displays current level and progress bar to next level | `components/progression/XpLevelIndicator.tsx` |
| `LevelGate` | ✅ Gating wrapper, checks `level >= requiredLevel` | `components/progression/LevelGate.tsx` |
| `LevelUpCelebration` | ✅ Celebratory overlay when user crosses a level threshold | `components/progression/LevelUpCelebration.tsx` |
| Mutation invalidation | ✅ All XP-earning mutations invalidate `["badges"]` query on success | mood, journal, thought records, safety plan, PHQ-9, exercise |

---

## Confirmed Answers (Pending)

| Question | Answer | Status |
|----------|--------|--------|
| Should `xp`/`level`/`xp_to_next_level` be nullable or omitted if not yet computed? | Prefer omitted (optional fields) — simpler FE null-check. | ⏳ Pending BE decision |
| Should level be capped at 7, or can it exceed 7? | Proposed plan caps at 7, but thresholds can be extended without FE code change. | ⏳ TBD by BE |
| Is XP server-authoritative (immutable audit log) or client-derivable from streak/badges? | Should be server-authoritative for progression integrity (prevent client-side manipulation). | ⏳ TBD by BE architecture |
| Should failed/rolled-back actions deduct XP, or XP only increments? | Propose XP only increments (no deduction for undo/delete); keeps UX simple. | ⏳ Pending BE decision |
| Do new users start at `xp=0, level=1`, or only after their first action? | Propose `xp=0, level=1` on account creation; consistent with FE constant table. | ⏳ Pending BE decision |

---

## Risks

- **Phase 2 FE work not blocked:** FE implementation is complete and tested against mocked data. BE integration can happen on a follow-up schedule once the endpoint is ready.
- **Client-side derivation accuracy:** Until BE sends authoritative values, FE's local derivation assumes all XP-earning actions have been tracked on the server (i.e., FE trusts the badges list is complete). If a server-side action fails to log, FE will compute a higher `level` than the truth — acceptable for MVP since this is overwritten once BE ships the fields.
- **Threshold changes:** If BE needs to adjust thresholds post-launch, `lib/constants/progression.ts` should be kept in sync. Future architecture: move thresholds to BE config, FE fetches on init.

---

## Recommended Timeline

1. **Short-term (Phase 3):** FE wires LevelGate to real features using client-side derivation; ship with BE support (mocked responses) for testing.
2. **Medium-term (Phase 4+):** BE adds `xp`/`level`/`xp_to_next_level` to the `/badges` endpoint; FE accepts and uses authoritative values on release.
3. **Long-term:** Consider moving threshold constants to BE config/database for runtime tunability.
