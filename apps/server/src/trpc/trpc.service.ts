import { Injectable } from "@nestjs/common";
import { TrpcContext } from "@server/trpc/trpc.context";
import { initTRPC, TRPCError } from "@trpc/server";
import superjson from "superjson";
import { z, ZodError } from "zod";

@Injectable()
export class TrpcService {
	trpc = initTRPC.context<TrpcContext>().create({
		transformer: superjson,
		errorFormatter({ shape, error }) {
			return {
				...shape,
				data: {
					...shape.data,
					zodError:
						error.cause instanceof ZodError
							? z.flattenError(error.cause)
							: null,
				},
			};
		},
	});

	procedure = this.trpc.procedure;
	protectedProcedure = this.trpc.procedure.use(({ ctx, next }) => {
		if (!ctx.user) {
			throw new TRPCError({ code: "UNAUTHORIZED" });
		}
		return next({
			ctx: {
				...ctx,
				user: ctx.user,
			},
		});
	});
	router = this.trpc.router;
	mergeRouters = this.trpc.mergeRouters;
}
