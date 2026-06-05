# Mock Data Remaining — Journal (Nhật Ký Cá Nhân)

> Tạo: 2026-06-06

Những phần dưới đây **chưa thể tích hợp hoàn toàn**. Cấu trúc UI vẫn giữ nguyên để không bị vỡ giao diện.

---

## 1. Auto-save indicator — chưa xác nhận UX với BE

**File:** `app/services/journal/components/JournalEditor.tsx`

**Đã làm:** Auto-save debounce 2s hoạt động, hiển thị indicator "Đang lưu..." / "Đã lưu".

**Còn lại (tùy chọn):** Nếu BE trả lỗi trong auto-save (network timeout, 422), indicator hiện không hiển thị gì cho user. Cân nhắc thêm subtle error state ("Lưu tự động thất bại") nếu UX yêu cầu.

---

## 2. Journal prompts — chưa nằm trong spec journal này

**Files:** `hooks/useJournalPrompts.ts`, `app/services/journal/components/DailyPromptCard.tsx`

**Vấn đề:** `DailyPromptCard` và `useJournalPrompts` hook đang dùng `fetchJournalPrompts` service — service này chưa được include trong spec `docs/2026-06-06-feat-journal.md`. Cần confirm endpoint `/api/v1/journal/prompts` hoặc tương đương.

**Hiện tại:** Component vẫn render bình thường nếu BE có endpoint. Nếu endpoint chưa có, component sẽ hiển thị nothing (do `if (!data) return null`).

**Cần BE confirm:** Endpoint cho daily prompt và format response.

---

## 3. Content preview trong list — có thể trống sau khi bật mã hoá

**File:** `app/services/journal/components/JournalList.tsx` (line 85)

**Hiện tại:** Hiển thị `entry.content` làm preview dưới title trong danh sách.

**Vấn đề tiềm ẩn:** Spec Sprint 4 đề cập BE bật mã hoá at-rest cho journal content. Nếu list API trả về `content: ""` hoặc `content: "[encrypted]"`, preview sẽ hiển thị chuỗi rỗng hoặc placeholder thô.

**Không cần sửa ngay** — FE chỉ hiển thị những gì BE trả về. Nếu BE đã handle (trả về preview snippet không mã hoá), không cần làm thêm gì.

---

## 4. Pagination — không có `total` count

**File:** `app/services/journal/components/JournalList.tsx`

**Đã làm:** Pagination dùng "load more" pattern: tăng `offset`, ẩn nút "Tiếp" khi `entries.length < PAGE_SIZE`.

**Còn lại:** Không hiển thị được "Trang X / Y" hoặc tổng số entries vì API không trả `total`. Đây là giới hạn của API — không sửa được ở FE.

**Không cần sửa** — hành vi hiện tại đúng theo spec.
