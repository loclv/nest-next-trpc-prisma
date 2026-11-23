# Development Guide

## Prerequisites

- Node.js `>=18`
- `pnpm >=8.6.1`
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

## Database

Start PostgreSQL with Docker Compose (from `apps/server`):

```sh
docker compose up -d
```

Run Prisma migrations and Studio from the repository root:

```sh
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

## Testing, Linting & Formatting

```sh
# Server unit tests and lint
pnpm --filter server test
pnpm --filter server lint

# Server e2e tests
pnpm --filter server test:e2e

# Web lint and TypeScript check
pnpm --filter web lint
pnpm --filter web exec tsc --noEmit

# Prettier formatting
pnpm fmt
pnpm fmt.check
```

## Web ESLint Conventions

`apps/web/.eslintrc.json` enforces:

- `@typescript-eslint/no-explicit-any` and `@typescript-eslint/no-unused-vars` as errors.
- `id-length`: minimum 2 characters (except `i`).
- `line-comment-position`: comments must be placed `above` the line.
- `@typescript-eslint/naming-convention`:
  - Interfaces prefixed with `I`
  - Type parameters prefixed with `T`
  - Booleans prefixed with `is`, `should`, `has`, `can`, `did`, `will`, or `was`
  - Variables in `PascalCase`, `camelCase`, or `UPPER_CASE`
