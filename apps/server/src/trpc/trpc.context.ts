import * as trpcExpress from "@trpc/server/adapters/express";

export function createContext({
	req,
	res,
}: trpcExpress.CreateExpressContextOptions) {
	return { req, res };
}

export type TrpcContext = Awaited<ReturnType<typeof createContext>>;
