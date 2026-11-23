# AGENTS.md

Guidance for AI coding agents working in this repository.

## Overview

`nest-next-trpc-prisma` is a `pnpm` workspace monorepo with two apps:

- `apps/server`: NestJS backend with tRPC (`/trpc`) and Prisma (PostgreSQL).
- `apps/web`: Next.js 13 frontend (App Router + Pages Router) with tRPC client, Tailwind CSS, daisyUI, and `react-hook-form`.

## Environment & Prerequisites

- Node.js `>=18`, `pnpm >=8.6.1`.
- Frontend env: copy `apps/web/.env.local.example` to `apps/web/.env.local` (`NEXT_PUBLIC_NESTJS_SERVER` must be set or `apps/web/app/trpc.ts` will throw).
- Backend env: `apps/server/.env` configures `DATABASE_URL`, `POSTGRES_USER`, and `POSTGRES_PASSWORD` (used by `apps/server/docker-compose.yml` and Prisma).

## Commands

Run from the repository root:

- `pnpm dev`: Start `server` and `web` in parallel.
- `pnpm build:server` / `pnpm build:web`: Build individual apps.
- `pnpm start:server` / `pnpm start:web`: Run production builds.
- `pnpm fmt` / `pnpm fmt.check`: Format or check formatting with Prettier.

App-specific commands:

- `pnpm --filter server test`: Run Jest unit tests (`apps/server/src/**/*.spec.ts`).
- `pnpm --filter server test:e2e`: Run NestJS e2e tests (`apps/server/test/jest-e2e.json`).
- `pnpm --filter server lint`: Run ESLint with `--fix` on `apps/server`.
- `pnpm --filter server migrate`: Run `prisma migrate dev`.
- `pnpm --filter server studio`: Open Prisma Studio.
- `pnpm --filter web lint`: Run `next lint` on `apps/web`.
- `pnpm --filter web exec tsc --noEmit`: Type-check `apps/web`.

## Architecture & Conventions

- **TypeScript path aliases** (root `tsconfig.json`):
  - `@server/*` -> `./apps/server/src/*`
  - `@web/*` -> `./apps/web/*`
- **End-to-end tRPC types**:
  - `apps/server/src/trpc/trpc.router.ts` defines `TrpcRouter.appRouter` and exports `type AppRouter`.
  - `apps/web/app/trpc.ts` imports `AppRouter` from `@server/trpc/trpc.router` to create `createTRPCProxyClient<AppRouter>`.
  - `apps/server/src/main.ts` enables CORS, mounts tRPC middleware at `/trpc`, and listens on `process.env.PORT || 4000`.
- **Database**:
  - `apps/server/prisma/schema.prisma` defines `User` and `Tweet` models.
  - `apps/server/src/db/` provides `PrismaService`, `PrismaModule`, and a barrel export (`index.ts`).
- **Frontend**:
  - `apps/web/app/` uses Next.js App Router (Server Components by default; add `'use client'` at the top of components using hooks such as `react-hook-form`).
  - `apps/web/pages/` contains additional Pages Router routes (`/about`, `/contact`).
- **Web ESLint rules** (`apps/web/.eslintrc.json`):
  - `@typescript-eslint/no-explicit-any` and `@typescript-eslint/no-unused-vars` are errors.
  - `id-length`: minimum 2 characters (except `i`).
  - `line-comment-position`: comments must be placed `above` the line.
  - `@typescript-eslint/naming-convention`: interfaces must start with `I`, type parameters with `T`, booleans with `is`/`should`/`has`/`can`/`did`/`will`/`was`, and variables must be `PascalCase`, `camelCase`, or `UPPER_CASE`.

## Verification

After making changes, verify with:

```sh
pnpm --filter server test && pnpm --filter server test:e2e && pnpm --filter server lint && pnpm build:server && pnpm --filter web lint && pnpm --filter web exec tsc --noEmit
```
