import { AppRouter } from "@server/trpc/trpc.router";
import { createTRPCClient, httpBatchLink } from "@trpc/client";
import superjson from "superjson";

export function getTrpcUrl() {
	const serverUrl = process.env.NEXT_PUBLIC_NESTJS_SERVER;
	if (!serverUrl) {
		throw new Error("app-err: NEXT_PUBLIC_NESTJS_SERVER is not defined!");
	}
	return `${serverUrl}/trpc`;
}

export function makeTrpcClient() {
	return createTRPCClient<AppRouter>({
		links: [
			httpBatchLink({
				url: getTrpcUrl(),
				transformer: superjson,
			}),
		],
	});
}

export const trpc = makeTrpcClient();
