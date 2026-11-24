import { Module } from "@nestjs/common";
import { AuthRouter } from "@server/trpc/routers/auth.router";
import { TweetRouter } from "@server/trpc/routers/tweet.router";
import { UserRouter } from "@server/trpc/routers/user.router";
import { TrpcRouter } from "@server/trpc/trpc.router";
import { TrpcService } from "@server/trpc/trpc.service";

@Module({
	imports: [],
	controllers: [],
	providers: [TrpcService, AuthRouter, UserRouter, TweetRouter, TrpcRouter],
})
export class TrpcModule {}
