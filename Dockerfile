# 1. 构建基础镜像
FROM alpine:3.15 AS base

# 定义构建参数
ARG BACKEND_MODE=prod
ARG NPM_TOKEN

ENV BACKEND_MODE=${BACKEND_MODE}

WORKDIR /app

# 使用国内镜像，加速下面 apk add下载安装alpine不稳定情况
RUN sed -i 's/dl-cdn.alpinelinux.org/mirrors.aliyun.com/g' /etc/apk/repositories

# 使用apk命令安装 node 和npm 以及pnpm
RUN apk add --no-cache --update git nodejs=16.20.2-r0 npm=8.1.3-r0

# 2. 基于基础镜像安装项目依赖&构建
FROM base AS runner
WORKDIR /app

COPY . .

RUN \
  if [ -f yarn.lock ]; then yarn run build; \
  elif [ -f package-lock.json ]; then npm run build; \
  elif [ -f pnpm-lock.yaml ]; then corepack enable pnpm && pnpm run build; \
  else echo "Lockfile not found." && exit 1; \
  fi

RUN npx npm run build

EXPOSE 3000

CMD [ "sh", "-c", "npx pnpm run start" ]