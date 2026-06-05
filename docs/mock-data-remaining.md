# Mock Data Remaining — AI Chatbot

> Cập nhật: 2026-06-05
> File: `app/services/chat/components/LiveInsights.tsx`

Phần dưới đây **chưa tích hợp** vì chưa có BE endpoint. Giao diện vẫn hiển thị bình thường với dữ liệu cứng.

---

## 1. Mood Trend Chart (Xu hướng tâm trạng)

**Component:** `LiveInsights.tsx` — section "Xu hướng tâm trạng"

**Mock hiện tại:**
```tsx
{[40, 60, 35, 70, 50, 80, 45].map((h, i) => (
  <div key={i} style={{ height: `${h}%` }} />
))}
<p>Tâm trạng của bạn giảm 15% hôm nay. Hãy hít thở thật sâu.</p>
```

**Cần từ BE:** Một endpoint trả về sentiment history của user (7 ngày gần nhất), ví dụ:
```
GET /api/v1/users/me/mood-summary?days=7
→ [{ date, sentiment_score }]
```

---

## 2. Recommended Exercises Sidebar (Bài tập đề xuất)

**Component:** `LiveInsights.tsx` — section "Bài tập đề xuất"

**Mock hiện tại:** Hardcode "Thở 4-7-8" và "Thiền tập trung" với mô tả cứng.

**Cần từ BE:** Một endpoint trả về bài tập gợi ý dựa trên pattern tâm trạng gần đây, ví dụ:
```
GET /api/v1/exercises/recommended
→ [{ id, title, category, duration_minutes }]
```

> **Note:** Exercise card inline (hiện dưới bubble AI sau khi stream xong) đã được tích hợp thật — data đến từ `done` SSE event. Chỉ sidebar này là mock.

---

## 3. Crisis Support Button

**Component:** `LiveInsights.tsx` — button "Hỗ trợ khủng hoảng"

**Mock hiện tại:** Button không có `href`, chỉ có `onClick` trống.

**Cần bổ sung:** Link đến trang khủng hoảng hoặc số hotline. Có thể là:
- Route nội bộ `/services/crisis`
- Hoặc link ngoài `tel:1800599920` (đường dây hỗ trợ tâm lý Việt Nam)

---

## Tóm tắt

| Phần | Trạng thái | Việc cần làm |
|------|-----------|--------------|
| Mood trend chart | Mock | Thêm BE endpoint GET mood-summary |
| Recommended exercises sidebar | Mock | Thêm BE endpoint GET exercises/recommended |
| Crisis support button | Mock | Quyết định route / số hotline |
| Conversation list (CRUD) | ✅ Tích hợp | — |
| Chat messages history | ✅ Tích hợp | — |
| SSE streaming chat | ✅ Tích hợp | — |
| Exercise card inline (sau stream) | ✅ Tích hợp | — |
| Suggest check-in banner | ✅ Tích hợp | — |
