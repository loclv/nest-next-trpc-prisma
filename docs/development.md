# Development Guide

## Prerequisites

- Node.js `>=24.22.1`
- `pnpm >=12.0.0`
- [Bun](https://bun.sh/) `>=1.4` (test runner, formatter, and ESM server runtime)
- PostgreSQL (or Docker to run `apps/server/docker-compose.yml`)

## Environment Setup

1. Install dependencies:

   ```sh
   pnpm install
   ```

2. Configure frontend environment:

   ```sh
   cp ./apps/web/.env.local.example ./apps/web/.env.local
   ```

   Ensure `NEXT_PUBLIC_NESTJS_SERVER` is set (for example, `http://localhost:4000`). `apps/web/app/trpc.ts` throws an error if it is missing.

3. Configure backend environment in `apps/server/.env`:

   - `DATABASE_URL`
   - `POSTGRES_USER`
   - `POSTGRES_PASSWORD`
   - `PORT` (optional, defaults to `4000`)
   - `ALLOWED_ORIGINS` (optional comma-separated list of CORS origins)

## Database

Start PostgreSQL with Docker Compose (from `apps/server`):

```sh
docker compose up -d
```

Generate Prisma Client, run migrations, and open Studio from the repository root:

```sh
pnpm --filter server exec prisma generate
pnpm --filter server migrate
pnpm --filter server studio
```

## Running & Building

```sh
# Start server and web in parallel
pnpm dev

# Build apps individually
pnpm build:server
pnpm build:web

# Start production builds
pnpm start:server
pnpm start:web
```

## Testing, Formatting & Type-Checking

```sh
# Server unit and e2e tests (bun:test)
pnpm --filter server test
pnpm --filter server test:e2e

# Type-check server and web
pnpm --filter server exec tsc --noEmit
pnpm --filter web exec next typegen && pnpm --filter web exec tsc --noEmit

# Format and check with bun fmt
pnpm format
pnpm format:check
```
