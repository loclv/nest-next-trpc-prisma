import { trpc } from "@web/app/trpc";

import Dashboard from "./dashboard";

export const dynamic = "force-dynamic";

export default async function Home() {
	const { greeting } = await trpc.getUsers.query({
		name: "Tom from backend 💚",
	});
	return (
		<div className="space-y-6">
			<div className="text-lg font-medium">{greeting}</div>
			<Dashboard />
		</div>
	);
}
