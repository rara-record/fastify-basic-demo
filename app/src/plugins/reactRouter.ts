import { reactRouterFastify } from "@mcansh/remix-fastify/react-router";
import type {
  FastifyInstance,
  FastifyRequest,
  RawServerBase,
  RouteGenericInterface,
} from "fastify";
import fp from "fastify-plugin";

/**
 * Fastify 플러그인으로 React Router SSR을 지원하는 설정
 * @mcansh/remix-fastify/react-router 라이브러리를 사용
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
      buildDirectory: "./dist/web", // 빌드된 React 앱의 정적 파일 위치 지정
      async getLoadContext(req) {
        // React Router의 loader에서 Fastify 인스턴스와 요청 객체에 접근할 수 있도록 컨텍스트 설정
        return { app, req };
      },
    });
  },
  {
    name: "reactRouter", // 플러그인 이름 지정
    dependencies: ["app.env", "app.gracefulShutdown"], // 이 플러그인이 의존하는 다른 플러그인들을 명시
  }
);
