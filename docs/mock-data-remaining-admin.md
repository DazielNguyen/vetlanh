# Admin Panel — Mock Data Remaining

> Updated: 2026-06-08
> These sections still use static mock data because no BE endpoint exists for them yet.

---

## 1. Dashboard — Weekly subscription chart

**File:** `app/(admin)/admin/dashboard/page.tsx` → `subChartData`

**Mock data:**
```ts
const subChartData = [
  { day: "T2", value: 3 },
  { day: "T3", value: 5 },
  ...
];
```

**What's needed from BE:**
- Endpoint: `GET /api/v1/admin/stats/weekly-grants`
- Response: `{ day: string; count: number }[]` for the current week (Mon–Sun)

---

## 2. Dashboard — Plan type breakdown ("Phân loại gói")

**File:** `app/(admin)/admin/dashboard/page.tsx` → hardcoded array inside JSX

**Mock data:**
```ts
[
  { label: "Pro 1 tháng", count: 21 },
  { label: "Pro 3 tháng", count: 9 },
  { label: "Pro 6 tháng", count: 5 },
]
```

**What's needed from BE:**
- Either extend `GET /api/v1/admin/stats` to include a `plan_breakdown: { plan: string; count: number }[]` field,
- or add a separate `GET /api/v1/admin/stats/plan-breakdown` endpoint.

---

## 3. Dashboard — Chart footer text

**File:** `app/(admin)/admin/dashboard/page.tsx`

```tsx
<p>Tổng 35 gói trong 7 ngày qua</p>
```

This should sum the weekly chart data once that endpoint is live. Will become dynamic automatically when the chart data is real.

---

## Notes

- The 4 stat cards, pending subscription preview, and recent errors sections are **already live** (integrated with real API).
- The weekly chart and plan breakdown are purely visual enhancements — the admin panel is fully functional without them.
