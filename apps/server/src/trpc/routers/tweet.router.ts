import { Injectable } from "@nestjs/common";
import { createTweetSchema } from "@repo/shared";
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
			list: this.trpc.procedure.query(() => {
				return this.prisma.tweet.findMany({
					orderBy: { createdAt: "desc" },
					include: {
						user: true,
					},
				});
			}),
			create: this.trpc.procedure
				.input(createTweetSchema)
				.mutation(({ input }) => {
					return this.prisma.tweet.create({
						data: {
							userId: input.userId,
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
