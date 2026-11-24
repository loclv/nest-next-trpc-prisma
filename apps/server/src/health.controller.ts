import { Controller, Get } from "@nestjs/common";
import { PrismaService } from "@server/db";

@Controller("health")
export class HealthController {
	constructor(private readonly prisma: PrismaService) {}

	@Get()
	async check() {
		try {
			await this.prisma.$queryRaw`SELECT 1`;
			return { status: "ok", database: "connected" };
		} catch {
			return { status: "degraded", database: "disconnected" };
		}
	}
}
