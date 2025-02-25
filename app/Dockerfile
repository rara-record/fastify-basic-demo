FROM node:20-alpine

WORKDIR /usr/src/app

# 먼저 yarn 관련 파일들을 모두 복사
COPY .yarn/ ./.yarn/
COPY package.json yarn.lock .yarnrc.yml ./

# workspace 패키지 정보 복사
COPY app/package.json ./app/

# 의존성 설치 (--immutable 대신 다른 옵션 사용)
RUN yarn install --frozen-lockfile

# 소스코드 복사 및 빌드
COPY app/ ./app/
RUN yarn workspace @fastify-boilerplate-demo/app build

# 환경변수 설정
ENV NODE_ENV production
ENV NODE_OPTIONS=--max-old-space-size=2048
ENV PORT=10000

EXPOSE 10000

# 서버 실행
CMD ["yarn", "workspace", "@fastify-boilerplate-demo/app", "start"]