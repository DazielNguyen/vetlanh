# Mock Data Remaining — FE Missing Integration

> Tạo: 2026-06-06

Những phần dưới đây **chưa thể tích hợp hoàn toàn**. Cấu trúc UI vẫn giữ nguyên.

---

## 1. LiveInsights — mood param hardcoded "anxious"

**File:** `app/services/chat/components/LiveInsights.tsx`

**Hiện tại:** `useRecommendedExercises({ mood: "anxious", limit: 3 })` — dùng `"anxious"` làm fallback cố định.

**Cần thêm:** Lấy mood từ lần check-in gần nhất của user (ví dụ từ `useMoodEntries({ limit: 1 })`), map sang `MoodFilter` enum, truyền vào `mood` param. Nếu chưa có check-in thì giữ fallback `"anxious"`.

**Lý do chưa làm:** Spec note "derive from latest check-in" nhưng không định nghĩa mapping mood score (1–5) → MoodFilter string. Cần confirm với product/BE.

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

## 4. MoodInsights — delta âm (cải thiện) hiển thị màu đỏ

**File:** `app/services/mood/components/MoodInsights.tsx` (line 65)

**Hiện tại:** `+{item.delta}` luôn hiển thị màu xanh `text-emerald-600`. Nhưng delta âm = tệ hơn, delta dương = cải thiện.

**Cần sửa:** Kiểm tra `item.delta > 0` → xanh; `item.delta < 0` → đỏ. Hiện component chưa xử lý trường hợp delta âm.

---

## 5. Journal prompts — usePromptsByTopic chưa được dùng trong UI

**File:** `hooks/useJournalPrompts.ts`, `lib/api/services/fetchJournalPrompts.ts`

**Hiện tại:** `usePromptsByTopic(topic)` hook đã được implement và wire đúng endpoint. Nhưng không có UI component nào dùng nó.

**Không cần sửa ngay** — hook sẵn sàng khi cần build topic filter UI.
