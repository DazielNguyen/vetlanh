# OC1 — Vết Lành Web Application
## Overview, Core Functions & System Report

**Version:** 1.0  
**Date:** 2026-06-23  
**Project:** Vết Lành — Mental Health Support Platform  
**Production:** https://vetlanh.io.vn

---

## 1. Business Value

Vết Lành is a Vietnamese mental health web application that provides accessible, private, and affordable psychological support to individuals who may not have access to professional therapy. The platform bridges the gap between self-help tools and clinical care by combining AI-powered conversation, structured psychological exercises, and progress tracking in a single, guided experience.

**Core value propositions:**

| Value | Description |
|---|---|
| **Accessibility** | Available 24/7, no appointment needed, works on any device |
| **Affordability** | Free tier with meaningful features; Pro from 79,000 ₫/month |
| **Privacy** | Anonymous community participation, personal data stays with the user |
| **Continuity** | Progress, journal entries, and safety plans persist across sessions |
| **Localization** | Entirely in Vietnamese — content, UI, and payment are tailored for the Vietnamese market |

**Revenue model:** Freemium subscription — users start free and upgrade to Pro to unlock unlimited AI chat, full exercise library, advanced mood tracking, and personalized healing journeys.

---

## 2. Core Features

### 2.1 AI Chat (Trò chuyện AI)
Route: `/services/chat`

Real-time streaming conversation with an AI mental health companion. Responses stream token-by-token using Server-Sent Events for a natural conversational feel. The system auto-creates a conversation on first message. Previous conversations are stored and selectable. The **Live Insights** panel surfaces observations alongside the chat in real time.

- Free tier: limited messages per day
- Pro tier: unlimited conversations

### 2.2 Mood Check-In (Theo dõi cảm xúc)
Route: `/services/mood`

Daily emotional check-in with:
- Mood rating (emoji scale)
- Energy level (Low / Medium / High)
- Contributing factor tags (sleep, work, relationships, etc.)
- Free-text note / journal entry
- Visual mood trend chart over time

Data feeds into the dashboard summary card and long-term trend analytics for Pro users.

### 2.2a Proactive AI Check-Ins (Nhắc nhở chủ động)

Real-time AI-initiated wellness check-ins delivered as a global floating card, mounted app-wide and accessible from any page. When the backend triggers a check-in (based on configured conditions like "3 days without mood entry" or "worsening PHQ-9 trend"), a dismissible card appears with the companion in its empathetic state, showing a personalized message. Users can tap to open chat or dismiss. Check-ins missed while offline are recovered on next app mount via a one-shot pending-fetch (no polling). Dismissed check-ins are tracked server-side and do not reappear.

- Receives check-ins via realtime hub event (SignalR `ReceiveProactiveCheckIn`)
- Recovers missed check-ins on app mount via REST catch-up fetch
- Non-intrusive, dismissible design — never forces a modal
- Integration with companion mascot in empathetic state

### 2.3 PHQ-9 Depression Assessment (Đánh giá)
Route: `/services/assessment`

Standardized PHQ-9 questionnaire (9 questions, 0–3 scale per question). Draft answers are auto-saved to `localStorage` so users can resume mid-way. On submission, the backend scores the result and returns a severity level. Results are stored for historical comparison.

### 2.4 Psychological Exercises (Bài tập tâm lý)
Route: `/services/exercises`

A library of guided exercises across four categories:
- **Breathing** — paced breathing techniques
- **Meditation** — guided mindfulness sessions
- **Grounding** — 5-4-3-2-1 sensory techniques
- **Relaxation / PMR** — progressive muscle relaxation

Each exercise has a title, duration, category, and embedded audio/instruction content. The dashboard surfaces the top 3 recommended exercises for quick access.

### 2.5 Ambient Sounds (Âm thanh)
Route: `/services/sounds`

Curated library of ambient audio tracks (nature, meditation music, white noise). Files are hosted on Cloudinary and streamed directly. Users can loop sounds during exercises or journaling sessions.

### 2.6 Journal & Thought Records
Routes: `/services/journal`, `/services/thought-records`

- **Journal:** Free-form daily writing with date-organized entries. Supports rich text input. Private and encrypted per user.
- **Thought Records (CBT):** Structured Cognitive Behavioral Therapy worksheet — users log a negative thought, identify the distortion type, and reframe it into a balanced perspective. Users can complete via a static form or a guided conversational flow (scripted companion assistant).

### 2.7 Safety Plan (Kế hoạch an toàn)
Route: `/services/safety-plan`

A structured crisis safety plan with four editable sections:
1. Warning signs (dấu hiệu cảnh báo)
2. Coping activities (hoạt động đối phó)
3. Trusted contacts with phone numbers (name + phone pairs)
4. Reasons to live

Users can complete via a static form or a guided conversational flow (scripted companion assistant). Data is persisted per user via upsert — one plan per account, always editable. Partial answers in the guided flow are auto-saved as drafts. The dashboard surfaces a separate **Crisis Resources** button at all times for immediate access.

### 2.8 Content Library (Thư viện)
Route: `/services/library`

Curated articles, guides, and educational content on mental health topics. Admin-managed. Accessible from the dashboard.

### 2.9 Subscription / Upgrade (Nâng cấp Pro)
Route: `/services/upgrade`

Manual bank transfer payment flow:
1. User selects a package
2. System generates a VietQR QR code with the exact transfer amount and auto-filled reference code
3. User uploads proof of payment (bill screenshot, max 10 MB)
4. Admin reviews and activates Pro status manually

**Pricing table:**

| Package | Price | Notes |
|---|---|---|
| 1 month | 79,000 ₫ | — |
| 3 months | 199,000 ₫ | ~66,000 ₫/month |
| 6 months | 349,000 ₫ | ~58,000 ₫/month |
| 1 year | 599,000 ₫ | Recommended |
| Lifetime | 999,000 ₫ | Most popular |

**Pro features unlocked:**
- Unlimited AI chat
- Personalized healing journey
- Full exercise library
- Advanced mood charts
- Journal & thought records history
- Priority technical support

---

## 3. User Flow

### 3.1 Onboarding Flow

```
Landing Page (/)
  ├── "Đăng ký ngay" → /register
  │     ├── Fill form (name, email/username, password)
  │     ├── Submit → verify-pending page (email sent)
  │     └── Click email link → /verify → auto-login → /services
  └── "Đăng nhập" → /login
        └── Auth success → /services (dashboard)
```

### 3.2 Main User Journey (Free tier)

```
/services (Dashboard)
  ├── Quick Mood Check-In widget → /services/mood
  ├── PHQ-9 reminder banner → /services/assessment
  ├── Quick Relief exercises → /services/exercises/{slug}
  ├── AI Chat shortcut → /services/chat
  ├── Crisis Resources button (always visible)
  └── Sidebar navigation:
        ├── Trang chủ → /services
        ├── Trò chuyện → /services/chat
        ├── Bài tập → /services/exercises
        ├── Âm thanh → /services/sounds
        ├── Thư viện → /services/library
        ├── Hồ sơ → /services/profile
        └── Cài đặt → /services/settings
```

### 3.3 Upgrade Flow

```
/services (Dashboard)
  └── ProUpgradeCard → /services/upgrade?package=1nam
        ├── Select package (1m / 3m / 6m / 1y / Lifetime)
        ├── Copy bank details + scan VietQR
        ├── Make bank transfer
        ├── Upload payment screenshot
        └── Submit → pending review
              └── Admin activates → user receives Pro status
```

### 3.4 Profile & Settings Flow

```
/services/settings
  ├── Thông tin cá nhân (display name)
  ├── Xác minh email
  │     └── No email → inline add-email form
  │           └── Submit → /verify-pending (email sent)
  ├── Đổi mật khẩu (current + new password)
  └── Upload avatar (multipart/form-data)

/services/profile
  └── View subscription status, expiry date, account details
```

### 3.5 Email Change Flow

```
Settings → Đổi email
  ├── Enter new email + current password
  ├── Submit → /verify-pending?email={new_email}
  ├── User clicks link in new email → /verify-email-change?token=
  └── Token verified → JWT invalidated → auto-logout → /login
```

---

## 4. Admin Flow

All admin routes are under `/admin` with a separate authentication layer.

### 4.1 Admin Dashboard (`/admin/dashboard`)

Real-time overview of platform health:
- **Total users** registered
- **Active subscriptions** count
- **Revenue** summary
- **Pending subscription requests** (awaiting manual activation)
- **Recent errors** reported by users
- **Subscription activity chart** (7-day bar chart)

### 4.2 User Management (`/admin/users`)

- Paginated user list (20 per page) with search by name/email
- Displays: display name, email, account type (email / Google), subscription status (Free / Pro / Expired), registration date
- Actions: **Delete user** (with confirmation modal)

### 4.3 Subscription Management (`/admin/subscriptions`)

Two tabs:
- **Pending** — payment submissions awaiting review; admin can Approve or Reject with one click
- **Active** — all current Pro subscribers with expiry dates

### 4.4 Sound Management (`/admin/sounds`)

- View all sounds with title, category, duration, upload status
- **Add sound** — two-step process:
  1. Create DB record (title, category, metadata)
  2. Upload audio file directly to Cloudinary; backend receives `audio_url` + `cloudinary_public_id` via PATCH
- **Re-upload** — replace audio file for existing sound
- **Toggle publish** — show/hide a sound from users
- **Delete** — permanently remove sound and record

### 4.5 Library Management (`/admin/library`)

Create, edit, and delete content library articles. Controls what appears in `/services/library`.

### 4.6 Error Reports (`/admin/errors`)

System error log — users can submit bug reports from the app. Admin reviews, triages by severity (HIGH / MEDIUM / LOW).

---

## 5. Deployment & System Architecture

### 5.1 Frontend

| Item | Detail |
|---|---|
| Framework | Next.js 16 (App Router, React 19) |
| Language | TypeScript |
| Styling | Tailwind CSS v4 |
| UI Components | shadcn/ui (Radix primitives) |
| State / Cache | React Query v5 (`staleTime: 5min`, `gcTime: 30min`) |
| Animation | Motion (Framer Motion v11+) |
| Hosting | Vercel (auto-deploy on push to `main`) |

### 5.2 External Services

| Service | Purpose |
|---|---|
| **Cloudinary** | Audio file storage and streaming for ambient sounds; direct browser upload via signed upload URL |
| **VietQR** | Dynamic QR code generation for bank transfers (`img.vietqr.io`) |
| **AWS CloudFront** | CDN for static assets |
| **UploadThing** | File upload infrastructure (avatars, payment bills) |

### 5.3 Authentication

- JWT-based authentication (Bearer token in `Authorization` header)
- Supports: email/password, Google OAuth
- Email verification required on registration
- Email change triggers JWT invalidation → forced logout
- Password change does NOT invalidate JWT session

### 5.4 API Design

| Pattern | Detail |
|---|---|
| Base URL | `api/v1/` |
| Auth | `Authorization: Bearer <token>` on all protected routes |
| Error format | `{ "detail": "message" }` |
| Rate limits | change-password: 5/min · avatar upload: 10/min · email-change: 3/hr |

Key endpoint groups:
- `api/v1/users/me` — profile read/update
- `api/v1/auth/*` — login, register, verify, change-password
- `api/v1/sounds` — sound library CRUD
- `api/v1/exercises` — exercise library
- `api/v1/conversations` — AI chat sessions
- `api/v1/moods` — mood entries
- `api/v1/phq9` — assessment questions and submission
- `api/v1/safety-plan` — upsert safety plan
- `api/v1/subscriptions` — subscription requests
- `api/v1/checkins` — proactive wellness check-ins (pending fetch, dismiss tracking)
- `POST /hubs/app` (SignalR) — realtime events including `ReceiveProactiveCheckIn`

### 5.5 Theme System

| Mode | Background | Primary | Sidebar |
|---|---|---|---|
| Light (services) | `#FEF9F2` (warm cream) | `#789dbc` (steel blue) | `rgb(255,224,197)` (peach) |
| Dark | `#0b0f0d` (charcoal) | `#10b981` (emerald) | `rgba(11,15,13,0.85)` |

Theme is toggled via `next-themes` — stored in `localStorage`, applied as `.dark` class on `<html>`.

### 5.6 Deployment Pipeline

```
Developer pushes to main
  └── Vercel auto-detects push
        ├── Build: next build
        ├── Type-check: tsc --noEmit
        └── Deploy to production (vetlanh.io.vn)
```

No staging environment currently — all pushes go directly to production. Each commit follows Conventional Commits format (`feat/fix/perf/refactor`).

---

## 6. Summary

Vết Lành is a focused, production-grade mental health platform built for the Vietnamese market. It covers the full spectrum from anonymous self-help (mood tracking, exercises, sounds) to structured clinical tools (PHQ-9, CBT thought records, safety planning) and AI-assisted support. The freemium model ensures accessibility while the Pro tier funds ongoing development. The admin system gives the team full visibility into users, subscriptions, content, and errors without requiring direct database access.
