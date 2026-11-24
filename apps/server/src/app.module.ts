import { Module } from "@nestjs/common";
import { PrismaModule } from "@server/db";
import { TrpcModule } from "@server/trpc/trpc.module";

import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { HealthController } from "./health.controller";

@Module({
	imports: [PrismaModule, TrpcModule],
	controllers: [AppController, HealthController],
	providers: [AppService],
})
export class AppModule {}
