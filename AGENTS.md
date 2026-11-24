# AGENTS.md

Guidance for AI coding agents working in this repository.

## Overview

`nest-next-trpc-prisma` is a `pnpm` workspace monorepo with two apps:

- `apps/server`: NestJS 12 backend with tRPC 11 (`/trpc`) and Prisma 7 (PostgreSQL).
- `apps/web`: Next.js 16 + React 19 frontend (App Router + Pages Router) with tRPC 11 client, Tailwind CSS 4, daisyUI 5, and `react-hook-form`.

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
  - `@web/*` -> `./apps/web/*`
- End-to-end tRPC types:
  - `apps/server/src/trpc/trpc.router.ts` defines `TrpcRouter.appRouter` and exports `type AppRouter`.
  - `apps/web/app/trpc.ts` imports `AppRouter` from `@server/trpc/trpc.router` to create `createTRPCProxyClient<AppRouter>`.
  - `apps/server/src/main.ts` enables CORS, mounts tRPC middleware at `/trpc`, and listens on `process.env.PORT || 4000`.
- Database:
  - `apps/server/prisma/schema.prisma` defines `User` and `Tweet` models; `apps/server/prisma.config.ts` configures `DATABASE_URL`.
  - `apps/server/src/db/` provides `PrismaService` (using `@prisma/adapter-pg`), `PrismaModule`, and a barrel export (`index.ts`).
- Frontend:
  - `apps/web/app/` uses Next.js App Router (Server Components by default; add `'use client'` at the top of components using hooks such as `react-hook-form`).
  - `apps/web/pages/` contains additional Pages Router routes (`/about`, `/contact`).

## Rules

After making changes, verify with below command and use git commit codes:

```sh
pnpm --filter server test && pnpm --filter server test:e2e && pnpm build:server && pnpm --filter web exec tsc --noEmit && pnpm build:web && bun fmt --check
```
