import { trpc } from '@web/app/trpc';

export default async function Home() {
  const { greeting } = await trpc.getUsers.query({
    name: `Tom from backend 💚`,
  });
  return (
    <>
      <div>{greeting}</div>
      <button className="btn">daisyUI Button</button>
    </>
  );
}
