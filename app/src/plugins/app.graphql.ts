import fs from "node:fs/promises";
import path from "node:path";
import { useHive } from "@graphql-hive/envelop";
import type { FastifyInstance, FastifyRequest } from "fastify";
import fp from "fastify-plugin";
import { createSchema, createYoga } from "graphql-yoga";
import type { Context } from "../graphql/Context";
import { resolvers } from "../graphql/resolvers";

export default fp(
  async (app) => {
    const typeDefs = await fs.readFile(
      path.resolve("./src/graphql/__generated__/schema.graphql"),
      "utf-8"
    );

    const schema = createSchema<Context>({
      typeDefs,
      resolvers,
    });

    // create ExecuteSchema (GraphQL 스키마와 실행 환경을 설정)
    const yoga = createYoga<Context>({
      schema,
      plugins: [
        useHive({
          token: "728f979a0e010ec53cbe16cda3d7e2e4",
          reporting: {
            author: "bora",
            commit: "1234",
          },
        }),
      ],
    });

    // 실제 요청을 받아서 처리
    // https://fastify.dev/docs/latest/Reference/Routes/#routes
    app.route({
      method: ["GET", "POST", "PUT", "OPTIONS"],
      url: yoga.graphqlEndpoint, // url 경로 설정
      async handler(req, reply) {
        // 매 요청마다 새로 생성되는 객체
        const context: Context = {
          app,
          req,
        };

        /**
         * 요청을 yoga에게 넘겨주고 응답을 받아서 처리 (fastify 요청이 들어오고, 중간에 yoga를 중간에 끼움)
         * context가 excutable schema에 들어갑니다.
         */
        const response = await yoga.handleNodeRequestAndResponse(
          req,
          reply,
          context
        );

        response.headers.forEach((value, key) => {
          reply.header(key, value);
        });

        reply.status(response.status);
        reply.send(response.body);

        return reply;
      },
    });
  },
  {
    name: "app.graphql",
  }
);
