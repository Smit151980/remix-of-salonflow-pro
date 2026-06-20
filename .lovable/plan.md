# Salon SaaS — Production Build Plan

Large scope shipped in phases. Each phase ends with a working app. Approve, then say **"go"** to start Phase 1.

## Phase 1 — Foundation
- Enable **Lovable Cloud** (Postgres + auth + storage + server functions).
- Auth: **login only** (email/password + Google). **No public sign-up page.** New users are created by an Owner/Manager from inside the app (Phase 2 Staff module) using a privileged server function (Auth Admin API).
- `/auth` (login), `/reset-password`. No `/signup` route.
- RBAC: `app_role` enum (`owner`, `manager`, `receptionist`, `staff`), `user_roles` table, `has_role()` security-definer fn, protected `_authenticated` layout, role-gated UI.
- `profiles` table + auto-create trigger on `auth.users` insert (covers admin-created users too).
- First Owner: created via a one-time seed migration using an email you give me.
- Replace static dashboard with real (initially empty) queries + loading/error states.

## Phase 2 — Core Salon Data
- Schema + CRUD + RLS: `service_categories`, `services`, `staff`, `staff_schedules`, `staff_leaves`, `customers`, `customer_notes`.
- Staff creation flow = admin-only server fn that creates the `auth.users` row, assigns role, and links to `staff` record.
- Customer search/filter, profile page, visit history shell, loyalty points field.
- Replace mock data on Services, Staff, Customers pages.

## Phase 3 — Appointments
- `appointments` table (status: pending/confirmed/completed/cancelled).
- Book / edit / reschedule / cancel.
- DB-level double-booking prevention (exclusion constraint on staff + time range).
- Calendar bound to real data + Supabase Realtime updates.

## Phase 4 — Products, Inventory, Billing
- `products`, `stock_movements`, low-stock alerts, stock adjustments.
- `invoices`, `invoice_items` (service + product lines), payment status, revenue calc.
- Dashboard stats become real: today/month revenue, appointment counts, customer growth, top staff.

## Phase 5 — Notifications & Realtime
- In-app notification center (Realtime), browser Notifications API, reminder cron via pg_cron → `/api/public/*` route.

## Phase 6 — WhatsApp (Meta Cloud API)
- You provide: WhatsApp Business phone number ID, permanent access token, webhook verify token (requested via secrets when we reach this phase).
- Server fns: confirmation, reminder, cancellation, invoice share, promo broadcast.
- Webhook at `/api/public/whatsapp` (signature verified) → inbound replies feed support chat.
- Requires approved Meta message templates; I'll list exact template names needed.

## Phase 7 — Reports & Polish
- Revenue / service / staff / customer / inventory reports.
- PDF (jsPDF) + Excel (xlsx) export.
- Audit log table + triggers, zod input validation, responsive QA pass.

## Technical Notes
- Stack: TanStack Start + Lovable Cloud. App logic in `createServerFn`; webhooks in `/api/public/*`.
- Every public-schema table gets explicit GRANTs + RLS + `has_role()`-scoped policies.
- No mock data left in any module after its phase completes.

## What I need from you
1. Approve plan (or ask for changes).
2. **Email address for the first Owner account** (seeded in Phase 1 migration).
3. Phase 6: have WhatsApp Business API credentials ready.

Reply **"go"** to start Phase 1.
