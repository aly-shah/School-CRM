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

## Structure

```
educrm-app/
  app/            route per page + app/api/* (Postgres-backed endpoints)
  components/     PortalShell, NotificationBell, ui, icons
  modules/        reusable feature modules composed by portal pages
  lib/            db (pg pool), store (client API wrapper), data (reference data), portals (registry)
  db/             schema.sql, db.sh
```
