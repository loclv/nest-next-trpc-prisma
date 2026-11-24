import { beforeEach, describe, expect, it } from "bun:test";

import { Test, TestingModule } from "@nestjs/testing";
import { PrismaService } from "@server/db";
import { TweetRouter } from "@server/trpc/routers/tweet.router";
import { UserRouter } from "@server/trpc/routers/user.router";
import { TrpcRouter } from "@server/trpc/trpc.router";
import { TrpcService } from "@server/trpc/trpc.service";
import type { Request, Response } from "express";

describe("TrpcRouter", () => {
	let trpcRouter: TrpcRouter;

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			providers: [
				TrpcService,
				UserRouter,
				TweetRouter,
				TrpcRouter,
				{
					provide: PrismaService,
					useValue: {
						user: {
							findMany: async () => [],
							create: async ({ data }: { data: { username: string } }) => ({
								id: 1,
								username: data.username,
								createdAt: new Date(),
								updatedAt: new Date(),
							}),
						},
						tweet: {
							findMany: async () => [],
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
		});
		const result = await caller.getUsers({ name: "" });
		expect(result).toEqual({ greeting: "Hello Bilbo" });
	});

	it("returns personalized greeting when name is provided", async () => {
		const caller = trpcRouter.appRouter.createCaller({
			req: {} as Request,
			res: {} as Response,
		});
		const result = await caller.getUsers({ name: "Frodo" });
		expect(result).toEqual({ greeting: "Hello Frodo" });
	});

	it("creates a user via user.create", async () => {
		const caller = trpcRouter.appRouter.createCaller({
			req: {} as Request,
			res: {} as Response,
		});
		const user = await caller.user.create({ username: "aragorn" });
		expect(user.username).toBe("aragorn");
	});
});
