# BE API Requirements — Settings Page

**Date:** 2026-06-22  
**Requested by:** FE Team  
**Status:** ✅ All endpoints confirmed implemented by BE (2026-06-22)  
**Context:** Settings page at `/services/settings` currently has stub UI for personal info, security, and avatar upload. BE endpoints are now live — FE can implement.

---

## Existing Endpoints (already available)

| Method | Endpoint | Used for |
|--------|----------|----------|
| `PATCH` | `api/v1/users/me` | Update `display_name`, `avatar_url` (URL string), `timezone` |
| `GET` | `api/v1/users/me` | Fetch current user profile |

The FE `UpdateProfileRequest` type currently accepts:
```typescript
{
  display_name?: string;
  avatar_url?: string;   // URL string, not file
  timezone?: string;
}
```

---

## New Endpoints Required

### 1. Change Password

**Endpoint:** `POST api/v1/auth/change-password`  
**Auth:** Required (Bearer token)

**Request body:**
```json
{
  "current_password": "string",
  "new_password": "string"
}
```

**Response (200 OK):**
```json
{
  "message": "Mật khẩu đã được cập nhật thành công."
}
```

**Error cases:**
- `400` — `current_password` incorrect → `{ "detail": "Mật khẩu hiện tại không đúng." }`
- `400` — `new_password` same as current → `{ "detail": "Mật khẩu mới không được trùng với mật khẩu hiện tại." }`
- `400` — `new_password` too short (< 8 chars) → `{ "detail": "Mật khẩu phải có ít nhất 8 ký tự." }`
- `401` — Unauthorized

**Rate limit:** 5 requests/minute per IP → `429 Too Many Requests`

**FE notes:**
- FE will show a form with 3 fields: current password, new password, confirm new password
- Confirm field is validated client-side only (not sent to BE)
- ✅ Confirmed: BE does NOT invalidate JWT after password change — session stays active

---

### 2. Change Email

**Endpoint:** `PATCH api/v1/users/me/email`  
**Auth:** Required (Bearer token)

**Request body:**
```json
{
  "new_email": "string",
  "current_password": "string"
}
```

**Response (200 OK):**
```json
{
  "message": "Email xác thực đã được gửi đến địa chỉ mới của bạn."
}
```

**Expected flow:**
1. User submits new email + current password
2. BE validates password, sends verification email to `new_email`
3. FE redirects user to `/verify-pending?email={new_email}`
4. User clicks link in email → FE calls `GET api/v1/auth/verify-email-change?token=<token>` (separate endpoint from registration verify)
5. ⚠️ After verify: JWT containing old email becomes invalid — BE will return `401` on `GET /users/me`
6. FE must detect `401` on user fetch → clear auth state → redirect to `/login`

**Error cases:**
- `400` — `current_password` incorrect → `{ "detail": "Mật khẩu không đúng." }`
- `400` — `new_email` already registered → `{ "detail": "Email này đã được sử dụng bởi tài khoản khác." }`
- `400` — `new_email` same as current → `{ "detail": "Email mới không được trùng với email hiện tại." }`
- `401` — Unauthorized
- `429` — Rate limit (3 requests/hour per IP)

**FE notes:**
- ✅ Confirmed: uses `GET api/v1/auth/verify-email-change?token=` — NOT the same as `api/v1/auth/verify`
- FE needs to create a new page `/verify-email-change` to handle this token
- ✅ Confirmed: JWT is invalidated after email-change verify → FE must handle 401 → logout + redirect `/login`

---

### 3. Upload Avatar

**Endpoint:** `POST api/v1/users/me/avatar`  
**Auth:** Required (Bearer token)  
**Content-Type:** `multipart/form-data`

**Request:**
```
Form field: "file" — image file (jpg, png, webp)
Max size: 5MB
```

**Response (200 OK):**
```json
{
  "avatar_url": "https://cdn.example.com/avatars/user-123.jpg"
}
```

**Expected flow:**
1. FE uploads file → BE stores it atomically and updates `avatar_url` on user record
2. FE invalidates React Query cache `["user", "me"]` → ProfileCard re-renders with new avatar
3. ✅ Confirmed: NO separate `PATCH api/v1/users/me` call needed after upload

**Error cases:**
- `400` — file not an image → `{ "detail": "Chỉ chấp nhận file ảnh (jpg, png, webp)." }`
- `413` — file too large (> 5MB) → `413 Request Entity Too Large` ← note: 413 not 400
- `401` — Unauthorized
- `429` — Rate limit (10 requests/minute per IP)

**FE notes:**
- ✅ Confirmed: atomic update — invalidate `["user", "me"]` only, no second PATCH needed
- FE will handle image preview before upload (FileReader API, client-side only)
- FE must handle `413` explicitly with message "Kích thước file không được vượt quá 5MB."

---

## Summary Table

| Endpoint | Method | Priority | Complexity |
|----------|--------|----------|------------|
| `api/v1/auth/change-password` | POST | High | Low |
| `api/v1/users/me/email` | PATCH | Medium | Medium (verify flow) |
| `api/v1/users/me/avatar` | POST | Medium | Medium (file storage) |

**Recommended implementation order:** change-password first (no side effects), then avatar upload, then email change (most complex due to re-verify flow).

---

## Confirmed Answers from BE (2026-06-22)

| Question | Answer |
|----------|--------|
| Email verify endpoint | `GET api/v1/auth/verify-email-change?token=` — separate from `/auth/verify` |
| Avatar atomic update | Yes — BE updates `avatar_url` on DB. FE only needs to invalidate `["user", "me"]` |
| Post-password-change session | JWT stays valid. No forced logout |
| Post-email-change session | JWT becomes invalid after verify. FE must handle `401` → logout + redirect `/login` |
| Avatar 413 vs 400 | 413 Request Entity Too Large (not 400) for file > 5MB |
| Rate limits | change-password: 5/min · avatar: 10/min · email-change: 3/hr (all 429 on exceed) |
