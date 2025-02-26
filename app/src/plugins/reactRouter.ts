import { reactRouterFastify } from "@mcansh/remix-fastify/react-router";
import fp from "fastify-plugin";

export default fp(
  async (app) => {
    await app.register(reactRouterFastify);
  },
  {
    name: "reactRouter",
  }
);
