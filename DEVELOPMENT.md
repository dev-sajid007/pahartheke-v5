# Development Guide

## Prerequisites

- Node.js 18+
- pnpm 11
- MongoDB 7

> See `RUN_LOCAL.md` for a quick step-by-step local setup (env files, MongoDB, seeding, and service URLs).

## Environment Files

Copy the example env files for the services you plan to run:

```bash
cp apps/pos-api/.env.example apps/pos-api/.env
cp apps/mcp/.env.example apps/mcp/.env
cp apps/pos/.env.example apps/pos/.env.local
cp apps/storefront/.env.example apps/storefront/.env.local
cp apps/main-api/.env.example apps/main-api/.env
cp apps/admin/.env.example apps/admin/.env.local
```

Notes:

- `apps/pos/.env.local` should include `PORT=7103` and `NEXT_PUBLIC_API_URL=http://localhost:7104/api`.
- The POS frontend uses `apps/pos/scripts/run.mjs` so it can read `PORT` from `.env.local` or `.env` before starting Next.js.
- `apps/admin/.env.local` should set `NEXT_PUBLIC_API_URL=http://localhost:7102/api`.
- `apps/storefront/.env.local` controls the storefront proxy URLs and checkout target.

## Install Dependencies

```bash
pnpm install
pnpm approve-builds sharp unrs-resolver
pnpm install
```

## MongoDB

- POS services (`pos-api`, `mcp`) connect through `MONGO_URI` in `apps/pos-api/.env`.
- `main-api` uses its own `MONGODB_URI` in `apps/main-api/.env`.

Default POS database:

```text
mongodb://127.0.0.1:27017/pahar_pos_v5
```

## Seed Admin User

```bash
pnpm --filter pahar-pos-backend exec node seed.js
```

Default POS admin:

- `admin@gmail.com`
- `22222222`

## Start Dev Servers

```bash
pnpm dev
```

| Service | Port | URL |
|---------|------|-----|
| Storefront | 7100 | http://localhost:7100 |
| Admin | 7101 | http://localhost:7101 |
| Main API | 7102 | http://localhost:7102 |
| POS Dashboard | 7103 | http://localhost:7103 |
| POS API | 7104 | http://localhost:7104 |
| MCP Server | 7105 | http://localhost:7105/mcp |

### Individual Services

```bash
pnpm dev:pos-backend
pnpm dev:pos-frontend
pnpm dev:mcp
pnpm dev:storefront
pnpm dev:admin
pnpm dev:main-api
```

## Other Commands

```bash
pnpm build
pnpm lint
pnpm clean
```

## Troubleshooting

### Port in use

```bash
lsof -i :7103
kill -9 <PID>
```

### Frontend cannot reach API

- Check `NEXT_PUBLIC_API_URL` in `apps/pos/.env.local`.
- Check `NEXT_PUBLIC_API_URL` in `apps/admin/.env.local`.
- Check `BACKEND_API_URL` and checkout env vars in `apps/storefront/.env.local`.

### MongoDB connection fails

- Verify `MONGO_URI` in `apps/pos-api/.env`.
- Verify `MONGODB_URI` in `apps/main-api/.env`.
- Make sure MongoDB is running on port `27017` for POS (`docker compose up -d`).

### Reset local state

```bash
pnpm clean
pnpm install
```
