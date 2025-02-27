import fp from "fastify-plugin";
import { createSchema, createYoga } from "graphql-yoga";

export default fp(
  async (app) => {
    const typeDefs = `
      type Query {
        ping: String
      }
    `;
    const schema = createSchema({
      typeDefs,
      resolvers: {
        Query: {
          ping() {
            return "pong";
          },
        },
      },
    });

    // create ExecuteSchema
    const yoga = createYoga({ schema });

    // 실제 요청을 받아서 처리
    // https://fastify.dev/docs/latest/Reference/Routes/#routes
    app.route({
      method: ["GET", "POST", "PUT", "OPTIONS"],
      url: yoga.graphqlEndpoint, // url 경로 설정

      async handler(req, reply) {
        // context는 매 요청마다 만들어짐
        const context = {};

        /**
         * 요청을 yoga에게 넘겨주고 응답을 받아서 처리 (fastify 요청이 들어오고, 중간에 yoga를 중간에 끼움)
         * context가 excutable schema에 들어감
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
