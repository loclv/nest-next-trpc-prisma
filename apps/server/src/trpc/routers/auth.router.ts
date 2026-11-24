import { Injectable } from "@nestjs/common";
import { createUserSchema } from "@repo/shared";
import { signJwt } from "@server/auth/jwt";
import { env } from "@server/config/env";
import { PrismaService } from "@server/db";
import { TrpcService } from "@server/trpc/trpc.service";

@Injectable()
export class AuthRouter {
	constructor(
		private readonly trpc: TrpcService,
		private readonly prisma: PrismaService,
	) {}

	createRouter() {
		return this.trpc.router({
			login: this.trpc.procedure
				.input(createUserSchema)
				.mutation(async ({ input }) => {
					let user = await this.prisma.user.findFirst({
						where: { username: input.username },
					});
					if (!user) {
						user = await this.prisma.user.create({
							data: { username: input.username },
						});
					}
					const token = signJwt(
						{ sub: user.id, username: user.username },
						env.JWT_SECRET,
					);
					return { token, user };
				}),
			me: this.trpc.protectedProcedure.query(({ ctx }) => {
				return ctx.user;
			}),
		});
	}
}
