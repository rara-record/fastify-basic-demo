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

### 서버 사이드

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

### 클라이언트 사이드

- 🎯 **React Router 7**
  - SSR (Server-Side Rendering) 지원
  - 클라이언트 사이드 라우팅 최적화
  - 데이터 라우팅 (Data Router) 구현

- 📡 **데이터 관리**
  - Relay를 통한 선언적 데이터 페칭
  - 효율적인 캐시 관리
  - 자동 타입 생성 지원

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
│   ├── plugins/                # Fastify 플러그인
│   │   ├── app.env.ts         # 환경변수 설정
│   │   ├── app.graphql.ts     # GraphQL 서버 설정
│   │   ├── app.gracefulShutdown.ts
│   │   └── reactRouter.ts     # React Router SSR 설정
│   ├── web/                   # React 애플리케이션
│   │   ├── routes/           # 페이지 컴포넌트
│   │   │   ├── _index.tsx    # 홈페이지
│   │   │   └── users.tsx     # 사용자 페이지
│   │   ├── root.tsx         # 루트 레이아웃
│   │   └── routes.ts        # 라우트 설정
│   ├── index.ts             # 서버 시작점
│   └── makeApp.ts           # Fastify 앱 설정
```
