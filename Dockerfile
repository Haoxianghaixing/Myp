# 1. 构建基础镜像
FROM node:18-alpine AS builder

WORKDIR /app
ARG BACKEND_MODE=prod

ENV BACKEND_MODE=${BACKEND_MODE}

RUN npm install -g pnpm
COPY package.json pnpm-lock.yaml ./
RUN pnpm config set registry https://registry.npmmirror.com/
RUN pnpm install
COPY . .
RUN npx cross-env BACKEND_MODE=$BACKEND_MODE pnpm run build

FROM node:18-alpine AS runner
WORKDIR /app
COPY --from=builder /app/package.json /app/pnpm-lock.yaml ./
COPY --from=builder /app/next.config.mjs ./next.config.mjs
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static

EXPOSE 3000

ENTRYPOINT [ "node", "server.js" ]