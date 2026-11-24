# AGENTS.md

Guidance for AI coding agents working in this repository.

## Overview

`nest-next-trpc-prisma` is a `pnpm` workspace monorepo with two apps and a shared package:

- `apps/server`: NestJS 12 backend (`module: "esnext"`, executed via Bun) with tRPC 11 (`/trpc`), `/health`, `superjson`, and Prisma 7 (PostgreSQL).
- `apps/web`: Next.js 16 + React 19 App Router frontend with tRPC 11, `@tanstack/react-query`, Tailwind CSS 4, daisyUI 5, and `react-hook-form`.
- `packages/shared`: Shared `@repo/shared` Zod schemas and inferred TypeScript types.

## Environment & Prerequisites

- Frontend env: copy `apps/web/.env.local.example` to `apps/web/.env.local` (`NEXT_PUBLIC_NESTJS_SERVER` must be set or `apps/web/app/trpc.ts` will throw).
- Backend env: `apps/server/.env` configures `DATABASE_URL`, `POSTGRES_USER`, and `POSTGRES_PASSWORD` (used by `apps/server/docker-compose.yml` and `apps/server/prisma.config.ts`).

## Commands

Run from the repository root:

- `pnpm dev`: Start `server` and `web` in parallel.
- `pnpm build:server` / `pnpm build:web`: Build individual apps.
- `pnpm start:server` / `pnpm start:web`: Run production builds.
- `pnpm format` / `pnpm format:check`: Format all files or check formatting with `bun fmt` (configured in `bunfig.toml` with tabs).

App-specific commands:

- `pnpm --filter server test`: Run `bun:test` unit tests (`apps/server/src/**/*.spec.ts`).
- `pnpm --filter server test:e2e`: Run NestJS e2e tests (`apps/server/test/app.e2e-spec.ts`).
- `pnpm --filter server migrate`: Run `prisma migrate dev`.
- `pnpm --filter server studio`: Open Prisma Studio.
- `pnpm --filter web exec tsc --noEmit`: Type-check `apps/web`.

## Architecture & Conventions

- TypeScript path aliases (root `tsconfig.json`):
  - `@server/*` -> `./apps/server/src/*`
  - `@shared/*` -> `./packages/shared/src/*`
  - `@web/*` -> `./apps/web/*`
- End-to-end tRPC types & shared schemas:
  - `packages/shared/src/schemas.ts` defines shared Zod schemas (`greetingInputSchema`, `createUserSchema`, `createTweetSchema`).
  - `apps/server/src/trpc/routers/` defines modular `UserRouter` and `TweetRouter`; `apps/server/src/trpc/trpc.router.ts` merges them into `TrpcRouter.appRouter` and exports `type AppRouter`.
  - `apps/web/app/trpc.ts` creates `createTRPCClient<AppRouter>` with `superjson`, and `apps/web/app/providers.tsx` exposes `TRPCProvider` / `useTRPC` via `@trpc/tanstack-react-query`.
  - `apps/server/src/main.ts` validates env via `apps/server/src/config/env.ts`, enables shutdown hooks and CORS (`ALLOWED_ORIGINS`), mounts tRPC middleware at `/trpc`, and listens on `env.PORT`.
- Database:
  - `apps/server/prisma/schema.prisma` defines `User` and `Tweet` models; `apps/server/prisma.config.ts` configures `DATABASE_URL`.
  - `apps/server/src/db/` provides `@Global()` `PrismaModule`, `PrismaService` (using `@prisma/adapter-pg`), and a barrel export (`index.ts`).
- Frontend:
  - `apps/web/app/` uses Next.js App Router exclusively (`/`, `/about`, `/contact`, plus `loading.tsx` and `error.tsx`). Add `'use client'` at the top of components using hooks such as `react-hook-form` or `useTRPC`.

## Rules

After making changes, verify with below command and use git commit codes:

```sh
pnpm --filter server test && pnpm --filter server test:e2e && pnpm build:server && pnpm --filter web exec next typegen && pnpm --filter web exec tsc --noEmit && pnpm build:web && bun fmt --check
```
