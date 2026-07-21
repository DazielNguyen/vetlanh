# BE API Requirements — Proactive AI Check-Ins

**Date:** 2026-07-21  
**Context:** Phase 5 of gaming-companion-redesign — frontend displays proactive wellness check-in cards delivered from backend. These endpoints + hub event enable realtime nudges with missed-delivery recovery.  
**Frontend Status:** ✅ Frontend component (`ProactiveCheckInCard`) and hooks (`useCheckIns`) are implemented and ready to test against mocked events. **Backend implementation required** for full end-to-end verification.

---

## Overview

The frontend displays proactive AI check-ins (wellness nudges) as a global floating card, reachable from any page. Backend triggers a check-in based on conditions (e.g., "3 days without mood entry", "worsening PHQ-9 trend") and pushes it via two channels:

1. **Live delivery via SignalR** — for users actively connected
2. **One-shot REST catch-up** — for users who were offline when the check-in was broadcast

This design ensures no check-in is lost while avoiding polling, and provides a frictionless dismiss mechanism.

---

## SignalR Hub Event (Realtime)

### Event Name
`ReceiveProactiveCheckIn`

### Hub Path
Existing hub: `/hubs/app` (same hub as `ReceiveNotification`, `ReceiveMessage`, etc.)

### Payload
```json
{
  "id": "string",                    // Unique check-in ID (UUID recommended)
  "message": "string",               // Personalized check-in message (e.g., "Haven't seen you in a few days...")
  "trigger_reason": "string|null",   // Optional: reason for the check-in (e.g., "mood_gap", "phq9_decline")
  "created_at": "string"             // ISO 8601 timestamp when check-in was created
}
```

### Example
```json
{
  "id": "checkin-550e8400-e29b-41d4-a716-446655440000",
  "message": "Hey! Bạn chưa cập nhật tâm trạng trong 3 ngày. Hôm nay bạn cảm thấy thế nào?",
  "trigger_reason": "mood_gap",
  "created_at": "2026-07-21T14:30:00Z"
}
```

### Lifecycle
- Hub sends event to a connected user when backend trigger logic decides to nudge them
- Frontend listens with `SignalRContext.on("ReceiveProactiveCheckIn", ...)` (same pattern as existing hub events in `hooks/useSignalRNotifications.ts`)
- Frontend stores the event in memory and displays the card globally
- User can dismiss (fires `POST /api/v1/checkins/{id}/dismiss`) or tap to navigate to chat

---

## REST Endpoint 1: Fetch Pending Check-Ins (One-Shot)

### Endpoint
**`GET /api/v1/checkins/pending`**

### Auth
Required (Bearer token)

### Purpose
Called exactly once per app session (on app mount), returns all check-ins sent to the user that have not yet been dismissed. This allows users who were offline during the SignalR broadcast to see the check-in when they return.

### Response (200 OK)
```json
[
  {
    "id": "string",
    "message": "string",
    "trigger_reason": "string|null",
    "created_at": "string"
  }
]
```

### Example
```json
[
  {
    "id": "checkin-550e8400-e29b-41d4-a716-446655440000",
    "message": "Bạn có muốn nói chuyện về những gì đang xảy ra không?",
    "trigger_reason": "phq9_decline",
    "created_at": "2026-07-21T10:00:00Z"
  }
]
```

### Error Cases
- `401` — Unauthorized (invalid/expired token)

### Frontend Notes
- Called with React Query `staleTime: Infinity` and no `refetchInterval` — this is a **one-shot fetch**, not polling
- Frontend displays any items returned as cards in the same global card component
- Query is initiated by `hooks/useCheckIns.ts` on app mount (`useEffect` with dependency `[]`)
- Server must exclude any check-in where `dismissed` is true for the current user (see endpoint 2)

---

## REST Endpoint 2: Dismiss Check-In

### Endpoint
**`POST /api/v1/checkins/{id}/dismiss`**

### Auth
Required (Bearer token)

### Path Parameters
- `{id}` — check-in ID (string, matches `ProactiveCheckIn.id`)

### Request Body
Empty or minimal (no request body required)

### Response (200 OK)
```json
{
  "message": "Check-in dismissed."
}
```

### Purpose
Marks a check-in as dismissed for the current user server-side. This dismissal must be **persistent** — future calls to `GET /api/v1/checkins/pending` must exclude the dismissed check-in, so re-fetching on a later app mount does not resurrect it.

### Error Cases
- `404` — check-in ID not found or not owned by current user
- `401` — Unauthorized

### Frontend Notes
- Called **optimistically** — frontend hides the card immediately on user tap (no loading state, no await)
- Request fires in the background (async, no error boundary)
- On network failure: logged to console only, not surfaced to user (because worst-case is the check-in reappears on next session, which is acceptable)
- Frontend does NOT wait for this response before closing the card

---

## Implementation Checklist

### Backend Tasks
- [ ] Add new table `proactive_check_ins` or similar with columns:
  - `id` (PK, UUID)
  - `user_id` (FK to user)
  - `message` (text)
  - `trigger_reason` (text, nullable)
  - `created_at` (timestamp)
  - `dismissed_at` (timestamp, nullable) — tracks when user dismissed

- [ ] Implement trigger logic (out of this phase, but examples):
  - Detect "no mood entry for 3+ days" → create and broadcast a check-in
  - Detect "PHQ-9 score worsened since last assessment" → create and broadcast a check-in

- [ ] Implement `GET /api/v1/checkins/pending`:
  - Returns only items where `dismissed_at IS NULL` for the current user
  - Sorted by `created_at DESC`

- [ ] Implement `POST /api/v1/checkins/{id}/dismiss`:
  - Set `dismissed_at = NOW()` for the given check-in
  - Verify check-in belongs to current user (401 or 404 if not)

- [ ] Add `ReceiveProactiveCheckIn` event to SignalR hub `/hubs/app`:
  - Fired by backend when a new check-in is created for a currently-connected user
  - Payload matches the schema above
  - Use same `.SendAsync("ReceiveProactiveCheckIn", payload)` pattern as other hub events

- [ ] Rate limiting (optional but recommended):
  - Prevent dismiss endpoint abuse (e.g., 100/min per user or IP)

---

## Testing Notes for FE Team

Until backend implements these endpoints/events:

1. **For hub event:** Use browser DevTools console to manually dispatch a mock event:
   ```javascript
   // Example: simulate receiving a check-in via hub
   window.__signalRConnection?.invoke("ReceiveProactiveCheckIn", {
     id: "test-123",
     message: "Test check-in message",
     trigger_reason: "test",
     created_at: new Date().toISOString()
   });
   ```

2. **For REST endpoints:** Mock with React Query `msw` or Vitest stubs in test files (already done in `hooks/useCheckIns.ts` tests).

3. **Integration test:** Once backend ships, coordinate with backend team to:
   - Manually trigger a check-in from admin backend
   - Verify it appears in frontend via hub event
   - Close/reopen app and verify `GET /api/v1/checkins/pending` recovers it
   - Dismiss and verify it doesn't reappear on next session

---

## Confirmed Specifications

| Item | Value |
|------|-------|
| Hub event name | `ReceiveProactiveCheckIn` |
| Hub path | `/hubs/app` |
| Pending-fetch endpoint | `GET /api/v1/checkins/pending` |
| Dismiss endpoint | `POST /api/v1/checkins/{id}/dismiss` |
| Fetch strategy | One-shot on app mount, no polling |
| Dismiss timing | Optimistic (frontend closes immediately) |
| Dismiss error handling | Silent (log only, not surfaced to user) |
| Storage of dismissal | Server-side persistent (excluded from future pending-GET) |
