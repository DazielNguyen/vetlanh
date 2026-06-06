# Mock Data Remaining — FE Missing Integration

> Tạo: 2026-06-06

Những phần dưới đây **chưa thể tích hợp hoàn toàn**. Cấu trúc UI vẫn giữ nguyên.

---

## 1. ~~LiveInsights — mood param hardcoded "anxious"~~ ✅ DONE

**Fixed:** `useMoodEntries({ limit: 1 })` → map `entry.mood` (1–5) → `"sad" | "anxious" | "need_energy"` → truyền vào `useRecommendedExercises`. Fallback `"anxious"` nếu chưa có check-in.

---

## 2. LiveInsights — mood chart hiển thị theo ngày

**File:** `app/services/chat/components/LiveInsights.tsx`

**Hiện tại:** Chart render bars theo thứ tự mảng trả về từ BE (sparse — chỉ ngày có check-in).

**Còn lại (tùy chọn):** Nếu cần hiển thị đúng 7 slot tương ứng 7 ngày liên tiếp (có gap cho ngày không check-in), cần tạo mảng 7 ngày cố định rồi map với data từ BE. Hiện tại bars chỉ render ngày có data, không có visual gap.

---

## 3. LiveInsights — crisis button route

**File:** `app/services/chat/components/LiveInsights.tsx`

**Hiện tại:** Dùng `tel:18006898` (Vietnam crisis hotline) theo spec.

**Còn lại (product decision):** Spec đề cập có thể dùng internal route `/services/crisis`. Nếu có trang crisis nội bộ, đổi `href` từ `tel:` sang route đó.

---

## 4. ~~MoodInsights — delta âm hiển thị màu đỏ~~ ✅ DONE

**Fixed:** `delta >= 0` → `text-emerald-600 bg-emerald-50` + prefix `+`; `delta < 0` → `text-red-600 bg-red-50`, không có prefix `+`.

---

## 5. Journal prompts — usePromptsByTopic chưa được dùng trong UI

**File:** `hooks/useJournalPrompts.ts`, `lib/api/services/fetchJournalPrompts.ts`

**Hiện tại:** `usePromptsByTopic(topic)` hook đã được implement và wire đúng endpoint. Nhưng không có UI component nào dùng nó.

**Không cần sửa ngay** — hook sẵn sàng khi cần build topic filter UI.
