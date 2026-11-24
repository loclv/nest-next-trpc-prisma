import { z } from "zod";

const envSchema = z.object({
	NODE_ENV: z
		.enum(["development", "test", "production"])
		.default("development"),
	PORT: z.coerce.number().int().positive().default(4000),
	DATABASE_URL: z.string().optional(),
	ALLOWED_ORIGINS: z.string().optional(),
	JWT_SECRET: z.string().min(1).default("dev-secret-change-in-production"),
});

export const env = envSchema.parse(process.env);
