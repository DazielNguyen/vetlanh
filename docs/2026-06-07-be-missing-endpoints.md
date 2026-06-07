# BE Missing Endpoints — Services Pages

> Date: 2026-06-07
> Author: FE team
> Status: Awaiting BE implementation

Tài liệu này liệt kê tất cả các màn hình / widget ở trang Services hiện đang dùng **mock data cứng** trên FE. Mỗi mục có response shape mà FE đang expect để BE implement đúng contract.

Phân loại theo mức độ ưu tiên:

- 🔴 **P1 — Core feature** — tính năng chính, cần làm trước
- 🟡 **P2 — Supporting feature** — bổ trợ, làm sau khi P1 xong
- ⚪ **P3 — Nice-to-have** — cải thiện UX, không blocking

> **Scope:** App chỉ phục vụ tự chữa lành — bài tập, chatbot, mood tracking, nhật ký. Không có tính năng chuyên gia hay đặt lịch hẹn.

---

## 1. Dashboard Widgets 🔴

### 1.1 Câu trích dẫn mỗi ngày

**FE file:** `app/services/components/DailyQuote.tsx`

```
GET /api/v1/dashboard/quote
Authorization: Bearer <token>
```

**Response:**
```json
{
  "text": "Chữa lành không phải đường thẳng, nhưng mỗi bước tiến đều là một chiến thắng.",
  "author": "string | null"
}
```

> **Note:** FE refresh quote mỗi lần load trang — BE có thể cache theo ngày (1 quote/ngày/user) hoặc random từ pool.

---

### 1.2 Tài nguyên gợi ý (Resources for You)

**FE file:** `app/services/components/ResourcesForYou.tsx`

```
GET /api/v1/resources/recommended
Authorization: Bearer <token>
Query: ?limit=2
```

**Response:**
```json
[
  {
    "id": "string",
    "title": "string",
    "type": "article | audio | video",
    "duration_label": "string",      // e.g. "Đọc 5 phút", "Audio 12 phút"
    "url": "string | null"
  }
]
```

---

### 1.3 Cộng đồng hỗ trợ (Community Support)

**FE file:** `app/services/components/CommunitySupport.tsx`

```
GET /api/v1/community/featured
```

**Response:**
```json
{
  "message": "string",
  "author_display": "string",        // tên ẩn danh, e.g. "Lan A."
  "active_users_count": 4
}
```

---

### 1.4 Hành trình chữa lành (Healing Path)

**FE file:** `app/services/components/CurrentHealingPath.tsx`

Đây là widget quan trọng — hiện đang dùng 3 task hardcode với progress cứng.

```
GET /api/v1/user/healing-path
Authorization: Bearer <token>
```

**Response:**
```json
{
  "tasks": [
    {
      "id": "string",
      "title": "string",
      "subtitle": "string",          // mô tả ngắn
      "progress_pct": 75,            // 0–100
      "status": "active | locked | upcoming",
      "unlock_label": "string | null" // e.g. "Ngày 4", "20:00" — hiện khi status=locked/upcoming
    }
  ]
}
```

---

### 1.5 Danh sách wellness hàng ngày (Daily Wellness Checklist)

**FE file:** `app/services/components/DailyWellnessChecklist.tsx`

```
GET /api/v1/wellness/checklist
Authorization: Bearer <token>
Query: ?date=2026-06-07          // YYYY-MM-DD
```

**Response:**
```json
{
  "date": "2026-06-07",
  "items": [
    {
      "id": "string",
      "title": "string",
      "subtitle": "string",
      "completed": false
    }
  ]
}
```

```
PUT /api/v1/wellness/checklist/{item_id}
Authorization: Bearer <token>
Body: { "completed": true }
```

**Response:** `200 OK` với object item đã cập nhật.

---

## 2. Chat — Quick Prompts 🟡

**FE file:** `app/services/chat/components/ChatMessages.tsx`

Hiện có 4 prompt cứng hiển thị khi conversation trống.

```
GET /api/v1/chat/quick-prompts
```

**Response:**
```json
[
  { "id": "string", "text": "string" }
]
```

> **Note:** FE hiển thị tối đa 4 prompt. Nếu BE trả nhiều hơn, FE lấy 4 cái đầu.

---

## 3. Exercises — Danh mục & Mood filter 🟡

**FE file:** `app/services/exercises/components/ExerciseList.tsx`

Hiện tại FE hardcode 2 bộ filter: loại bài tập và mood. Nếu admin muốn thêm/bớt category mà không cần deploy lại FE, cần 2 endpoint sau.

### 3.1 Danh mục bài tập

```
GET /api/v1/exercises/categories
```

**Response:**
```json
[
  { "key": "breathing", "label": "Hơi thở" },
  { "key": "meditation", "label": "Thiền" },
  { "key": "grounding", "label": "Hiện tại" },
  { "key": "cbt", "label": "CBT" },
  { "key": "relaxation", "label": "Thư giãn" }
]
```

### 3.2 Mood filter cho bài tập

```
GET /api/v1/exercises/mood-filters
```

**Response:**
```json
[
  { "key": "anxious", "label": "Lo âu" },
  { "key": "sad", "label": "Buồn bã" },
  { "key": "cant_sleep", "label": "Mất ngủ" },
  { "key": "need_energy", "label": "Cần năng lượng" },
  { "key": "angry", "label": "Tức giận" }
]
```

---

## 4. Mood Check-in — Factors ⚪

**FE file:** `app/services/mood/components/MoodCheckIn.tsx`

9 factor cứng (công việc, giấc ngủ, tập thể dục...). Nếu cần admin tùy chỉnh:

```
GET /api/v1/mood/factors
```

**Response:**
```json
[
  { "key": "work", "label": "Công việc" },
  { "key": "sleep", "label": "Giấc ngủ" },
  { "key": "exercise", "label": "Tập thể dục" },
  { "key": "diet", "label": "Ăn uống" },
  { "key": "relationships", "label": "Mối quan hệ" },
  { "key": "weather", "label": "Thời tiết" },
  { "key": "health", "label": "Sức khỏe" },
  { "key": "finance", "label": "Tài chính" },
  { "key": "study", "label": "Học tập" }
]
```

> **Note:** Nếu BE chưa có thời gian implement, FE vẫn chạy được với list cứng. Chỉ cần khi admin muốn tùy chỉnh.

---

## Tổng hợp

| # | Feature | Endpoint | Priority | FE file |
|---|---------|----------|----------|---------|
| 1 | Daily quote | `GET /dashboard/quote` | 🔴 P1 | `DailyQuote.tsx` |
| 2 | Recommended resources | `GET /resources/recommended` | 🔴 P1 | `ResourcesForYou.tsx` |
| 3 | Community featured message | `GET /community/featured` | 🔴 P1 | `CommunitySupport.tsx` |
| 4 | Healing path progress | `GET /user/healing-path` | 🔴 P1 | `CurrentHealingPath.tsx` |
| 5 | Daily wellness checklist | `GET/PUT /wellness/checklist` | 🔴 P1 | `DailyWellnessChecklist.tsx` |
| 6 | Chat quick prompts | `GET /chat/quick-prompts` | 🟡 P2 | `ChatMessages.tsx` |
| 7 | Exercise categories | `GET /exercises/categories` | 🟡 P2 | `ExerciseList.tsx` |
| 8 | Exercise mood filters | `GET /exercises/mood-filters` | 🟡 P2 | `ExerciseList.tsx` |
| 9 | Mood check-in factors | `GET /mood/factors` | ⚪ P3 | `MoodCheckIn.tsx` |
| 10 | Profile stats — exercises completed | `GET /user/stats` | 🟡 P2 | `ProfileCard.tsx` |

---

## Notes cho BE

1. **Tất cả endpoint cần auth** (trừ `/chat/quick-prompts`, `/exercises/categories`, `/exercises/mood-filters` — public data).

2. **Healing path** (mục 1.4) cần thiết kế data model trước vì nó liên quan đến user progress tracking — recommend align với FE trước khi implement.

3. **Profile stats** (mục 10): FE đang hiển thị "Streak hiện tại" từ `GET /dashboard` (đã có). Chỉ cần thêm `exercises_completed` nếu muốn hiện số bài tập hoàn thành. Có thể gộp vào response của `/dashboard` hoặc tạo endpoint riêng.

4. **P3 items** có thể giữ hardcode vô thời hạn nếu không có nhu cầu admin customization — chỉ cần khi muốn quản lý content từ CMS/admin panel.
