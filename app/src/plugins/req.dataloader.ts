import fp from "fastify-plugin";

declare module "fastify" {
  interface FastifyRequest {
    dataloaders: {};
  }
}

/**
 * FastifyError [Error]: The decorator 'dataloaders' of type 'object' is a reference type. Use the { getter, setter } interface instead.
 * @https://github.com/fastify/fastify/blob/main/docs/Reference/Decorators.md
 */
export default fp(
  async (app) => {
    app.decorateRequest("dataloaders");
    app.addHook("onRequest", async (req) => {
      // 매 요청마다 생성되는 dataloaders 객체
      req.dataloaders = {};
    });
  },
  {
    name: "req.dataloaders",
  }
);
