export function loader() {
  const headers = new Headers();
  headers.set("Location", "/");

  return new Response(null, {
    status: 302,
    headers,
  });
}
