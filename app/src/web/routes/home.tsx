import { useMemo } from "react";
import {
  fetchQuery,
  graphql,
  loadQuery,
  useLazyLoadQuery,
  useRelayEnvironment,
} from "react-relay";
import { useLoaderData } from "react-router";
import { RecordSource } from "relay-runtime";
import type { homeQuery } from "../__relay__/homeQuery.graphql";
import { createRelayLoaderEnvironment } from "../relay/createRelayLoaderEnvironment";

const query = graphql`
  query homeQuery {
    ping
  }
`;

// export async function loader() {
//   const queryRef = loadQuery(relayEnvironment, query, {});

//   // TODO: 조금 더 살펴보기
//   const response = await queryRef.source?.toPromise();
//  await queryRef.source?.toPromise();
//   // Store에는 쿼리 결과가 정규화되어 저장됩니다. 아래 API를 통해 확인 가능
//   // console.log(relayEnvironment.getStore().getSource().toJSON());

//     return {
//       recordMap: relayEnvironment.getStore().getSource().toJSON(),
//       variables: {},
//       " $queryType": null as any,
//     };
// }

export async function loader() {
  const relayEnvironment = createRelayLoaderEnvironment();
  const variables = {};

  await fetchQuery(relayEnvironment, query, {}).toPromise();

  console.log(relayEnvironment.getStore().getSource().toJSON());

  return {
    recordMap: relayEnvironment.getStore().getSource().toJSON(),
    variables,
  };
}

export default function Home() {
  const { recordMap, variables } = useLoaderData<typeof loader>();
  const relayEnvironment = useRelayEnvironment();

  // 레코드 게시
  useMemo(() => {
    const source = RecordSource.create(recordMap ?? {});
    relayEnvironment.getStore().publish(source);
  }, [relayEnvironment, recordMap]);

  // 캐시된 데이터 사용
  const data = useLazyLoadQuery<homeQuery>(query, variables);

  return <div>{data.ping}</div>;
}
