# Sana's Sweet Bakery

A bilingual (Dutch/English) brochure website for Sana's Sweet Bakery (formerly Bakkerij Oued Fes), built with Next.js, Supabase, and Framer Motion.

## Features

- Public site with modern Moroccan design and scroll animations
- Bilingual routes: `/nl` and `/en`
- Dynamic menu with categories and items (image, description, price)
- Opening hours with special-date overrides (holidays, etc.)
- Password-protected admin panel at `/admin`

## Getting started

### 1. Install dependencies

```bash
npm install
```

### 2. Set up Supabase

1. Create a project at [supabase.com](https://supabase.com)
2. Run the SQL migration in [`supabase/migrations/001_initial.sql`](supabase/migrations/001_initial.sql) via the Supabase SQL editor
3. Create a **public** storage bucket named `menu-images`
4. Copy `.env.local.example` to `.env.local` and fill in your values:

```
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=
SUPABASE_SERVICE_ROLE_KEY=
ADMIN_PASSWORD=your-secure-password
SESSION_SECRET=generate-a-long-random-string
```

### 3. Run locally

```bash
npm run dev
```

- Public site: [http://localhost:3000/nl](http://localhost:3000/nl)
- Admin: [http://localhost:3000/admin/login](http://localhost:3000/admin/login)

Without Supabase configured, the public site uses built-in fallback menu data.

## Admin panel

| Route | Purpose |
|-------|---------|
| `/admin/login` | Log in with `ADMIN_PASSWORD` |
| `/admin/hours` | Edit weekly hours and special dates |
| `/admin/menu` | Manage categories and menu items |

## Deploy

Deploy to [Vercel](https://vercel.com) and add all environment variables from `.env.local`.

## Tech stack

- Next.js 16 (App Router)
- TypeScript, Tailwind CSS
- next-intl (i18n)
- Supabase (Postgres + Storage)
- Framer Motion (animations)
