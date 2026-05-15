FROM node:24-alpine AS builder
WORKDIR /app

RUN npm install -g pnpm
COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile

ENV PUBLIC_APP_URL=localhost:5173
ENV PORT=5173

# DB for Build
ENV DB_HOST=172.18.0.2
ENV DB_PORT=5432
ENV DB_USER=esc
ENV DB_PASS=esc
ENV DB_DB=esc
ENV DB_SSL=false

COPY . .
RUN pnpm vite build && pnpm prune --production

FROM node:24-alpine
WORKDIR /app

COPY --from=builder /app/build ./build
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/drizzle ./drizzle

ENV PUBLIC_APP_URL=localhost:5173
ENV PORT=5173


# DB for Runtime
ENV DB_HOST=172.18.0.2
ENV DB_PORT=5432
ENV DB_USER=esc
ENV DB_PASS=esc
ENV DB_DB=esc
ENV DB_SSL=false

EXPOSE 5173
ENTRYPOINT [ "node", "build" ]
