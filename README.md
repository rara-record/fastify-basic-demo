# fastify-react-router-boilerplate

Fastify, React Router 7, GraphQL Yoga, Relay를 활용한 풀스택 보일러플레이트입니다.

## 기술 스택

- Fastify
- GraphQL
- GraphQL Yoga
- TypeScript
- React
- React Router 7
- Relay
- TypeScript

## 시작하기

### 사전 요구사항

- Node.js 20 이상
- yarn 또는 npm
- TypeScript 5.0.0 이상

### 설치

```bash
# 저장소 복제
git clone https://github.com/username/fastify-react-router-boilerplate
cd fastify-react-router-boilerplate/app

# 의존성 설치
yarn install
```

### 환경 변수 설정

`.env` 파일을 생성하고 필요한 환경 변수를 설정하세요:

```env
# 서버 설정
HOST=0.0.0.0
PORT=9000

# 보안
COOKIE_SECRET=your-secret-key
```

### 개발 서버 실행

```bash
# 개발 서버 실행
yarn dev

# 또는 npm으로 실행
npm run dev
```

개발 서버가 실행되면 다음 주소에서 접속할 수 있습니다:

- 웹 서버: <http://localhost:9000>
- GraphQL 플레이그라운드: <http://localhost:9000/graphql>

### 프로덕션 빌드

```bash
# 프로덕션용 빌드
yarn build

# 프로덕션 서버 실행
yarn start
```

### 테스트 실행

```bash
# 단위 테스트 실행
yarn test

# 테스트 커버리지 확인
yarn test:coverage
```

### 개발 스크립트

- `yarn dev` - 개발 서버 실행
- `yarn build` - 프로덕션용 빌드
- `yarn start` - 프로덕션 서버 실행
- `yarn test` - 테스트 실행

## 주요 기능

### fastify + GraphQL

- ⚡️ **백엔드**
  - Fastify 기반의 HTTP 서버
  - Graceful Shutdown 지원

- 🎯 **모듈화된 상태 관리**
  - 전통적인 Fastify 의존성 주입 방식이 아닌 Fastify를 DI Container로 활용한 단순한 컨텍스트 전달 방식
  - 플러그인 기반의 모듈화된 기능 구현
    - GraphQL 컨텍스트는 기본적인 app과 req만 포함
    - DataLoader와 같은 특수 기능은 독립된 플러그인으로 구현

    ```typescript
    interface Context {
      app: FastifyInstance;  // Fastify 인스턴스 전체 접근
      req: FastifyRequest;   // 현재 요청 정보 접근 (플러그인에 의해 확장된 기능 포함)
    }
    ```

  #### 사용 예시

    ```typescript
    // GraphQL Resolver
    const resolvers = {
      Query: {
        users: async (_, args, context: Context) => {
          // 앱 수준 의존성 접근
          const cookie = context.app.env.COOKIE_SECRET;

          // 요청 수준 정보 접근
          const userId = context.req.headers['user-id'];

          return userId;
        }
      }
    }
    ```

  - **단순성**: 각 플러그인이 독립적으로 자신의 역할만 수행
  - **모듈성**: 기능별로 분리된 플러그인 구조
  - **유지보수성**: 독립된 모듈로 관리되어 수정이 용이
  - **타입 안정성**: TypeScript를 통한 타입 추론
  - **테스트 용이성**: 의존성 모킹이 용이

- 🚀 **GraphQL 기능**
  - GraphQL Yoga를 통한 GraphQL API 구현
  - 기본적인 Query/Mutation 지원
  - GraphQL Envelop 플러그인 시스템
  - GraphQL Playground 내장
  - Schema-first 개발 방식

- 🔒 **보안 및 안정성**
  - TypeScript를 통한 정적 타입 검사
  - 환경 변수 검증 (@fastify/env)
  - 쿠키 기반 보안 시스템

### React Router 7 + Relay

- 📡 **Relay 기반 데이터 관리**
  - SSR + 하이드레이션 최적화 패턴 구현
  - fetchQuery + useLazyLoadQuery 조합으로 효율적인 데이터 흐름

  ```typescript
  // 서버 사이드 로더 함수
  export async function loader() {
    const relayEnvironment = createRelayLoaderEnvironment();

    // 데이터 페칭
    await fetchQuery(relayEnvironment, query, variables).toPromise();

    // 레코드 데이터만 직렬화하여 반환
    return {
      recordMap: relayEnvironment.getStore().getSource().toJSON(),
      variables,
    };
  }

  // 클라이언트 컴포넌트
  export default function Component() {
    const { recordMap, variables } = useLoaderData<typeof loader>();

    // 레코드 게시 (한 번만 실행)
    useMemo(() => {
      if (recordMap) {
        const source = RecordSource.create(recordMap);
        relayEnvironment.getStore().publish(source);
      }
    }, [relayEnvironment, recordMap]);

    // 캐시된 데이터 사용
    const data = useLazyLoadQuery(query, variables);

    return <div>{/* 데이터 렌더링 */}</div>;
  }
  ```

- 🔄 **최적화된 SSR 데이터 흐름**
  - QueryRef 직렬화 없이 레코드 데이터만 전송하여 효율성 향상
  - 서버-클라이언트 간 일관된 데이터 상태 유지

  ```typescript
  // 서버에서 클라이언트로의 데이터 흐름
  서버 fetchQuery → 레코드 직렬화 → HTML 응답 →
  클라이언트 하이드레이션 → 스토어 복원 → useLazyLoadQuery
  ```

- 🛠 **타입 안전한 데이터 로딩 추상화**
  - 타입 추론 기반의 데이터 로딩 유틸리티
  - 제네릭과 조건부 타입을 활용한 엄격한 타입 안전성

  ```typescript
  // 타입 추론이 가능한 로더 함수
  export const loader = relayQueryLoader({
    query: homeQuery,
    variables: () => ({ id: "123" })
  });

  // 컴포넌트에서 타입 안전하게 데이터 사용
  export default function Home() {
    // Query 타입이 자동으로 추론됨
    const data = useRelayQueryLoaderData<typeof loader>(homeQuery);

    // 타입 추론과 자동완성 지원
    return <h1>{data.viewer.name}</h1>;
  }
  ```

### 개발 경험

- 🛠 **개발 도구**
  - 효율적인 개발 환경
    - Vite를 통한 클라이언트 HMR
    - nodemon을 통한 서버 자동 재시작
  - TypeScript 기반 개발 환경
  - biome.js를 통한 코드 포매팅
  - esbuild를 통한 빠른 서버 빌드

## 프로젝트 구조

```txt
app/
├── src/
│   ├── graphql/                # GraphQL 관련 파일
│   │   ├── Context.ts         # GraphQL 컨텍스트 정의
│   │   ├── resolvers.ts       # GraphQL 리졸버 구현
│   │   ├── Query.ping.graphql # GraphQL 쿼리 스키마 정의
│   │   ├── Query.something.graphql # 추가 GraphQL 쿼리 정의
│   │   └── __generated__/     # GraphQL 코드젠으로 자동 생성된 파일
│   │       ├── resolvers.ts   # 타입이 정의된 리졸버 인터페이스
│   │       └── schema.graphql # 통합된 GraphQL 스키마
│   │
│   ├── plugins/                # Fastify 플러그인 (서버 기능 모듈화)
│   │   ├── app.env.ts         # 환경변수 설정 및 검증
│   │   ├── app.graphql.ts     # GraphQL Yoga 서버 설정
│   │   ├── app.gracefulShutdown.ts # 안전한 서버 종료 처리
│   │   ├── reactRouter.ts     # React Router SSR 통합 설정
│   │   └── req.dataloader.ts  # GraphQL DataLoader 설정 (성능 최적화)
│   │
│   ├── web/                    # React 프론트엔드 애플리케이션
│   │   ├── relay/             # Relay 관련 설정 및 유틸리티
│   │   │   ├── createRelayLoaderEnvironment.ts # SSR용 Relay 환경
│   │   │   ├── createRelayRenderEnvironment.ts # 클라이언트용 Relay 환경
│   │   │   ├── relayQueryLoader.ts # 데이터 로딩 유틸리티
│   │   │   └── useRelayQueryLoaderData.ts # 커스텀 훅
│   │   │
│   │   ├── routes/            # 페이지 컴포넌트 (React Router 라우트)
│   │   │   ├── _index.tsx     # 인덱스 페이지 (리다이렉트 처리)
│   │   │   ├── home.tsx       # 홈 페이지 컴포넌트
│   │   │   ├── products.tsx   # 제품 페이지 컴포넌트
│   │   │   └── users.tsx      # 사용자 페이지 컴포넌트
│   │   │
│   │   ├── __relay__/         # Relay 생성 GraphQL 쿼리 파일
│   │   │   └── homeQuery.graphql.ts # 홈 페이지용 GraphQL 쿼리
│   │   │
│   │   ├── root.tsx           # 루트 레이아웃 (공통 UI 구조)
│   │   └── routes.ts          # 라우트 구성 설정
│   │
│   ├── index.ts               # 서버 시작점 (엔트리포인트)
│   └── makeApp.ts             # Fastify 앱 초기화 및 설정
│
├── .react-router/             # React Router 자동 생성 파일
│   └── types/                 # 타입스크립트 타입 정의
│       └── src/               # 소스 기반 타입
│
├── .env.example               # 환경변수 예시 파일
├── Dockerfile                 # Docker 컨테이너 설정
├── codegen.ts                 # GraphQL 코드 생성 설정
├── esbuild.config.js          # 서버 빌드 설정 (esbuild)
├── package.json               # 패키지 정보 및 스크립트
├── react-router.config.ts     # React Router 설정
├── relay.config.json          # Relay 컴파일러 설정
├── tsconfig.json              # TypeScript 설정
└── vite.config.ts             # 클라이언트 빌드 설정 (Vite)
```

### 주요 디렉토리 설명

#### `/src/graphql`

GraphQL API 관련 파일들이 위치합니다. Schema-first 개발 방식을 따르며, `.graphql` 파일에 스키마를 정의하고 `resolvers.ts`에서 해당 스키마에 대한 리졸버를 구현합니다. `codegen.ts` 설정을 통해 타입이 자동 생성됩니다.

#### `/src/plugins`

Fastify 플러그인 시스템을 활용한 서버 기능 모듈화가 이루어집니다. 각 플러그인은 독립적인 기능을 담당하며, 필요에 따라 의존성을 명시적으로 선언합니다.

#### `/src/web`

React 기반의 프론트엔드 애플리케이션이 위치합니다. React Router 7과 Relay를 통합하여 데이터 중심의 라우팅 시스템을 구현합니다.

- **routes/**: 각 페이지 컴포넌트가 위치하며, React Router의 File-based Routing 시스템을 따릅니다.
- **relay/**: Relay 관련 설정 및 유틸리티 함수들이 위치합니다.
- ****relay**/**: Relay 컴파일러가 생성한 GraphQL 쿼리 파일들이 위치합니다.

#### `/.react-router`

React Router 7의 타입 생성기가 자동으로 생성한 타입 정의 파일들이 위치합니다. 이 파일들은 직접 수정하지 않습니다.

### 핵심 파일 설명

- **src/index.ts**: 애플리케이션의 시작점으로, 서버를 초기화하고 시작합니다.
- **src/makeApp.ts**: Fastify 인스턴스를 생성하고 플러그인들을 등록합니다.
- **src/web/root.tsx**: React 애플리케이션의 루트 컴포넌트로, 공통 레이아웃과 에러 처리를 담당합니다.
- **src/web/routes.ts**: React Router의 라우트 구성을 정의합니다.
- **react-router.config.ts**: React Router의 SSR 설정을 정의합니다.
- **relay.config.json**: Relay 컴파일러 설정을 정의합니다.
