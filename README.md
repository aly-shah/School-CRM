# EduCRM 360 — School Management System

A full school CRM built with **Next.js (App Router)** and **PostgreSQL**. It ships **8 role-based portals** — Admin, Principal, Teacher, Parent, Student, Finance, Driver, Staff — each with its own navigation, accent colour, and features, selected from a landing portal switcher.

## Features

- **Admin** — dashboard, admissions (kanban), students (add + 360° profile with photo & printable ID card), staff, fees, attendance (mark / history / monthly CSV report), exams, **timetable manager** (per-class, editable), **library & inventory**, parents, reports
- **Teacher** — attendance, gradebook, **quiz builder**, homework with file attachments, **certificates**, parent chat, timetable
- **Student** — timetable, submit homework, take auto-graded quizzes, results, certificates, attendance
- **Parent** — child overview, **online fee payment** + printable voucher, results, homework, certificates, chat, events calendar, **live bus tracking**, notices (login: roll number + admin-assigned password)
- **Finance** — collections, fee vouchers, defaulters, expenses, payroll
- **Driver** — route, animated live map, pickup manifest, alerts, vehicle checklist
- **Principal / Staff** — school KPIs & approvals / leave, payslips, directory
- **Scoped notifications** — student events reach only that student & parent; staff portals see only what's relevant to them

## Tech

- Next.js 14, React 18, plain CSS design system (light theme, collapsible sidebar)
- PostgreSQL via `pg` (node-postgres); REST route handlers under `app/api/*`
- Data model in `db/schema.sql`

## Getting started

```bash
cd educrm-app
npm install
cp .env.example .env.local          # adjust DATABASE_URL if needed
npm run dev                          # http://localhost:3000
```

### Database

A helper starts a **user-owned** Postgres cluster (no sudo) on port 5433:

```bash
./db/db.sh start        # start the local cluster
./db/db.sh status       # health
./db/db.sh psql         # SQL shell
```

Then create the schema + seed demo data:

```bash
curl -X POST http://localhost:3000/api/dev/seed
```

Demo parent login → roll **12**, password **ayaan2025** (or set one from Admin → Students → a student's profile).

## Deploy to a VPS (Ubuntu/Debian)

One script sets up **Node, PostgreSQL, Nginx, PM2 and a Let's Encrypt SSL cert** and makes the site live.

1. Point your domain's **DNS A-record** at the server's IP.
2. On the server:

```bash
git clone https://github.com/aly-shah/School-CRM.git
cd School-CRM
sudo DOMAIN=crm.yourdomain.com EMAIL=you@yourdomain.com bash deploy.sh
```

That's it — it installs everything, creates a password-protected Postgres database, builds the app, runs it under PM2, configures Nginx as a reverse proxy, and issues HTTPS. Secrets (DB password, seed secret) are written to `educrm-app/.env.local`.

**Redeploy / update:** `git pull && sudo bash deploy.sh`
**Useful:** `pm2 status`, `pm2 logs educrm`

Options (env vars): `DB_NAME`, `DB_USER`, `DB_PASS`, `APP_PORT`, `DO_SSL=no`, `DO_SEED=no`.

## Android app

A native **WebView wrapper** (`android-app/`) packages the deployed site into an installable APK — so it has *every* CRM feature automatically, plus file uploads and GPS.

- **GitHub Actions** (`.github/workflows/android.yml`) builds the APK on each push and publishes it to the **`app-latest`** release.
- The site serves **`/app.apk`** (redirects to that release asset) and a friendly install page at **`/download`**.
- So users just visit **`https://school.scalamatic.com/app.apk`** (or `/download`) to get the app.

To point the app at a different domain, edit `app_url` in `android-app/app/src/main/res/values/strings.xml`.
Requires the repo to be **public** (so the release asset is downloadable).

## Structure

```
educrm-app/
  app/            route per page + app/api/* (Postgres-backed endpoints)
  components/     PortalShell, NotificationBell, ui, icons
  modules/        reusable feature modules composed by portal pages
  lib/            db (pg pool), store (client API wrapper), data (reference data), portals (registry)
  db/             schema.sql, db.sh
```
