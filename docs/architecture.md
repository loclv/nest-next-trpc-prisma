# Architecture

This repository is a `pnpm` workspace monorepo combining a NestJS 12 backend and a Next.js 16 (React 19) frontend with end-to-end type safety via tRPC 11 and PostgreSQL access via Prisma 7.

## Workspace Layout

- `apps/server`: NestJS 12 API server with tRPC 11 (`/trpc`) and Prisma 7.
- `apps/web`: Next.js 16 + React 19 frontend with Tailwind CSS 4, daisyUI 5, tRPC 11 client, and `react-hook-form`.
- `tsconfig.json`: Root TypeScript 6 configuration defining shared path aliases:
  - `@server/*` -> `./apps/server/src/*`
  - `@web/*` -> `./apps/web/*`

## End-to-End tRPC Flow

1. `apps/server/src/trpc/trpc.service.ts` initializes tRPC (`initTRPC.create()`).
2. `apps/server/src/trpc/trpc.router.ts` defines `TrpcRouter.appRouter` (using `zod` for input validation) and exports `type AppRouter = TrpcRouter['appRouter']`.
3. `apps/server/src/main.ts` enables CORS, mounts the Express tRPC middleware at `/trpc`, and listens on `process.env.PORT || 4000`.
4. `apps/web/app/trpc.ts` imports `AppRouter` from `@server/trpc/trpc.router` and creates `createTRPCProxyClient<AppRouter>` pointing to `${NEXT_PUBLIC_NESTJS_SERVER}/trpc`.

## Database Layer

- `apps/server/prisma/schema.prisma` defines the PostgreSQL datasource and `User` / `Tweet` models.
- `apps/server/prisma.config.ts` loads `.env` and configures the Prisma datasource URL from `DATABASE_URL`.
- `apps/server/src/db/prisma.service.ts` extends `PrismaClient` with `@prisma/adapter-pg` and manages connection lifecycle via `OnModuleInit` / `OnModuleDestroy`.
- `apps/server/src/db/prisma.module.ts` exports `PrismaService`.
- `apps/server/src/db/index.ts` re-exports `./prisma.service`.

## Frontend Routing & Components

- `apps/web/app/`: Next.js App Router (`layout.tsx`, `page.tsx`, `form.tsx`, `components/Navigation.tsx`).
  - Client components using React hooks (such as `apps/web/app/form.tsx` with `react-hook-form`) include `'use client';`.
- `apps/web/pages/`: Pages Router routes (`/about`, `/contact`).
