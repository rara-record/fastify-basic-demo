export function loader() {
  const headers = new Headers();
  headers.set("Location", "/home");

  return new Response(null, {
    status: 302,
    headers,
  });
}
