# ScentFlow CRM

Perfume CRM SaaS dashboard (Next.js App Router + Supabase Auth + Prisma/Postgres).

## Stack

- Next.js 15 (App Router), TypeScript, TailwindCSS
- Supabase Auth (SSR via `@supabase/ssr`)
- Prisma ORM + PostgreSQL
- TanStack Query, Zustand, React Hook Form + Zod, Framer Motion, Recharts

## Local Setup

```bash
cp .env.example .env.local
npm install
```

### Supabase Setup

1. Create a Supabase project.
2. In Supabase → Project Settings → API:
   - Set `NEXT_PUBLIC_SUPABASE_URL`
   - Set `NEXT_PUBLIC_SUPABASE_ANON_KEY`
3. In Supabase → Authentication → URL Configuration:
   - Set Site URL to `http://localhost:3000`
   - Add Redirect URLs:
     - `http://localhost:3000/auth/callback`
     - `http://localhost:3000/reset-password`

### Database Setup (Postgres + Prisma)

1. Create a Postgres database (Supabase Postgres is fine).
2. Set `DATABASE_URL` in `.env.local`.
3. Run migrations:

```bash
npx prisma migrate dev
npx prisma generate
```

## Run

```bash
npm run dev
```

Open http://localhost:3000 (redirects to `/dashboard` after login).

## Deploy (Vercel)

1. Push this repo to GitHub.
2. Create a new Vercel project: https://vercel.com?utm_source=chatgpt.com
3. Add Environment Variables (Vercel → Project → Settings → Environment Variables):
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `DATABASE_URL`
4. Deploy.

## Code Guidelines

See `docs/CODE_GUIDELINES.md`.
