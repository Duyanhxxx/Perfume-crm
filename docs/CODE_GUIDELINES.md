# Code Guidelines

## Goals

- Keep server-first (Server Components, server-only data access).
- Keep UI consistent (shared primitives + tokens).
- Keep validation explicit (Zod at boundaries).
- Keep features isolated (feature-based modules).

## Naming

- Files: `kebab-case.ts(x)` for components and modules.
- Components: `PascalCase`.
- Functions: `camelCase`, verbs first (`createOrder`, `listCustomers`).
- Server actions: `*Action` suffix.
- Zod schemas: `*Schema` suffix.

## Folder Rules

- `src/app`: routing + layouts only; keep business logic out.
- `src/features/<feature>`: feature-specific UI, schemas, actions, queries.
- `src/components/ui`: reusable UI primitives.
- `src/components/app`: app shell UI (sidebar, topbar).
- `src/lib`: shared infra (auth, prisma, supabase, env).
- `src/store`: Zustand stores (UI-only state).
- `src/utils`: pure helpers (no Next/Supabase/Prisma imports).

## Server/Client Rules

- Default to Server Components.
- Add `"use client"` only when needed (forms, charts, hooks, interactivity).
- Server-only modules must import `server-only`.
- Never import client-only utilities (DOM APIs) in server modules.

## API Architecture

- Reads: server functions in `features/*/queries.ts` and used by Server Components.
- Writes: server actions in `features/*/actions.ts`.
- Keep Prisma usage inside server-only modules or server actions.

## State Management

- Use Server Components + router refresh for most CRUD flows.
- Use TanStack Query for client-side caching only when necessary (high-frequency refetch, optimistic UI).
- Use Zustand for local UI state (sidebar open, dialogs, filters that don’t belong in URL).
- Prefer URL search params for shareable filters (e.g. `?q=`).

## Validation

- Validate all user input with Zod:
  - Client: form resolver (React Hook Form + `zodResolver`)
  - Server: parse again in server action (trust nothing)
- Keep schemas in `features/<feature>/schemas.ts`.

## Type Safety

- Avoid `any`.
- Props passed from Server → Client must be serializable:
  - Convert `Date` to ISO string.
  - Convert Prisma `Decimal` to string.
- Prefer `Awaited<ReturnType<typeof fn>>[number]` for query result typing.

## Clean Code

- Keep functions small and single-purpose.
- Avoid duplicated logic: centralize shared helpers in `src/lib` or `src/utils`.
- Keep UI primitives generic; keep domain logic in `features/*`.

## Performance

- Use `revalidatePath` only where needed.
- Paginate large lists; avoid unbounded `findMany`.
- Avoid unnecessary client components and context providers.

## Import Order

1. React/Next
2. Third-party
3. Internal aliases (`@/…`)

## Reusable Components

- Build primitives in `src/components/ui`.
- Build feature components in `src/features/<feature>/components`.
- Keep styling consistent via tokens in `src/app/globals.css`.

