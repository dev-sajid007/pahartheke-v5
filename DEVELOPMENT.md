# Development Guide

## Prerequisites

- Node.js 18+
- pnpm 11
- MongoDB 7

## Environment Files

Copy the example env files for the services you plan to run:

```bash
cp apps/pos-api/.env.example apps/pos-api/.env
cp apps/mcp/.env.example apps/mcp/.env
cp apps/pos/.env.example apps/pos/.env
cp apps/storefront/.env.example apps/storefront/.env
cp apps/main-api/.env.example apps/main-api/.env
cp apps/admin/.env.example apps/admin/.env.local
```

Notes:

- `apps/pos/.env` should include `PORT=4000` and `NEXT_PUBLIC_API_URL=http://localhost:4001/api`.
- The POS frontend uses `apps/pos/scripts/run.mjs` so it can read `PORT` from `.env` or `.env.local` before starting Next.js.
- `apps/admin/.env.local` should set `NEXT_PUBLIC_API_URL=http://localhost:5000/api`.
- `apps/storefront/.env` controls the storefront proxy URLs and checkout target.

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
mongodb://localhost:27018/pahar_pos_v5
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
| Storefront | 3000 | http://localhost:3000 |
| Admin | 3001 | http://localhost:3001 |
| Main API | 5000 | http://localhost:5000 |
| POS Dashboard | 4000 | http://localhost:4000 |
| POS API | 4001 | http://localhost:4001 |
| MCP Server | 4002 | http://localhost:4002/mcp |

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
lsof -i :4000
kill -9 <PID>
```

### Frontend cannot reach API

- Check `NEXT_PUBLIC_API_URL` in `apps/pos/.env`.
- Check `NEXT_PUBLIC_API_URL` in `apps/admin/.env.local`.
- Check `BACKEND_API_URL` and checkout env vars in `apps/storefront/.env`.

### MongoDB connection fails

- Verify `MONGO_URI` in `apps/pos-api/.env`.
- Verify `MONGODB_URI` in `apps/main-api/.env`.
- Make sure MongoDB is running on port `27018` for POS.

### Reset local state

```bash
pnpm clean
pnpm install
```
