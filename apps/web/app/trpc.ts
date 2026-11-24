import { AppRouter } from "@server/trpc/trpc.router";
import { createTRPCClient, httpBatchLink } from "@trpc/client";
import superjson from "superjson";

const TOKEN_STORAGE_KEY = "auth_token";

export function getAuthToken(): string | null {
	if (typeof window === "undefined") {
		return null;
	}
	return window.localStorage.getItem(TOKEN_STORAGE_KEY);
}

export function setAuthToken(token: string | null) {
	if (typeof window === "undefined") {
		return;
	}
	if (token) {
		window.localStorage.setItem(TOKEN_STORAGE_KEY, token);
	} else {
		window.localStorage.removeItem(TOKEN_STORAGE_KEY);
	}
}

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
				headers() {
					const token = getAuthToken();
					return token ? { Authorization: `Bearer ${token}` } : {};
				},
			}),
		],
	});
}

export const trpc = makeTrpcClient();
