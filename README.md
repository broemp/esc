# create-svelte

Everything you need to build a Svelte project, powered by [`create-svelte`](https://github.com/sveltejs/kit/tree/main/packages/create-svelte).

## Creating a project

If you're seeing this, you've probably already done this step. Congrats!

```bash
# create a new project in the current directory
npm create svelte@latest

# create a new project in my-app
npm create svelte@latest my-app
```

## Developing

Once you've created a project and installed dependencies with `npm install` (or `pnpm install` or `yarn`), start a development server:

```bash
npm run dev

# or start the server and open the app in a new browser tab
npm run dev -- --open
```

## Building

To create a production version of your app:

```bash
npm run build
```

You can preview the production build with `npm run preview`.

> To deploy your app, you may need to install an [adapter](https://kit.svelte.dev/docs/adapters) for your target environment.

## Environmental Variable

```environment
DEV=false

# DB Change what you need to 
DB_HOST=localhost
DB_PORT=5434
DB_USER=esc
DB_PASS=CHANGEME
DB_DB=esc
DB_SSL=false

# Auth
AUTH_SECRET=CHANGEME
DISCORD_ID=CHANGEME
DISCORD_SECRET=CHANGEME
REDDIT_ID=CHANGEME
REDDIT_SECRET=CHANGEME
GOOGLE_ID=CHANGEME
GOOGLE_SECRET=CHANGEME
```
