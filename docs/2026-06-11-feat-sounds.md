# BE Handoff: Sounds — Cloudinary Audio

> Date: 2026-06-11
> Feature: `/services/sounds`

---

## 1) Architecture

Audio files được lưu trên **Cloudinary** và serve trực tiếp từ Cloudinary CDN.
FastAPI chỉ lưu metadata + `audio_url` (Cloudinary URL) vào PostgreSQL.

```
Admin    ──POST /api/v1/admin/sounds/{id}/upload──►  FastAPI  ──► Cloudinary (upload file)
                                                                ──► PostgreSQL (lưu audio_url, cloudinary_public_id)

Browser  ──GET /api/v1/sounds──►  FastAPI  ──► PostgreSQL (trả metadata + audio_url)
         ──GET audio_url──►  Cloudinary CDN (stream file trực tiếp)
```

---

## 2) Database schema (đã tồn tại)

Migration: `a3f8c2e1d9b4_add_sounds_table`

```sql
CREATE TABLE sounds (
  id                    VARCHAR(64) PRIMARY KEY,   -- slug, vd: "stream", "rain-light"
  title                 VARCHAR(255) NOT NULL,
  description           TEXT,
  category              VARCHAR(64) NOT NULL,       -- xem enum bên dưới
  cloudinary_public_id  VARCHAR(255) NOT NULL UNIQUE,
  audio_url             TEXT NOT NULL,              -- Cloudinary secure_url
  duration_seconds      INTEGER,                   -- NULL = looping / vô tận
  sort_order            INTEGER NOT NULL DEFAULT 0,
  is_published          BOOLEAN NOT NULL DEFAULT TRUE,
  created_at            TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at            TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Enum category
-- 'nature'     → Thiên nhiên
-- 'meditation' → Thiền
-- 'music'      → Nhạc thiền
-- 'noise'      → Tiếng ồn
```

> Không có seed data — admin tạo records + upload file qua API.

---

## 3) Cloudinary config (đã có trong BE)

```python
# app/core/config.py
CLOUDINARY_CLOUD_NAME: str
CLOUDINARY_API_KEY: str
CLOUDINARY_API_SECRET: str
```

```python
# app/core/upload.py — đã implement
async def save_audio_upload(file: UploadFile, folder: str) -> tuple[str, str]:
    """Upload audio lên Cloudinary. Returns (secure_url, public_id)."""
```

Files được upload vào folder `vetlanh/sounds` trên Cloudinary.

---

## 4) API endpoints

### 4.1 List sounds

`GET /api/v1/sounds`

**Auth:** Không cần (public)

**Query params:**

| Param | Type | Default | Mô tả |
|-------|------|---------|-------|
| `category` | string | — | Filter: `nature` `meditation` `music` `noise` |

**Response:**
```json
[
  {
    "id": "stream",
    "title": "Tiếng suối rừng",
    "description": "Âm thanh dòng suối chảy nhẹ nhàng giữa rừng xanh.",
    "category": "nature",
    "duration_seconds": null,
    "sort_order": 1,
    "audio_url": "https://res.cloudinary.com/vetlanh/video/upload/vetlanh/sounds/stream.mp3"
  }
]
```

---

### 4.2 Get single sound

`GET /api/v1/sounds/{id}`

**Response:** Cùng schema như item trong list.

**Errors:**

| HTTP | Trường hợp |
|------|-----------|
| 404  | `id` không tồn tại hoặc `is_published = false` |

---

### 4.3 Create sound record (admin)

`POST /api/v1/sounds`

**Auth:** Admin token required

**Body:**
```json
{
  "id": "stream",
  "title": "Tiếng suối rừng",
  "description": "Âm thanh dòng suối chảy nhẹ nhàng giữa rừng xanh.",
  "category": "nature",
  "cloudinary_public_id": "placeholder/stream",
  "audio_url": "",
  "duration_seconds": null,
  "sort_order": 1
}
```

> Tạo record trước với `audio_url: ""`, upload file sau qua endpoint 4.4.

---

### 4.4 Upload audio file (admin) ← *cần implement*

`POST /api/v1/sounds/{id}/upload`

**Auth:** Admin token required

**Body:** `multipart/form-data`

| Field | Type | Mô tả |
|-------|------|-------|
| `file` | `UploadFile` | File `.mp3` / `.ogg` / `.wav` (max 50 MB) |

**Response:**
```json
{
  "id": "stream",
  "title": "Tiếng suối rừng",
  "audio_url": "https://res.cloudinary.com/vetlanh/video/upload/vetlanh/sounds/stream.mp3",
  ...
}
```

**Logic:**
1. Lấy sound record theo `id` — 404 nếu không tồn tại
2. Gọi `save_audio_upload(file, "vetlanh/sounds")`
3. Update `sound.audio_url` + `sound.cloudinary_public_id`
4. Return updated `SoundResponse`

**Errors:**

| HTTP | Trường hợp |
|------|-----------|
| 404 | Sound không tồn tại |
| 422 | File không phải audio |
| 422 | File vượt quá 50 MB |

---

### 4.5 Update sound metadata (admin)

`PATCH /api/v1/sounds/{id}`

**Auth:** Admin token required

**Body:** Partial — bất kỳ field nào của sound.

---

### 4.6 Delete sound (admin)

`DELETE /api/v1/sounds/{id}`

**Auth:** Admin token required

> Chỉ xóa record trong DB, không xóa file trên Cloudinary.

---

## 5) Workflow admin upload

```
1. Tạo record:
   POST /api/v1/sounds
   { "id": "stream", "title": "...", "category": "nature", ... }

2. Upload file:
   POST /api/v1/sounds/stream/upload
   form-data: file=stream.mp3

3. Verify:
   GET /api/v1/sounds/stream
   → audio_url là Cloudinary URL → FE play được ngay
```

---

## 6) FE notes

**`audio_url` là tất cả những gì FE cần:**

```tsx
const audio = new Audio(sound.audio_url);
audio.loop = sound.duration_seconds === null;  // looping nếu null
audio.play();
```

- `audio_url: ""` khi chưa upload → `new Audio("")` → silent fail, không crash UI
- `duration_seconds: null` → FE set `audio.loop = true`
- Cloudinary hỗ trợ `Range` request natively → browser tự seek

**Category mapping:**

| FE label | BE value |
|----------|---------|
| Thiên nhiên | `nature` |
| Thiền | `meditation` |
| Nhạc thiền | `music` |
| Tiếng ồn | `noise` |

---

## 7) Implementation status

| Thành phần | Trạng thái |
|-----------|-----------|
| DB migration (`sounds` table) | ✅ Done |
| `Sound` model | ✅ Done |
| `SoundResponse` schema | ✅ Done |
| `GET /api/v1/sounds` | ✅ Done |
| `GET /api/v1/sounds/{id}` | ✅ Done |
| Admin CRUD (POST/PATCH/DELETE) | ✅ Done |
| `save_audio_upload()` Cloudinary | ✅ Done |
| `POST /api/v1/admin/sounds/{id}/upload` | 🔲 To implement |
| FE swap mock → real API | 🔲 After BE live |
