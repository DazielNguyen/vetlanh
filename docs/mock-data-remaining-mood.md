# Mock Data Remaining — Mood Tracker (E3)

> Tạo: 2026-06-06
> Epic: E3 — US-011, US-012, US-013

Những phần giao diện dưới đây **chưa thể tích hợp thực** vì API chưa sẵn sàng hoặc thiếu endpoint.
Cấu trúc mock được giữ nguyên để UI không bị vỡ. Bổ sung khi BE hoàn thiện.

---

## 1. MoodTrend — highlight best_day / worst_day trên chart

**File:** `app/services/mood/components/MoodTrend.tsx`

**Vấn đề:** BE trả về `best_day` và `worst_day` (YYYY-MM-DD) trong response của `GET /api/v1/mood/trend`. Recharts cần custom dot renderer để tô màu riêng điểm đó. Hiện tại chart vẽ đều tất cả các điểm, không highlight.

**Cần làm:**
```tsx
// Thêm customized dot vào <Line dataKey="mood">
// Nếu point.date === trend.best_day → fill xanh lá
// Nếu point.date === trend.worst_day → fill đỏ
```

**Data đã có:** `trend.best_day`, `trend.worst_day`, `trend.average_mood` đều được trả về từ BE và đúng type. Chỉ cần thêm UI rendering.

---

## 2. MoodInsights — endpoint `/api/v1/mood/insights` cần BE confirm

**File:** `app/services/mood/components/MoodInsights.tsx`

**Vấn đề:** Endpoint `GET /api/v1/mood/insights` được tham chiếu tới doc riêng (`2026-06-05-feat-insights.md`) chưa có. Hook `useMoodInsights` và service `fetchMood.getInsights` đã sẵn sàng. Nếu BE chưa implement endpoint này, component sẽ hiện trạng thái lỗi (đã xử lý trong UI với `error` state).

**Không cần sửa FE** — cần BE confirm endpoint xong.

---

## 3. PHQ-9 Result — `submitted_at` thay vì `created_at`

**File:** `app/services/assessment/components/Phq9Result.tsx`

**Vấn đề:** Component `Phq9Result` không hiển thị ngày làm bài (chỉ hiện score + severity + suggested_goals). Nếu muốn thêm ngày, dùng field `submitted_at` (đã có trong type `Phq9Result`).

**Không blocking** — chỉ là enhancement tùy chọn.

---

## 4. PHQ-9 Latest — endpoint `/api/v1/assessments/phq9/latest`

**File:** `lib/api/services/fetchPhq9.ts` → `getLatest`

**Vấn đề:** Endpoint `GET /api/v1/assessments/phq9/latest` chưa có trong FE handoff doc (doc chỉ liệt kê `/history` và `/reminder`). Hook `usePhq9Latest` đang dùng endpoint này. Cần BE confirm endpoint tồn tại và response format khớp với `Phq9Result`.

**Tạm thời:** `skipRetryOn(404)` đã được set nên 404 sẽ trả về `null` data thay vì lỗi — UI sẽ hiện form PHQ-9 thay vì crash.

---

## 5. Mood Check-in — phân biệt toast 201 vs 200

**File:** `hooks/useMood.ts` → `useLogMood`

**Vấn đề:** BE phân biệt 201 Created vs 200 OK (update). Hiện tại `createOrUpdateEntry` chỉ trả về `response.data`, không trả về HTTP status code. Toast luôn là "Đã lưu tâm trạng hôm nay" (không phân biệt tạo mới / cập nhật).

**Workaround hiện tại:** Component `MoodCheckIn` tự phân biệt qua `isEditMode` (kiểm tra xem hôm nay đã có entry chưa) → UI text thay đổi, nhưng toast thì không.

**Cần làm nếu muốn toast đúng:**
```ts
// fetchMood.createOrUpdateEntry cần trả về { data, status }
// Sau đó useLogMood.onSuccess nhận status để hiện toast phù hợp
```
