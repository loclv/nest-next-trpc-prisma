"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { type CreateUserInput, createUserSchema } from "@repo/shared";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useTRPC } from "@web/app/providers";
import { useForm } from "react-hook-form";

export default function MyForm() {
	const trpc = useTRPC();
	const queryClient = useQueryClient();

	const {
		register,
		handleSubmit,
		reset,
		formState: { errors },
	} = useForm<CreateUserInput>({
		resolver: zodResolver(createUserSchema),
	});

	const createUser = useMutation(
		trpc.user.create.mutationOptions({
			onSuccess: () => {
				reset();
				void queryClient.invalidateQueries({
					queryKey: trpc.user.list.queryKey(),
				});
			},
		}),
	);

	const onFormSubmit = (data: CreateUserInput) => {
		createUser.mutate(data);
	};

	return (
		<form
			onSubmit={handleSubmit(onFormSubmit)}
			className="flex max-w-sm flex-col gap-2"
		>
			<div className="flex gap-2">
				<input
					type="text"
					placeholder="Username"
					className="input input-bordered"
					{...register("username")}
				/>
				<button
					type="submit"
					className="btn btn-primary"
					disabled={createUser.isPending}
				>
					{createUser.isPending ? "Saving..." : "Create User"}
				</button>
			</div>
			{errors.username && (
				<span className="text-error text-sm">{errors.username.message}</span>
			)}
			{createUser.error && (
				<span className="text-error text-sm">{createUser.error.message}</span>
			)}
			{createUser.isSuccess && (
				<span className="text-success text-sm">
					Created user: {createUser.data.username}
				</span>
			)}
		</form>
	);
}
