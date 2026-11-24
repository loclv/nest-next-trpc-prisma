import { Injectable } from "@nestjs/common";
import { createUserSchema, paginationInputSchema } from "@repo/shared";
import { PrismaService } from "@server/db";
import { TrpcService } from "@server/trpc/trpc.service";

@Injectable()
export class UserRouter {
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

					const rows = await this.prisma.user.findMany({
						take: take + 1,
						...(cursor ? { cursor: { id: cursor } } : {}),
						orderBy: { id: "desc" },
						include: {
							_count: {
								select: { tweets: true },
							},
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
			create: this.trpc.procedure
				.input(createUserSchema)
				.mutation(({ input }) => {
					return this.prisma.user.create({
						data: {
							username: input.username,
						},
					});
				}),
		});
	}
}
