import type { Route } from "./+types/users";

export function loader({ context }: Route.LoaderArgs) {
  context.
}

export default function Users() {
  return <div>users</div>;
}
