import { reactRouterFastify } from "@mcansh/remix-fastify/react-router";
import type {
  FastifyInstance,
  FastifyRequest,
  RawServerBase,
  RouteGenericInterface,
} from "fastify";
import fp from "fastify-plugin";

/**
 * @mcansh/remix-fastify/react-router를 사용해서 React Router SSR 지원
 */
declare module "react-router" {
  interface AppLoadContext {
    app: FastifyInstance;
    req: FastifyRequest<RouteGenericInterface, RawServerBase>;
  }
}

export default fp(
  async (app) => {
    await app.register(reactRouterFastify, {
      buildDirectory: "./dist/web", // 빌드된 React 애플리케이션을 Fastify에서 서빙
      async getLoadContext(req) {
        // getLoadContext에서 Fastify 인스턴스와 요청 객체를 React Router의 loader에서 접근 가능하도록 설정
        return { app, req };
      },
    });
  },
  {
    name: "reactRouter",
    dependencies: ["app.env", "app.gracefulShutdown"], // 필요한 다른 플로그인들이 먼저 로드되도록
  }
);
