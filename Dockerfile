FROM node:22
WORKDIR /app

RUN npm install -g pnpm
COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile

ENV PUBLIC_APP_URL=localhost:5173
ENV PORT=5173
ENV AUTH_SECRET=
ENV DISCORD_ID=
ENV DISCORD_SECRET=
ENV REDDIT_ID=
ENV REDDIT_SECRET=
ENV GOOGLE_ID=
ENV GOOGLE_SECRET=

# DB for Build
ENV DB_HOST=172.25.0.2
ENV DB_PORT=5432
ENV DB_USER=esc
ENV DB_PASS=esc
ENV DB_DB=esc
ENV DB_SSL=false

COPY . .
RUN pnpm vite build && pnpm prune --production

EXPOSE 5173
ENTRYPOINT [ "node", "build" ]
