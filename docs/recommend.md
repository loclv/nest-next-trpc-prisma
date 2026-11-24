# Recommendations

Planned next-stage improvements for taking this template to production:

## 1. Security & Production Auth Hardening

- **Strict production env checks** (`apps/server/src/config/env.ts`): Require a non-default `JWT_SECRET` and `DATABASE_URL` when `NODE_ENV === "production"` so misconfigured deployments fail fast on startup.
- **`httpOnly` cookie sessions**: Replace `localStorage` Bearer tokens by setting/clearing an `httpOnly`, `SameSite=Lax` cookie via `ctx.res` in `apps/server/src/trpc/routers/auth.router.ts` and passing `credentials: "include"` in `apps/web/app/trpc.ts`, enabling SSR authentication and mitigating XSS token theft.
- **Unique usernames & passwords**: Add `@unique` on `User.username` in `apps/server/prisma/schema.prisma` and password hashing (for example, `Bun.password.hash` / `Bun.password.verify`) for real sign-up/sign-in.

## 2. Full CRUD, Authorization & SSR Hydration

- **Ownership-checked mutations**: Add `tweet.delete` and `tweet.update` using `protectedProcedure` in `apps/server/src/trpc/routers/tweet.router.ts`, verifying `tweet.userId === ctx.user.id` and throwing `TRPCError({ code: "FORBIDDEN" })` otherwise.
- **Server-side React Query hydration**: Prefetch `user.list` and `tweet.list` in `apps/web/app/page.tsx` with `HydrationBoundary` + `dehydrate` so initial HTML renders populated without a client loading spinner.
- **Remove superseded component**: Delete `apps/web/app/form.tsx` now that `apps/web/app/dashboard.tsx` handles user login and tweet creation.

## 3. API Hardening & Observability

- **tRPC timing/audit middleware** (`apps/server/src/trpc/trpc.service.ts`): Log procedure path, type, duration, and errors through `apps/server/src/logger/app.logger.ts`.
- **Security headers & rate limiting**: Add `helmet` and `@nestjs/throttler` in `apps/server/src/main.ts` and `apps/server/src/app.module.ts`.

## 4. Real-DB Integration Tests & Containerization

- **PostgreSQL CI job** (`.github/workflows/ci.yml`): Add a `postgres` service container to run `prisma migrate deploy`, `pnpm --filter server seed`, and real-database e2e tests.
- **Docker packaging**: Add multi-stage `Dockerfile`s for `apps/server` (Bun) and `apps/web` (`output: "standalone"` in `apps/web/next.config.js`), plus a root `docker-compose.yml`.
- **Repo hygiene**: Ignore compiled `*.js` / `*.js.map` artifacts in `apps/server/` (`prisma.config.js*`, `prisma/seed.js*`) and `.gitignore` root `tsconfig.tsbuildinfo`.
