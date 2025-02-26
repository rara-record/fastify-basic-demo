import type { Route } from "./+types/users";

export function loader({ context }: Route.LoaderArgs) {
  // loader함수에서 fastify instance에 접근 가능
  context.app.env.COOKIE_SECRET;
}

export default function Users() {
  return <div>users</div>;
}
