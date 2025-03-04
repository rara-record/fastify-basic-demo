import { type RouteConfig, index, route } from "@react-router/dev/routes";
import { flatRoutes } from "@react-router/fs-routes";

// export default [
//   index("routes/home.tsx"),
//   route("/products", "routes/products.tsx"),
//   route("/users", "routes/users.tsx"),
// ] satisfies RouteConfig;

export default flatRoutes() satisfies RouteConfig;
