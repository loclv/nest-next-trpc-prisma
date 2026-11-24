# 🎏 NestJS - NextJS - tRPC - Prisma - Tailwind - pnpm workspace stack app

## 🍰 Tech stack

- DB: PostgreSQL
- ORM: Prisma 7
- Backend: NestJS 12 (ESM via Bun)
- End-to-end type-safe APIs: [tRPC 11](https://trpc.io/) + `superjson`
- Frontend: Next.js 16 + React 19 (App Router) + TanStack Query
- Validation & Forms: Zod (`@repo/shared`) + [React Hook Form](https://react-hook-form.com/)
- Style: Tailwind CSS 4 + [daisyUI 5](https://daisyui.com/)
- Runtime / Formatter / Test runner: [Bun](https://bun.sh/)
- Monorepo: [pnpm workspace](https://pnpm.io/workspaces)

## 📁 Workspace Structure

- `apps/server`: NestJS backend with modular tRPC (`/trpc`), `/health`, and Prisma (`User`, `Tweet` models).
- `apps/web`: Next.js App Router frontend consuming `AppRouter` types and `@tanstack/react-query` hooks.
- `packages/shared`: Shared Zod schemas and TypeScript types (`@repo/shared`).
- `docs/`: Project documentation ([Architecture](docs/architecture.md), [Development Guide](docs/development.md)).
- `AGENTS.md`: Guidance for AI coding agents working in this repository.

## 🥕 Getting Started

Install/update [pnpm](https://pnpm.io) and install dependencies:

```sh
pnpm self-update
pnpm install
```

Configure environment variables:

```sh
# Frontend env (sets NEXT_PUBLIC_NESTJS_SERVER)
cp ./apps/web/.env.local.example ./apps/web/.env.local
```

Ensure `apps/server/.env` configures `DATABASE_URL`, `POSTGRES_USER`, and `POSTGRES_PASSWORD`, then start both apps:

```sh
pnpm dev
```

## 🛠️ Common Scripts

```sh
pnpm build:server                    # Build NestJS server
pnpm build:web                       # Build Next.js web app
pnpm --filter server test            # Run server unit tests (bun:test)
pnpm --filter server test:e2e        # Run server e2e tests (bun:test)
pnpm --filter server exec tsc --noEmit # Type-check server
pnpm --filter web exec next typegen && pnpm --filter web exec tsc --noEmit # Type-check web
pnpm format                          # Format codebase with bun fmt
```

## 🧚‍♀️ Reference

- [Building a full-stack, fully type-safe pnpm monorepo with NestJS, NextJS & tRPC](https://www.tomray.dev/nestjs-nextjs-trpc)
- [nestjs-prisma](https://www.tomray.dev/nestjs-prisma)
