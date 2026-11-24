"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import {
	type CreateTweetInput,
	createTweetSchema,
	type CreateUserInput,
	createUserSchema,
} from "@repo/shared";
import {
	useInfiniteQuery,
	useMutation,
	useQuery,
	useQueryClient,
} from "@tanstack/react-query";
import { useTRPC } from "@web/app/providers";
import { getAuthToken, setAuthToken } from "@web/app/trpc";
import { useForm } from "react-hook-form";

export default function Dashboard() {
	const trpc = useTRPC();
	const queryClient = useQueryClient();
	const hasToken = Boolean(getAuthToken());

	const meQuery = useQuery({
		...trpc.auth.me.queryOptions(),
		enabled: hasToken,
		retry: false,
	});

	const usersQuery = useInfiniteQuery(
		trpc.user.list.infiniteQueryOptions(
			{ take: 5 },
			{
				getNextPageParam: (lastPage) => lastPage.nextCursor,
			},
		),
	);

	const tweetsQuery = useInfiniteQuery(
		trpc.tweet.list.infiniteQueryOptions(
			{ take: 5 },
			{
				getNextPageParam: (lastPage) => lastPage.nextCursor,
			},
		),
	);

	const loginForm = useForm<CreateUserInput>({
		resolver: zodResolver(createUserSchema),
	});

	const tweetForm = useForm<CreateTweetInput>({
		resolver: zodResolver(createTweetSchema),
	});

	const loginMutation = useMutation(
		trpc.auth.login.mutationOptions({
			onSuccess: (data) => {
				setAuthToken(data.token);
				loginForm.reset();
				void queryClient.invalidateQueries({
					queryKey: trpc.auth.me.queryKey(),
				});
				void queryClient.invalidateQueries({
					queryKey: trpc.user.list.infiniteQueryKey(),
				});
			},
		}),
	);

	const createTweetMutation = useMutation(
		trpc.tweet.create.mutationOptions({
			onSuccess: () => {
				tweetForm.reset();
				void queryClient.invalidateQueries({
					queryKey: trpc.tweet.list.infiniteQueryKey(),
				});
				void queryClient.invalidateQueries({
					queryKey: trpc.user.list.infiniteQueryKey(),
				});
			},
		}),
	);

	const handleLogout = () => {
		setAuthToken(null);
		queryClient.removeQueries({ queryKey: trpc.auth.me.queryKey() });
	};

	const users = usersQuery.data?.pages.flatMap((page) => page.items) ?? [];
	const tweets = tweetsQuery.data?.pages.flatMap((page) => page.items) ?? [];

	return (
		<div className="space-y-8">
			<section className="card bg-base-200 p-4">
				<h2 className="mb-2 text-lg font-semibold">Session</h2>
				{meQuery.data ? (
					<div className="flex items-center gap-4">
						<span>
							Signed in as <strong>@{meQuery.data.username}</strong>
						</span>
						<button
							type="button"
							className="btn btn-sm btn-outline"
							onClick={handleLogout}
						>
							Sign out
						</button>
					</div>
				) : (
					<form
						onSubmit={loginForm.handleSubmit((data) =>
							loginMutation.mutate(data),
						)}
						className="flex max-w-sm flex-col gap-2"
					>
						<div className="flex gap-2">
							<input
								type="text"
								placeholder="Username"
								className="input input-bordered"
								{...loginForm.register("username")}
							/>
							<button
								type="submit"
								className="btn btn-primary"
								disabled={loginMutation.isPending}
							>
								{loginMutation.isPending ? "Signing in..." : "Sign in"}
							</button>
						</div>
						{loginForm.formState.errors.username && (
							<span className="text-error text-sm">
								{loginForm.formState.errors.username.message}
							</span>
						)}
						{loginMutation.error && (
							<span className="text-error text-sm">
								{loginMutation.error.message}
							</span>
						)}
					</form>
				)}
			</section>

			<div className="grid gap-6 md:grid-cols-2">
				<section className="card bg-base-200 p-4">
					<h2 className="mb-3 text-lg font-semibold">Users</h2>
					{usersQuery.isLoading ? (
						<span className="loading loading-spinner loading-sm" />
					) : users.length === 0 ? (
						<p className="text-sm opacity-70">No users yet.</p>
					) : (
						<ul className="space-y-2">
							{users.map((user) => (
								<li
									key={user.id}
									className="bg-base-100 flex items-center justify-between rounded px-3 py-2"
								>
									<span className="font-medium">@{user.username}</span>
									<span className="badge badge-ghost">
										{user._count.tweets} tweets
									</span>
								</li>
							))}
						</ul>
					)}
					{usersQuery.hasNextPage && (
						<button
							type="button"
							className="btn btn-sm btn-outline mt-3"
							disabled={usersQuery.isFetchingNextPage}
							onClick={() => usersQuery.fetchNextPage()}
						>
							{usersQuery.isFetchingNextPage ? "Loading..." : "Load more users"}
						</button>
					)}
				</section>

				<section className="card bg-base-200 p-4">
					<h2 className="mb-3 text-lg font-semibold">Tweets</h2>
					<form
						onSubmit={tweetForm.handleSubmit((data) =>
							createTweetMutation.mutate(data),
						)}
						className="mb-4 flex flex-col gap-2"
					>
						<div className="flex gap-2">
							<input
								type="text"
								placeholder={
									meQuery.data
										? "What's happening?"
										: "Sign in above to post a tweet"
								}
								className="input input-bordered flex-1"
								disabled={!meQuery.data}
								{...tweetForm.register("content")}
							/>
							<button
								type="submit"
								className="btn btn-primary"
								disabled={!meQuery.data || createTweetMutation.isPending}
							>
								{createTweetMutation.isPending ? "Posting..." : "Tweet"}
							</button>
						</div>
						{tweetForm.formState.errors.content && (
							<span className="text-error text-sm">
								{tweetForm.formState.errors.content.message}
							</span>
						)}
						{createTweetMutation.error && (
							<span className="text-error text-sm">
								{createTweetMutation.error.message}
							</span>
						)}
					</form>

					{tweetsQuery.isLoading ? (
						<span className="loading loading-spinner loading-sm" />
					) : tweets.length === 0 ? (
						<p className="text-sm opacity-70">No tweets yet.</p>
					) : (
						<ul className="space-y-2">
							{tweets.map((tweet) => (
								<li key={tweet.id} className="bg-base-100 rounded p-3">
									<div className="text-xs opacity-70">
										@{tweet.user.username}
									</div>
									<p className="mt-1">{tweet.content}</p>
								</li>
							))}
						</ul>
					)}
					{tweetsQuery.hasNextPage && (
						<button
							type="button"
							className="btn btn-sm btn-outline mt-3"
							disabled={tweetsQuery.isFetchingNextPage}
							onClick={() => tweetsQuery.fetchNextPage()}
						>
							{tweetsQuery.isFetchingNextPage
								? "Loading..."
								: "Load more tweets"}
						</button>
					)}
				</section>
			</div>
		</div>
	);
}
