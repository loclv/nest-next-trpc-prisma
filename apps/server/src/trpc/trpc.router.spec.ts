import { beforeEach, describe, expect, it } from "bun:test";

import { Test, TestingModule } from "@nestjs/testing";
import { PrismaService } from "@server/db";
import { AuthRouter } from "@server/trpc/routers/auth.router";
import { TweetRouter } from "@server/trpc/routers/tweet.router";
import { UserRouter } from "@server/trpc/routers/user.router";
import { TrpcRouter } from "@server/trpc/trpc.router";
import { TrpcService } from "@server/trpc/trpc.service";
import type { Request, Response } from "express";

describe("TrpcRouter", () => {
	let trpcRouter: TrpcRouter;

	beforeEach(async () => {
		const users = [
			{
				id: 3,
				username: "charlie",
				createdAt: new Date(),
				updatedAt: new Date(),
				_count: { tweets: 0 },
			},
			{
				id: 2,
				username: "bob",
				createdAt: new Date(),
				updatedAt: new Date(),
				_count: { tweets: 1 },
			},
			{
				id: 1,
				username: "alice",
				createdAt: new Date(),
				updatedAt: new Date(),
				_count: { tweets: 2 },
			},
		];

		const module: TestingModule = await Test.createTestingModule({
			providers: [
				TrpcService,
				AuthRouter,
				UserRouter,
				TweetRouter,
				TrpcRouter,
				{
					provide: PrismaService,
					useValue: {
						user: {
							findFirst: async ({ where }: { where: { username: string } }) =>
								users.find((u) => u.username === where.username) ?? null,
							findMany: async ({
								take,
								cursor,
							}: {
								take: number;
								cursor?: { id: number };
							}) => {
								const startIdx = cursor
									? users.findIndex((u) => u.id === cursor.id)
									: 0;
								return users.slice(startIdx, startIdx + take);
							},
							create: async ({ data }: { data: { username: string } }) => ({
								id: 4,
								username: data.username,
								createdAt: new Date(),
								updatedAt: new Date(),
							}),
						},
						tweet: {
							findMany: async () => [],
							create: async ({
								data,
							}: {
								data: { userId: number; content: string };
							}) => ({
								id: 1,
								userId: data.userId,
								content: data.content,
								createdAt: new Date(),
								updatedAt: new Date(),
								user: users.find((u) => u.id === data.userId) ?? users[0],
							}),
						},
					},
				},
			],
		}).compile();

		trpcRouter = module.get<TrpcRouter>(TrpcRouter);
	});

	it("returns default greeting when name is empty", async () => {
		const caller = trpcRouter.appRouter.createCaller({
			req: {} as Request,
			res: {} as Response,
			user: null,
		});
		const result = await caller.getUsers({ name: "" });
		expect(result).toEqual({ greeting: "Hello Bilbo" });
	});

	it("paginates user.list with cursor and nextCursor", async () => {
		const caller = trpcRouter.appRouter.createCaller({
			req: {} as Request,
			res: {} as Response,
			user: null,
		});
		const page1 = await caller.user.list({ take: 2 });
		expect(page1.items.length).toBe(2);
		expect(page1.nextCursor).toBe(1);

		const page2 = await caller.user.list({ take: 2, cursor: page1.nextCursor });
		expect(page2.items.length).toBe(1);
		expect(page2.nextCursor).toBeUndefined();
	});

	it("rejects unauthenticated calls to protected procedures", async () => {
		const caller = trpcRouter.appRouter.createCaller({
			req: {} as Request,
			res: {} as Response,
			user: null,
		});
		await expect(caller.auth.me()).rejects.toThrow("UNAUTHORIZED");
		await expect(
			caller.tweet.create({ content: "Unauthorized tweet" }),
		).rejects.toThrow("UNAUTHORIZED");
	});

	it("allows authenticated user to call auth.me and tweet.create", async () => {
		const caller = trpcRouter.appRouter.createCaller({
			req: {} as Request,
			res: {} as Response,
			user: { id: 1, username: "alice" },
		});
		const me = await caller.auth.me();
		expect(me).toEqual({ id: 1, username: "alice" });

		const tweet = await caller.tweet.create({ content: "Hello tRPC!" });
		expect(tweet.content).toBe("Hello tRPC!");
		expect(tweet.userId).toBe(1);
	});

	it("logs in an existing user and returns a token", async () => {
		const caller = trpcRouter.appRouter.createCaller({
			req: {} as Request,
			res: {} as Response,
			user: null,
		});
		const res = await caller.auth.login({ username: "alice" });
		expect(res.user.username).toBe("alice");
		expect(res.token.split(".").length).toBe(3);
	});
});
