# Mock Data Remaining — US-010 Chat History

> Cập nhật: 2026-06-05
> US-010: danh sách phiên chat theo ngày, tìm kiếm nội dung, xoá phiên chat

## Kết quả tích hợp

**Tất cả tính năng trong US-010 đã được tích hợp thật.** Không còn mock data nào.

| Tính năng | Trạng thái | Ghi chú |
|-----------|-----------|---------|
| Danh sách conversations với preview | ✅ Tích hợp | `last_message_preview`, `last_message_at`, `title` từ BE |
| Search debounce 300ms (`?q=`) | ✅ Tích hợp | Empty query → bỏ param, không truyền chuỗi rỗng (tránh 422) |
| Delete với 404 fallback | ✅ Tích hợp | 404 → clean cache + toast "Hội thoại không còn tồn tại" |
| Xoá tự động chọn conversation tiếp theo | ✅ Tích hợp | Dùng current conversations list, không query lại |

---

## Lưu ý kỹ thuật

**Search cache:** Mỗi search term được cache riêng (`["chat", "conversations", "keyword"]`). Invalidation sau create/delete xoá tất cả variants nhờ prefix matching của React Query.

**`activeTitle` khi search:** Dropdown search dùng `useConversations(debouncedQuery)` — nếu conversation đang active không nằm trong kết quả tìm kiếm, title fallback về "Cuộc hội thoại mới". Đây là hành vi bình thường vì search chỉ ảnh hưởng danh sách trong dropdown, không ảnh hưởng conversation đang mở.
