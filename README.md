# 🎏 NestJS - NextJS - tRPC - Prisma stack app

## 🍰 Tech stack

- DB: PostgreSQL
- ORM: Prisma 7
- Node.js framework: NestJS 12
- End-to-end type-safe APIs: [tRPC 11](https://trpc.io/)
- Frontend: Next.js 16 + React 19 (App Router + Pages Router)
- Forms: [React Hook Form](https://react-hook-form.com/)
- Style: Tailwind CSS 4 + [daisyUI 5](https://daisyui.com/)
- Node.js package manager: [pnpm](https://pnpm.io)
- Monorepo: [pnpm workspace](https://pnpm.io/workspaces)

## 📁 Workspace Structure

- `apps/server`: NestJS backend with tRPC (`/trpc`) and Prisma (`User`, `Tweet` models).
- `apps/web`: Next.js frontend consuming `AppRouter` types from `@server/trpc/trpc.router`.
- `docs/`: Project documentation ([Architecture](docs/architecture.md), [Development Guide](docs/development.md)).
- `AGENTS.md`: Guidance for AI coding agents working in this repository.

## 🥕 Getting Started

Install/update [pnpm](https://pnpm.io) (`>=8.6.1`) and install dependencies:

```sh
pnpm i -g pnpm
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
pnpm build:server                   # Build NestJS server
pnpm build:web                      # Build Next.js web app
pnpm --filter server test           # Run server unit tests
pnpm --filter server test:e2e       # Run server e2e tests
pnpm --filter web exec tsc --noEmit # Type-check web
```

## 🧚‍♀️ Reference

- [Building a full-stack, fully type-safe pnpm monorepo with NestJS, NextJS & tRPC](https://www.tomray.dev/nestjs-nextjs-trpc)
- [nestjs-prisma](https://www.tomray.dev/nestjs-prisma)
