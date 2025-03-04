import { type GraphQLTaggedNode, fetchQuery } from "react-relay";
import type { LoaderFunctionArgs } from "react-router";
import type { OperationType, VariablesOf } from "relay-runtime";
import { createRelayLoaderEnvironment } from "./createRelayLoaderEnvironment";

type RelayQueryLoaderArgs<Query extends OperationType> = {
  query: GraphQLTaggedNode;
  variables?: (loaderArgs: LoaderFunctionArgs) => VariablesOf<Query>;
};

export type RelayQueryLoaderResponse<Query extends OperationType> = {
  recordMap: Record<string, unknown>;
  variables: VariablesOf<Query>;
  " $queryType": Query;
};

/**
 * OperationType은 함수 호출 시점에 결정됩니다.
 * OperationType은 variables 속성을 가집니다.
 * Relay는 모든 GraphQL 작업이 OperationType을 준수할 것으로 기대합니다.
 * @returns
 */
export function relayQueryLoader<Query extends OperationType>(
  args: RelayQueryLoaderArgs<Query>
) {
  return async (
    loaderArgs: LoaderFunctionArgs
  ): Promise<RelayQueryLoaderResponse<Query>> => {
    const variables = args.variables?.(loaderArgs) ?? {};
    const relayEnvironment = createRelayLoaderEnvironment();

    await fetchQuery(relayEnvironment, args.query, variables).toPromise();

    const recordMap = relayEnvironment.getStore().getSource().toJSON();

    return {
      recordMap,
      variables,
      " $queryType": null as any, // 런타임에는 의미 없는 값
    };
  };
}
