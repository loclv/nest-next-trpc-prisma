import { trpc } from '@web/app/trpc';

export default async function Home() {
  const { greeting } = await trpc.getUsers.query({ name: `Tom` });
  return <div>{greeting}</div>;
}
