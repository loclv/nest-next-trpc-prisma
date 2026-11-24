import { Injectable } from "@nestjs/common";
import { createTweetSchema, paginationInputSchema } from "@repo/shared";
import { PrismaService } from "@server/db";
import { TrpcService } from "@server/trpc/trpc.service";

@Injectable()
export class TweetRouter {
	constructor(
		private readonly trpc: TrpcService,
		private readonly prisma: PrismaService,
	) {}

	createRouter() {
		return this.trpc.router({
			list: this.trpc.procedure
				.input(paginationInputSchema)
				.query(async ({ input }) => {
					const take = input?.take ?? 10;
					const cursor = input?.cursor;

					const rows = await this.prisma.tweet.findMany({
						take: take + 1,
						...(cursor ? { cursor: { id: cursor } } : {}),
						orderBy: { id: "desc" },
						include: {
							user: true,
						},
					});

					let nextCursor: number | undefined;
					if (rows.length > take) {
						const nextItem = rows.pop();
						nextCursor = nextItem?.id;
					}

					return {
						items: rows,
						nextCursor,
					};
				}),
			create: this.trpc.protectedProcedure
				.input(createTweetSchema)
				.mutation(({ ctx, input }) => {
					return this.prisma.tweet.create({
						data: {
							userId: ctx.user.id,
							content: input.content,
						},
						include: {
							user: true,
						},
					});
				}),
		});
	}
}
