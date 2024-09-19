FROM node:20-alpine AS build
WORKDIR /app
#COPY . .
#RUN npx pnpm i && npx pnpm build

# 安装依赖
# Install dependencies based on the preferred package manager
COPY package.json yarn.lock* package-lock.json* pnpm-lock.yaml* ./
RUN \
  if [ -f yarn.lock ]; then yarn --frozen-lockfile; \
  elif [ -f package-lock.json ]; then npm ci; \
  elif [ -f pnpm-lock.yaml ]; then corepack enable pnpm && pnpm i --frozen-lockfile; \
  else echo "Lockfile not found." && exit 1; \
fi

# 复制剩余的项目文件
COPY . .
#COPY .env.production .env.production
RUN pnpm build

FROM node:20-alpine
WORKDIR /app
COPY --from=build /app/dist/* .
COPY --from=build /app/package.json .

CMD ["node", "su-webhook-handler.js"]
