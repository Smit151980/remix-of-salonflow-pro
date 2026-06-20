
# Salon Management System — Build Plan

You asked for "all functionality." Honestly: this spec is ~3–6 months of work for a team. I can't ship 20+ production modules in one turn without it being broken. I'll build it in phases, each phase fully working and shippable. Confirm and I'll start Phase 1 immediately.

## Confirmed decisions

- **Single-tenant** (one salon). Multi-tenant deferred.
- **Sign-in only** (no public sign-up). Admin seeds users via Lovable Cloud → Users.
- **WhatsApp**: Meta Cloud API wired in Phase 5. Stripe/Razorpay deferred.
- **Stack**: TanStack Start + Lovable Cloud (Supabase under the hood) + Tailwind + shadcn. (Zustand/FullCalendar swapped to TanStack Query + a custom calendar — fewer moving parts on this stack; behaviour is the same.)

## Phase 1 — Foundation (this turn)

1. Enable Lovable Cloud.
2. Design system: modern SaaS dark+light theme, semantic tokens, typography.
3. Auth: sign-in only page (`/auth`), `_authenticated` gate, sign-out.
4. RBAC: `app_role` enum (`super_admin`, `owner`, `receptionist`, `staff`), `user_roles` table, `has_role()` security-definer function.
5. App shell: sidebar nav, topbar, role-aware menu, dark mode toggle.
6. DB schema (all core tables, RLS, grants):
   `profiles, user_roles, branches, services, service_categories, staff, customers, appointments, appointment_services, invoices, invoice_items, payments, products, vendors, stock_movements, memberships, customer_memberships, packages, loyalty_points, whatsapp_templates, whatsapp_campaigns, campaign_recipients, notifications, audit_logs`.
7. Dashboard page with KPI cards + Recharts (revenue trend, appointments trend) wired to real queries (empty state until data exists).
8. Stub routes for: Appointments, Calendar, Customers, Staff, Services, Inventory, POS, Marketing, Reports, Settings.

## Phase 2 — Core CRUD

Branches · Services (+ categories) · Staff (+ skills, hours, weekly off) · Customers (+ timeline). Reusable DataTable with checkbox bulk actions (delete, export CSV, send WhatsApp, update status).

## Phase 3 — Appointments & Calendar

Day/Week/Month calendar, drag-to-reschedule, status workflow (Booked → … → Completed/No-show), staff assignment, conflict detection.

## Phase 4 — POS, Inventory, Memberships

Invoice builder (services + products + discounts + tax + split payment), invoice PDF, stock movements + low-stock alerts, membership/package sales + redemption, loyalty point accrual/redemption + Silver/Gold/Platinum tiers.

## Phase 5 — WhatsApp Automation

Meta Cloud API via secure server functions. Template manager. Automatic triggers (booking confirm, 24h/2h reminders via pg_cron, completion thank-you, birthday/anniversary, membership/package expiry, payment receipt, feedback request). Bulk campaign sender with audience filters + queue + delivery/read status webhooks at `/api/public/whatsapp/webhook`.

## Phase 6 — Marketing, Reports, Online Booking, AI

Campaign builder (WhatsApp/Email), audience filters, analytics. Reports (revenue, staff perf, retention, GST) with PDF/Excel/CSV export. Public booking site at `/book` (service → staff → date → time → confirmation). AI assistant panel using Lovable AI Gateway for revenue insights, retention analysis, suggested campaigns.

## Technical details

- Audit log trigger on writes to sensitive tables.
- All policies via `has_role(auth.uid(), 'role')` to avoid recursion.
- WhatsApp send via `createServerFn` + connector gateway pattern; webhook is a public TSS route with signature verification.
- pg_cron schedules reminder dispatch every 15 min.
- No service-role keys in client code; admin ops loaded inside `.handler()`.

## What I need from you

Just say **"go"** and I'll execute Phase 1 now (enable Cloud, design system, auth, RBAC, full schema, dashboard, app shell). Each later phase is a one-message ask: "do phase 2", etc.

If you want me to compress (e.g. skip dark mode, skip AI, skip online booking), tell me now.
