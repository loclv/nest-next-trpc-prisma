import { verifyJwt } from "@server/auth/jwt";
import { env } from "@server/config/env";
import * as trpcExpress from "@trpc/server/adapters/express";

export interface AuthUser {
	id: number;
	username: string;
}

export function createContext({
	req,
	res,
}: trpcExpress.CreateExpressContextOptions) {
	let user: AuthUser | null = null;
	const authHeader = req.headers.authorization;
	if (authHeader?.startsWith("Bearer ")) {
		const token = authHeader.slice(7).trim();
		const payload = verifyJwt(token, env.JWT_SECRET);
		if (payload) {
			user = { id: payload.sub, username: payload.username };
		}
	}

	return { req, res, user };
}

export type TrpcContext = Awaited<ReturnType<typeof createContext>>;
