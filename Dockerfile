FROM node:22
WORKDIR /app

RUN npm install -g pnpm
COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile

ENV PUBLIC_APP_URL=localhost
ENV ORIGIN=localhost:80
ENV PORT=80
ENV AUTH_SECRET=
ENV DISCORD_ID=
ENV DISCORD_SECRET=
ENV REDDIT_ID=
ENV REDDIT_SECRET=
ENV GOOGLE_ID=
ENV GOOGLE_SECRET=

# DB for Build
ENV DB_HOST=172.17.0.2
ENV DB_PORT=5432
ENV DB_USER=esc
ENV DB_PASS=esc
ENV DB_DB=esc
ENV DB_SSL=false

COPY . .
RUN pnpm build

EXPOSE 80
ENTRYPOINT [ "node", "build" ]
