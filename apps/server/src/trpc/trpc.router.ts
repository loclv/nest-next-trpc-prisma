import { INestApplication, Injectable } from "@nestjs/common";
import { greetingInputSchema } from "@repo/shared";
import { TweetRouter } from "@server/trpc/routers/tweet.router";
import { UserRouter } from "@server/trpc/routers/user.router";
import { createContext } from "@server/trpc/trpc.context";
import { TrpcService } from "@server/trpc/trpc.service";
import * as trpcExpress from "@trpc/server/adapters/express";

@Injectable()
export class TrpcRouter {
	appRouter: ReturnType<TrpcRouter["createRouter"]>;

	constructor(
		private readonly trpc: TrpcService,
		private readonly userRouter: UserRouter,
		private readonly tweetRouter: TweetRouter,
	) {
		this.appRouter = this.createRouter();
	}

	private createRouter() {
		return this.trpc.router({
			getUsers: this.trpc.procedure
				.input(greetingInputSchema)
				.query(({ input }) => {
					const { name } = input;
					return {
						greeting: `Hello ${name ? name : "Bilbo"}`,
					};
				}),
			user: this.userRouter.createRouter(),
			tweet: this.tweetRouter.createRouter(),
		});
	}

	async applyMiddleware(app: INestApplication) {
		app.use(
			"/trpc",
			trpcExpress.createExpressMiddleware({
				router: this.appRouter,
				createContext,
			}),
		);
	}
}

export type AppRouter = TrpcRouter["appRouter"];
