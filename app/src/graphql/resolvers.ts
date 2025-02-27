import type { Resolvers } from "./__generated__/resolvers";

export const resolvers: Resolvers = {
  Query: {
    ping() {
      return "pong";
    },
    something() {
      return "something";
    },
  },
};
