import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@prisma/client";
try {
	process.loadEnvFile();
} catch {}
const adapter = new PrismaPg({
	connectionString: process.env.DATABASE_URL,
});
const prisma = new PrismaClient({ adapter });
async function main() {
	const existingUsers = await prisma.user.count();
	if (existingUsers > 0) {
		console.log("Database already seeded.");
		return;
	}
	const alice = await prisma.user.create({
		data: {
			username: "alice",
			tweets: {
				create: [
					{ content: "Hello from NestJS + Next.js + tRPC + Prisma!" },
					{ content: "End-to-end type safety with Zod and superjson." },
				],
			},
		},
	});
	const bob = await prisma.user.create({
		data: {
			username: "bob",
			tweets: {
				create: [{ content: "Cursor pagination and JWT auth are wired up." }],
			},
		},
	});
	console.log(`Seeded users: ${alice.username}, ${bob.username}`);
}
main()
	.catch((error) => {
		console.error(error);
		process.exit(1);
	})
	.finally(async () => {
		await prisma.$disconnect();
	});
//# sourceMappingURL=seed.js.map
