# Mock Data Remaining — Sprint 4 (Polish & Scale)

> Tạo: 2026-06-06

Những phần dưới đây **chưa thể tích hợp hoàn toàn**. Cấu trúc UI vẫn giữ nguyên để không bị vỡ giao diện.

---

## 1. PMR step — auto-advance (không bắt buộc người dùng nhấn nút)

**File:** `app/services/exercises/[slug]/page.tsx` → `StepCountdown`

**Hiện tại:** Sau khi countdown tense + release xong, button "Bước tiếp theo" được bật — người dùng phải tự nhấn để chuyển bước.

**Có thể thêm:** Auto-advance sau 1–2 giây khi phase "done", hoặc thêm âm thanh/rung. Đây là UX polish, không phải yêu cầu bắt buộc từ spec.

---

## 2. Exercise step `input_prompt`

**File:** `app/services/exercises/[slug]/page.tsx` → `StepCountdown`

**Vấn đề:** `ExerciseStep.input_prompt` (text prompt để user nhập phản hồi trong bước) hiện không được render. Spec chưa mô tả UI cụ thể cho field này.

**Cần BE confirm:** Format và mục đích của `input_prompt` trước khi build UI nhập liệu.

---

## 3. Exercise reminder — không hiển thị banner khi đã tập rồi trong ngày

**File:** `app/services/exercises/components/ExerciseList.tsx`

**Hiện tại:** Banner hiển thị/ẩn dựa vào `should_notify` từ BE. BE xử lý logic "already exercised today" → trả về `should_notify: false`. FE không cần làm thêm gì. **Đây là hành vi đúng theo spec.**

**Không cần sửa** — ghi chú để tránh nhầm lẫn khi review.

---

## 4. Journal — content search bị loại bỏ (US-030 breaking change)

**File:** `app/services/journal/components/JournalList.tsx`

**Đã làm:** Placeholder đổi sang "Tìm theo tiêu đề..." để phản ánh search title-only.

**Còn lại (tùy chọn):** Dòng preview `entry.content` vẫn hiển thị dưới title trong danh sách nhật ký. Nếu journal đã được mã hóa phía BE, `entry.content` trả về từ list API có thể là chuỗi rỗng hoặc placeholder — FE không cần xử lý thêm, chỉ cần để nguyên.

---

## 5. ProgressTracker — chưa tích hợp exercise reminder stats

**File:** `app/services/exercises/components/ProgressTracker.tsx`

**Vấn đề:** Component này chưa được kiểm tra trong Sprint 4. Nếu BE cần thêm field thống kê liên quan đến reminder, cần kiểm tra lại.
