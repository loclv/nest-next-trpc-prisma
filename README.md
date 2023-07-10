# NestJS - NextJS - tRPC - Prisma stack app

## Getting Started

Update `pnpm`:

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

## Reference

- [Building a full-stack, fully type-safe pnpm monorepo with NestJS, NextJS & tRPC](https://www.tomray.dev/nestjs-nextjs-trpc)
- [nestjs-prisma](https://www.tomray.dev/nestjs-prisma)
