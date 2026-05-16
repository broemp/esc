# ESC 2026

A Eurovision Song Contest watch party app. Rate acts across multiple categories, compete with friends in groups, and track who has the best taste in Eurovision.

## Features

- **Voting** — Score each act across configurable categories (vocals, staging, outfit, etc.)
- **Groups** — Create private or public groups to compare scores with friends
- **Live stats** — Personal stats, per-category breakdowns, and a top acts leaderboard
- **Drinks** — Country-paired drink suggestions to complement the viewing experience
- **Admin panel** — Manage acts, categories, users, votes, and drinks
- **Passkey support** — Sign in with Discord, Reddit, Google, or a passkey

## Stack

- [SvelteKit](https://kit.svelte.dev/) with Svelte 5
- [Drizzle ORM](https://orm.drizzle.team/) + PostgreSQL
- [Auth.js](https://authjs.dev/) (SvelteKit adapter) with WebAuthn support
- [Tailwind CSS v4](https://tailwindcss.com/) + [Skeleton UI](https://www.skeleton.dev/)
- Docker for deployment

## Development

```bash
pnpm install
pnpm dev
```

The app runs at `http://localhost:5173`. On first start it runs database migrations and seeds development data automatically.

## Environment Variables

Copy and fill in the values:

```env
DEV=false

# Database
DB_HOST=localhost
DB_PORT=5432
DB_USER=esc
DB_PASS=CHANGEME
DB_DB=esc
DB_SSL=false

# Auth
AUTH_SECRET=CHANGEME

# OAuth providers (optional — only configure what you use)
DISCORD_ID=CHANGEME
DISCORD_SECRET=CHANGEME
REDDIT_ID=CHANGEME
REDDIT_SECRET=CHANGEME
GOOGLE_ID=CHANGEME
GOOGLE_SECRET=CHANGEME
```

## Docker

A `docker-compose.yml` is included that runs the app alongside a PostgreSQL 16 database.

```bash
docker compose up -d
```

The app is built from `ghcr.io/broemp/esc:latest` and exposed on port 5173.

To build the image locally:

```bash
docker build -t esc .
```

## Database Migrations

Migrations are applied automatically on startup. To generate new migrations after schema changes:

```bash
pnpm drizzle-kit generate
```

## Building

```bash
pnpm build
pnpm preview
```
