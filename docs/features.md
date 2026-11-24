# Features

## 1. Shared Workspace Package (`@repo/shared`)

- Configured `pnpm-workspace.yaml` and root `tsconfig.json` (`@shared/*`) to include `packages/*`.
- Added `packages/shared/src/schemas.ts` with shared Zod schemas (`greetingInputSchema`, `paginationInputSchema`, `createUserSchema`, `createTweetSchema`) and inferred TypeScript types.

## 2. Backend (`apps/server`)

- **ESM & Bun Runtime**: Configured `"module": "esnext"` with `moduleResolution: "bundler"` in `apps/server/tsconfig.json`, and updated server scripts to run via Bun (`nest start --exec bun`, `bun dist/main.js`, `bun test`).
- **Environment Validation**: Added Zod env validation in `apps/server/src/config/env.ts` (`NODE_ENV`, `PORT`, `DATABASE_URL`, `ALLOWED_ORIGINS`, `JWT_SECRET`).
- **JWT Auth & Protected Procedures**:
  - Added HMAC-SHA256 JWT signing/verification in `apps/server/src/auth/jwt.ts`.
  - Extracted and verified `Authorization: Bearer <token>` in `apps/server/src/trpc/trpc.context.ts` to populate `ctx.user`.
  - Added `protectedProcedure` in `apps/server/src/trpc/trpc.service.ts` returning `TRPCError({ code: "UNAUTHORIZED" })` when unauthenticated.
- **Modular tRPC Routers & Pagination**:
  - Configured `superjson` transformer and `errorFormatter` (attaching `z.flattenError(error.cause)` for `ZodError`s) in `apps/server/src/trpc/trpc.service.ts`.
  - Added `apps/server/src/trpc/routers/auth.router.ts` (`auth.login`, `auth.me`), `user.router.ts` (`user.list`, `user.create`), and `tweet.router.ts` (`tweet.list`, `tweet.create`).
  - Implemented cursor-based pagination (`take`, `cursor`, `nextCursor`) on `user.list` and `tweet.list`.
- **Database, Health & Lifecycle**:
  - Made `apps/server/src/db/prisma.module.ts` `@Global()`, exported it from `apps/server/src/db/index.ts`, and wired `PrismaModule` into `apps/server/src/app.module.ts`.
  - Added `apps/server/prisma/seed.ts` and `"seed": "bun prisma/seed.ts"` in `apps/server/package.json`.
  - Added `/health` endpoint in `apps/server/src/health.controller.ts`, `enableShutdownHooks()`, `ALLOWED_ORIGINS` CORS support, and `AppLogger` (JSON logging in `production`) in `apps/server/src/main.ts`.

## 3. Frontend (`apps/web`)

- **App Router Consolidation**: Migrated `/about` and `/contact` from `apps/web/pages/` to `apps/web/app/about/page.tsx` and `apps/web/app/contact/page.tsx`.
- **tRPC & TanStack Query**: Added `TRPCProvider` and `useTRPC` in `apps/web/app/providers.tsx`, `superjson` + `Authorization` header injection in `apps/web/app/trpc.ts`, and `transpilePackages: ["@repo/shared"]` in `apps/web/next.config.js`.
- **UI & Boundaries**: Added `apps/web/app/loading.tsx`, `apps/web/app/error.tsx`, and `apps/web/app/dashboard.tsx` (rendered in `apps/web/app/page.tsx`) demonstrating session login/logout, paginated user list, paginated tweet feed, and tweet creation with cache invalidation.

## 4. Tooling, Tests & CI

- **Strict TypeScript & Formatting**: Enabled strict compiler flags in `tsconfig.json` and configured `bun fmt` with tab indentation in `bunfig.toml`.
- **Tests**: Added tRPC unit tests in `apps/server/src/trpc/trpc.router.spec.ts` and updated `apps/server/test/app.e2e-spec.ts` (`afterEach` cleanup and `/health` check).
- **DX & CI**: Updated `.vscode/settings.json` for workspace TypeScript and tab indentation, and added `.github/workflows/ci.yml`.
