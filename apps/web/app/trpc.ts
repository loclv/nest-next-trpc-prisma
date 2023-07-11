import { createTRPCProxyClient, httpBatchLink } from '@trpc/client';
import { AppRouter } from '@server/trpc/trpc.router';

const NEXT_PUBLIC_NESTJS_SERVER = process.env.NEXT_PUBLIC_NESTJS_SERVER;

if (
  NEXT_PUBLIC_NESTJS_SERVER === undefined ||
  NEXT_PUBLIC_NESTJS_SERVER === ''
) {
  throw new Error('app-err: NEXT_PUBLIC_NESTJS_SERVER is not defined!');
}

export const trpc = createTRPCProxyClient<AppRouter>({
  links: [
    httpBatchLink({
      url: `${NEXT_PUBLIC_NESTJS_SERVER}/trpc`,
    }),
  ],
});
