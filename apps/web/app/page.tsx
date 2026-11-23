import { trpc } from '@web/app/trpc';
import Navigation from './components/Navigation';

export default async function Home() {
  const { greeting } = await trpc.getUsers.query({
    name: `Tom from backend 💚`,
  });
  return (
    <>
      <div>{greeting}</div>
      <button className="btn">daisyUI Button</button>
      <Navigation />
    </>
  );
}
