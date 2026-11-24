import { trpc } from "@web/app/trpc";

import MyForm from "./form";

export const dynamic = "force-dynamic";

export default async function Home() {
	const { greeting } = await trpc.getUsers.query({
		name: "Tom from backend 💚",
	});
	return (
		<div className="space-y-4">
			<div>{greeting}</div>
			<MyForm />
		</div>
	);
}
