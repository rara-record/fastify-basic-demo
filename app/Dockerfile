FROM node:20-alpine

WORKDIR /usr/src/app

COPY .yarn/releases /usr/src/app/.yarn/releases
COPY package.json yarn.lock .yarnrc.yml tsconfig.json /usr/src/app/
COPY app/package.json /usr/src/app/app/package.json

RUN yarn install --immutable

# 소스코드 복사 및 빌드
COPY app/ /usr/src/app/app/
RUN yarn workspace @fastify-boilerplate-demo/app build

# 환경변수 설정
ENV NODE_ENV production
ENV NODE_OPTIONS=--max-old-space-size=2048
ENV PORT=10000

EXPOSE 10000

# 서버 실행
CMD ["yarn", "workspace", "@fastify-boilerplate-demo/app", "start"]