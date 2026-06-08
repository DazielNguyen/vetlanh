# FE Feature: Interactive Healing Services — Enhanced Exercise UX

> Branch: `dev`
> Date: 2026-06-08
> Implemented in: `app/services/exercises/` and `app/services/components/`

Four UI enhancements to the exercise and dashboard experience:

---

## 1. BreathingSession — 4-7-8 Animated Circle

**File:** `app/services/exercises/[slug]/page.tsx`

When `exercise.category === "breathing"`, the exercise detail page now renders an animated breathing circle instead of the generic `TimerSession`.

**Behavior:**
- Animated expanding/contracting circle follows 4-7-8 breathing rhythm:
  - **Inhale:** 4 seconds (scale up)
  - **Hold:** 7 seconds (maintain)
  - **Exhale:** 8 seconds (scale down)
- Respects `prefers-reduced-motion` — animations skip when OS accessibility setting is enabled
- Loops until user clicks **"Kết thúc buổi tập"** (End Session)
- Duration tracked from start-to-finish button press

**Implementation notes:**
- Uses Framer Motion (`motion/react`) for animation
- `BreathingSession` component is render-priority: `breathing` category → steps → timer fallback
- After session ends → feeling picker appears (see section 3)

---

## 2. Emoji Mood Filter Buttons

**File:** `app/services/exercises/components/ExerciseList.tsx`

The mood filter row now displays 5 large emoji buttons instead of text pills for moods with emoji representations.

**Display:**
- Button grid with large emoji (text-2xl), label text below
- Emojis: `anxious` → 😰, `sad` → 😢, `cant_sleep` → 🌙, `need_energy` → ⚡, `angry` → 😤
- Selected state: emerald ring + emerald bg
- Fallback: any mood without emoji mapping renders as text pill (for future extensibility)

**Behavior:**
- Clicking emoji button sets mood filter
- Separate row for "extra moods" (those without emoji mapping)
- "Xem tất cả" (View all) button clears mood filter

---

## 3. After-Session Feeling Picker

**File:** `app/services/exercises/[slug]/page.tsx`

All session types (breathing, steps, timer) now show an inline feeling picker after completion.

**UI:**
- 4 emotion options + 1 skip button
- Options: "Rất nhẹ" (😌), "Nhẹ hơn" (😊), "Bình thường" (😐), "Vẫn căng" (😣)
- Each feeling is a 2-column grid button with emoji and label
- Skip button renders as underlined text below

**Storage:**
- On selection (or skip): feeling stored to `localStorage` key `feeling_after_{slug}_last`
- Key example: `feeling_after_478-breathing_last` → value: `"much_better"`, `"better"`, `"same"`, `"worse"`, or empty string
- Session completion + logging continues regardless of feeling selection

**Timing:**
- Picker appears inline after `SessionDoneView` renders (fade-in animation)
- Appears before `useLogExercise` mutation completes

---

## 4. QuickReliefCard — Dashboard 3-Tile Strip

**Files:**
- `app/services/components/QuickReliefCard.tsx`
- `app/services/components/DashboardContent.tsx`

A compact 3-tile widget on the dashboard showing recommended exercises.

**Display:**
- Card title: "Giảm căng thẳng ngay" (Quick Relief)
- 3-column grid with category emoji, exercise title, and duration badge
- Category emoji map: `breathing` → 🌬️, `meditation` → 🧘, `grounding` → 🌱, `cbt` → 💭, `relaxation` → 🌊
- Each tile links to `/services/exercises/{slug}`

**Data source:**
```ts
useRecommendedExercises({ limit: 3 })
```

**Visibility:**
- Hidden (returns `null`) when:
  - API returns 0 exercises (`!exercises?.length`)
  - API returns an error (`isError`)
  - Loading state: shows 3 skeleton tiles while fetching
- Rendered only on dashboard (`DashboardContent.tsx`)

**No endpoint changes required** — uses existing `GET /api/v1/exercises/recommended?mood={mood}&limit=3`

---

## FE Notes

- **Feeling picker storage:** no BE endpoint needed, purely local client-side storage
- **Breathing circle:** respects system accessibility preferences via `prefers-reduced-motion` media query
- **QuickReliefCard:** gracefully hides if zero exercises returned or on error — does not break layout
- **Mood filter emoji:** fallback EMOJI_MOOD_MAP is hardcoded; additional moods without emoji render as text pills below
- **Session priority:** breathing > steps > timer — check `isBreathing` and `hasSteps` flags to pick correct UI
