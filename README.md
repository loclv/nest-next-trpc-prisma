# 🎏 NestJS - NextJS - tRPC - Prisma stack app

## 🍰 Tech stack

- DB: PostgreSQL
- ORM: Prisma
- Node.js framework: NestJS
- End-to-end type-safe APIs: [tRPC](https://trpc.io/)
- Frontend: NextJS
- Style: Tailwind + [daisyUI](https://daisyui.com/)
- Node.js package manager: [pnpm](https://pnpm.io)
- Monorepo: [pnpm workspace](https://pnpm.io/workspaces)

## 🥕 Getting Started

Update [pnpm](https://pnpm.io):

```sh
pnpm i -g pnpm
```

Develop:

```sh
# create local environment variables
cp ./apps/web/.env.local.example ./apps/web/.env.local

pnpm dev
```

If you want to install the `@nestjs/config` package. In the root of your directory, you can run:

```sh
pnpm add @nestjs/config --filter=server
```

## 🧚‍♀️ Reference

- [Building a full-stack, fully type-safe pnpm monorepo with NestJS, NextJS & tRPC](https://www.tomray.dev/nestjs-nextjs-trpc)
- [nestjs-prisma](https://www.tomray.dev/nestjs-prisma)
