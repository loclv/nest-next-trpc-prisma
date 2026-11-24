import { Injectable } from "@nestjs/common";
import { createUserSchema } from "@repo/shared";
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
			list: this.trpc.procedure.query(() => {
				return this.prisma.user.findMany({
					orderBy: { createdAt: "desc" },
					include: {
						_count: {
							select: { tweets: true },
						},
					},
				});
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
