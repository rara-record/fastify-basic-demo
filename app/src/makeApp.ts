import path from "node:path";
import fastifyAutoload from "@fastify/autoload";
import "dotenv-safe/config.js";

import fastify from "fastify";

export function makeApp() {
  const app = fastify({
    logger: true,
  });

  app.register(fastifyAutoload, {
    dir: path.resolve("./dist/plugins"),
  });

  app.get("/test", async () => ({
    message: "테스트 메세지",
  }));

  app.get("/healthz", async () => {
    return {
      ok: true,
    };
  });

  return app;
}
