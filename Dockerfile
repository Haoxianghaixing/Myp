# 1. 构建基础镜像
FROM node:18-alpine AS builder

WORKDIR /app
ARG BACKEND_MODE=prod

ENV BACKEND_MODE=${BACKEND_MODE}

RUN corepack enable && corepack prepare pnpm@latest --activate
COPY pnpm-lock.yaml ./
RUN pnpm config set registry https://registry.npmmirror.com/
RUN pnpm fetch --prod 

COPY . .

RUN pnpm install --offline -r --prod

RUN npx cross-env BACKEND_MODE=$BACKEND_MODE pnpm run build

FROM node:18-alpine AS runner
WORKDIR /app
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static

EXPOSE 3000

ENTRYPOINT [ "node", "server.js" ]