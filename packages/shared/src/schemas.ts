import { z } from "zod";

export const greetingInputSchema = z.object({
	name: z.string().trim().optional(),
});

export const paginationInputSchema = z
	.object({
		take: z.number().int().min(1).max(50).default(10),
		cursor: z.number().int().positive().optional(),
	})
	.optional();

export const createUserSchema = z.object({
	username: z
		.string()
		.trim()
		.min(3, "Username must be at least 3 characters")
		.max(32, "Username must be at most 32 characters"),
});

export const createTweetSchema = z.object({
	content: z
		.string()
		.trim()
		.min(1, "Tweet content is required")
		.max(280, "Tweet must be at most 280 characters"),
});

export type GreetingInput = z.infer<typeof greetingInputSchema>;
export type PaginationInput = z.infer<typeof paginationInputSchema>;
export type CreateUserInput = z.infer<typeof createUserSchema>;
export type CreateTweetInput = z.infer<typeof createTweetSchema>;
