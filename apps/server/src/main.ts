import { NestFactory } from "@nestjs/core";
import { env } from "@server/config/env";
import { AppLogger } from "@server/logger/app.logger";
import { TrpcRouter } from "@server/trpc/trpc.router";

import { AppModule } from "./app.module";

async function bootstrap() {
	const app = await NestFactory.create(AppModule, { bufferLogs: true });
	app.useLogger(new AppLogger());
	app.enableShutdownHooks();

	const allowedOrigins = env.ALLOWED_ORIGINS
		? env.ALLOWED_ORIGINS.split(",").map((origin) => origin.trim())
		: true;
	app.enableCors({ origin: allowedOrigins });

	const trpc = app.get(TrpcRouter);
	trpc.applyMiddleware(app);

	await app.listen(env.PORT);
}
bootstrap();
