FROM node:20-alpine AS build
WORKDIR /app
COPY . .
RUN npx pnpm i && npx pnpm build

FROM node:20-alpine
WORKDIR /app
COPY --from=build /app/dist/* .
COPY --from=build /app/package.json .

CMD ["node", "su-webhook-handler.js"]
