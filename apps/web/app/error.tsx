"use client";

export default function ErrorPage({
	error,
	reset,
}: {
	error: Error & { digest?: string };
	reset: () => void;
}) {
	return (
		<div className="alert alert-error mx-auto my-8 max-w-lg">
			<div>
				<h2 className="font-bold">Something went wrong</h2>
				<p className="text-sm">{error.message}</p>
			</div>
			<button type="button" className="btn btn-sm" onClick={() => reset()}>
				Try again
			</button>
		</div>
	);
}
