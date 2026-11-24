# Architecture

This repository is a `pnpm` workspace monorepo combining a NestJS 12 backend and a Next.js 16 (React 19) frontend with shared Zod schemas, end-to-end type safety via tRPC 11 + `superjson`, and PostgreSQL access via Prisma 7.

## Workspace Layout

- `apps/server`: NestJS 12 API server (`module: "esnext"`, executed via Bun) with tRPC 11 (`/trpc`), `/health`, and Prisma 7.
- `apps/web`: Next.js 16 + React 19 App Router frontend with Tailwind CSS 4, daisyUI 5, `@tanstack/react-query`, `@trpc/tanstack-react-query`, and `react-hook-form`.
- `packages/shared` (`@repo/shared`): Shared Zod schemas and inferred TypeScript types consumed by both `server` and `web`.
- `tsconfig.json`: Root strict TypeScript 6 configuration defining shared path aliases:
  - `@server/*` -> `./apps/server/src/*`
  - `@shared/*` -> `./packages/shared/src/*`
  - `@web/*` -> `./apps/web/*`

## End-to-End tRPC Flow

1. `packages/shared/src/schemas.ts` defines shared Zod validation schemas (`greetingInputSchema`, `createUserSchema`, `createTweetSchema`).
2. `apps/server/src/trpc/trpc.context.ts` creates the Express request/response context; `apps/server/src/trpc/trpc.service.ts` initializes tRPC with `superjson`.
3. `apps/server/src/trpc/routers/` implements modular `UserRouter` and `TweetRouter`, mounted into `TrpcRouter.appRouter` in `apps/server/src/trpc/trpc.router.ts` (which exports `type AppRouter`).
4. `apps/server/src/main.ts` validates env via `apps/server/src/config/env.ts`, enables shutdown hooks and CORS (`ALLOWED_ORIGINS`), mounts tRPC at `/trpc`, and listens on `env.PORT`.
5. `apps/web/app/trpc.ts` creates `createTRPCClient<AppRouter>` with `superjson`, and `apps/web/app/providers.tsx` provides `TRPCProvider` and `useTRPC` for React Query hooks in client components.

## Database Layer

- `apps/server/prisma/schema.prisma` defines the PostgreSQL datasource and `User` / `Tweet` models.
- `apps/server/prisma.config.ts` loads `.env` and configures the Prisma datasource URL from `DATABASE_URL`.
- `apps/server/src/db/prisma.service.ts` extends `PrismaClient` with `@prisma/adapter-pg` and manages connection lifecycle via `OnModuleInit` / `OnModuleDestroy`.
- `apps/server/src/db/prisma.module.ts` is `@Global()` and exports `PrismaService`.
- `apps/server/src/health.controller.ts` exposes `GET /health` to verify database connectivity.

## Frontend Routing & Components

- `apps/web/app/`: Next.js App Router exclusively (`layout.tsx`, `providers.tsx`, `page.tsx`, `form.tsx`, `loading.tsx`, `error.tsx`, `components/Navigation.tsx`, `about/page.tsx`, `contact/page.tsx`).
- Client components using React hooks (`providers.tsx`, `form.tsx`, `error.tsx`) include `"use client";`.
