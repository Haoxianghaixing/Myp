# 1. 构建基础镜像
FROM node:18-alpine AS base
# 定义构建参数
ARG BACKEND_MODE=prod
ARG NPM_TOKEN

ENV BACKEND_MODE=${BACKEND_MODE}

WORKDIR /app
EXPOSE 3000

FROM base AS runner

RUN npm install -g pnpm
COPY package.json pnpm-lock.yaml ./
RUN \
  [ -f pnpm-lock.yaml ] && pnpm install --ignore-scripts || \
  (echo "Lockfile not found." && exit 1)

COPY . .

RUN pnpm run build

CMD [ "sh", "-c", "npx pnpm run start" ]