# Roastline

Roastline is a command-center app for coffee shop operations: register (POS), prep
queue, inventory, staff scheduling, loyalty, and reporting.

## Stack

- **Web app** — React 19, Vite, TanStack Query, Tailwind CSS, wouter (routing)
- **API** — Node.js, Express 5, Pino (logging), session-cookie authentication
- **Database** — PostgreSQL + Drizzle ORM
- **API contract** — OpenAPI spec, with Zod schemas and React Query hooks generated via Orval

## Project structure

```
roastline/
├── apps/
│   ├── web/            React/Vite frontend
│   └── api/             Express API server (routes/, middleware/, lib/)
├── packages/
│   ├── db/               Drizzle ORM schema, Postgres client, auth hashing, dev seed
│   ├── api-spec/           OpenAPI spec (source of truth for the API contract)
│   ├── api-schema/          Generated Zod schemas (from api-spec)
│   └── api-client/           Generated React Query hooks (from api-spec)
├── package.json
├── pnpm-workspace.yaml
└── tsconfig.base.json
```

## Deploying to Vercel

This deploys as **two Vercel projects** from the same repo — one for the API, one
for the web app — connected by a rewrite proxy so cookies work correctly.

**1. Database.** Provision a Postgres database (e.g. [Neon](https://neon.tech)). Use
a pooled/PgBouncer connection string for `DATABASE_URL` if your provider offers one —
serverless functions open many short-lived connections.

**2. API project.**
- New Vercel project → Root Directory: `apps/api`
- Vercel auto-detects `src/server.ts` as a Node.js server (see [Vercel's Node.js
  runtime docs](https://vercel.com/docs/functions/runtimes/node-js#deploy-a-node.js-server))
  — no build configuration needed.
- Environment variables: `DATABASE_URL` (required). `CORS_ORIGIN` isn't needed with
  the rewrite-proxy setup below, but can be set as a fallback for direct API access.
- Deploy, then run `pnpm --filter @workspace/db run push` and optionally `run seed`
  against that same `DATABASE_URL` from your machine to set up the schema.
- Note the deployment URL (e.g. `https://your-api.vercel.app`).

**3. Web project.**
- New Vercel project → Root Directory: `apps/web`
- Vercel auto-detects Vite — no build configuration needed.
- Edit `apps/web/vercel.json` and replace `YOUR-API-PROJECT.vercel.app` with the
  API project's real URL from step 2, then redeploy. This makes `/api/*` requests
  from the browser transparently proxy to the API project, so session cookies work
  as same-origin without needing cross-site cookie settings or CORS.

Both projects target Node.js 24.x (set via `engines` in each `package.json`).

## Getting started

Requires Node.js 24+, [pnpm](https://pnpm.io), and a PostgreSQL database.

```bash
pnpm install
cp apps/api/.env.example apps/api/.env
cp packages/db/.env.example packages/db/.env
# edit both .env files with your DATABASE_URL

pnpm --filter @workspace/db run push   # create tables
pnpm --filter @workspace/db run seed   # optional: menu/inventory/loyalty catalog data + a login
```

Run the web app and API in separate terminals:

```bash
pnpm run dev:web   # http://localhost:5173
pnpm run dev:api   # http://localhost:4000
```

The web dev server proxies `/api` requests to `http://localhost:4000` by default; set
`API_PROXY_TARGET` if the API runs elsewhere.

If you skipped the seed step, register the first account (it becomes the "owner") by
POSTing to `/api/auth/register` — after that, registration closes and new staff are
created by an owner/manager via the app.

## Common tasks

| Command | What it does |
|---|---|
| `pnpm run typecheck` | Typecheck every package |
| `pnpm run build` | Typecheck, then build every package |
| `pnpm --filter @workspace/db run push` | Push schema changes to the database (dev only) |
| `pnpm --filter @workspace/db run seed` | Seed reference data + a login (dev only, not run in production) |
| `pnpm --filter @workspace/api-spec run codegen` | Regenerate `api-client` and `api-schema` from `openapi.yaml` |

## Images

Menu item photos and the marketing hero image are real stock photography from
[Unsplash](https://unsplash.com), stored as `imageUrl` on each seeded menu item and
free to use commercially under the [Unsplash License](https://unsplash.com/license)
(no attribution required). Swap them for your own product photos by updating the
`imageUrl` column via the menu API or directly in `packages/db/src/seed.ts`.

## Roadmap

Phases 1 (cleanup), 2 (real backend, database, and authentication), and the
functional core of Phase 3 (UI/UX) are done, and the app is configured for
deployment to Vercel (see above):
- Every endpoint is backed by real Postgres queries, and orders decrement real
  inventory via each menu item's recipe.
- All business routes require a signed-in session — the web app now has a real
  login/first-run-setup page, an auth gate that redirects unauthenticated visitors,
  and a working sign-out control showing the real signed-in staff member.
- Empty states (menu, inventory, staff, prep queue, dashboard activity) are now
  distinguished from error and loading states, since a freshly-seeded or brand-new
  database legitimately has empty lists.

Known simplifications, left as follow-ups rather than blocking this phase:
- Modifier price deltas (e.g. "+ oat milk") aren't yet persisted per order line —
  the order API only tracks `menuItemId` + `quantity`.
- `laborPercent` on the dashboard and `tipsCents` on the sales report are placeholder
  zeros — the schema has no wage or tip fields yet.
- Shift scheduling stores `day` as a short display label rather than a real date.
- The 13-page `roastline-pages.tsx` file has not yet been split into one file per
  page, and most pages have had a functional (auth, empty-state) pass rather than a
  full from-scratch visual redesign — the existing warm terracotta/serif design
  system was already distinctive and largely kept as-is rather than replaced.
