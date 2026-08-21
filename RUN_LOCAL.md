# Run Locally — Pahartheke Monorepo

Step-by-step guide to run the full project on your local machine.

## 1. Prerequisites

- Node.js **20+** (tested with 22/26)
- pnpm **11+** (`npm i -g pnpm`)
- Docker (for MongoDB 7) **or** a local MongoDB 7 instance
- Git

## 2. MongoDB

The POS services need MongoDB. The repo ships a `docker-compose.yml` (mongo:7, port **27017**):

```bash
docker compose up -d
```

Verify:

```bash
docker ps | grep pahar-pos-mongo
```

> POS services (`pos-api`, `mcp`) connect to `mongodb://127.0.0.1:27017/pahar_pos_v5`.
> `main-api` uses its own database via `MONGODB_URI` in `apps/main-api/.env`.

## 3. Environment Files

The repo already contains working local env files:

| App | Env file | Purpose |
|-----|----------|---------|
| Storefront | `apps/storefront/.env.local` | Points to local `main-api` (7102) + POS API (7104) |
| Admin CMS | `apps/admin/.env.local` | Points to `main-api` (7102) |
| POS Dashboard | `apps/pos/.env.local` | `PORT=7103`, points to POS API |
| POS API | `apps/pos-api/.env` | MongoDB, JWT, Cloudinary, CORS |
| Main API | `apps/main-api/.env` | MongoDB, JWT, CORS, Cloudinary |
| MCP Server | `apps/mcp/.env` | MongoDB, JWT |

If any are missing, copy the `.env.example` files:

```bash
cp apps/pos-api/.env.example apps/pos-api/.env
cp apps/mcp/.env.example apps/mcp/.env
cp apps/main-api/.env.example apps/main-api/.env
cp apps/pos/.env.example apps/pos/.env.local
cp apps/storefront/.env.example apps/storefront/.env.local
cp apps/admin/.env.example apps/admin/.env.local
```

> `.env*` files are gitignored (see `!.env.example`). Only the `.env.example` files are committed.

## 4. Install Dependencies

```bash
pnpm install
```

## 5. Seed Admin Users

POS Dashboard (POS API):

```bash
pnpm --filter pahar-pos-backend exec node seed.js
```

- Email: `admin@gmail.com`
- Password: `22222222`

Admin CMS (Main API):

```bash
pnpm --filter pahar-main-api exec node src/seed.js
```

- Email: `admin@pahar.com`
- Password: `admin123`

## 6. Start Everything

```bash
pnpm dev
```

This starts all services via turbo. Service URLs:

| Service | URL |
|---------|-----|
| Storefront | http://localhost:7100 |
| Admin CMS | http://localhost:7101 |
| Main API | http://localhost:7102 |
| POS Dashboard | http://localhost:7103 |
| POS API | http://localhost:7104/api |
| MCP Server | http://localhost:7105/mcp |

### Start a single service

```bash
pnpm dev:pos-backend     # POS API only (7104)
pnpm dev:pos-frontend    # POS Dashboard only (7103)
pnpm dev:mcp             # MCP Server (7105)
pnpm dev:storefront      # Storefront only (7100)
pnpm dev:admin           # Admin CMS only (7101)
pnpm dev:main-api        # Main API only (7102)
```

> `dev:mcp` runs the compiled `dist/` build — rebuild after changes with
> `pnpm --filter pahar-pos-mcp-server build`.

## 7. Default Credentials

| App | Email | Password |
|-----|-------|----------|
| POS Dashboard (pos-api) | `admin@gmail.com` | `22222222` |
| Admin CMS (main-api) | `admin@pahar.com` | `admin123` |

## 8. Troubleshooting

### Port already in use

```bash
lsof -i :7103
kill -9 <PID>
```

### Frontend cannot reach an API

- POS → check `NEXT_PUBLIC_API_URL` in `apps/pos/.env.local` (`http://localhost:7104/api`).
- Admin → check `NEXT_PUBLIC_API_URL` in `apps/admin/.env.local` (`http://localhost:7102/api`).
- Storefront → check `BACKEND_API_URL` / `POS_API_URL` / `EXTERNAL_*_API` in `apps/storefront/.env.local`.

### CORS errors in the browser

Add the frontend origin to the backend's `CORS_ORIGIN` (comma-separated):

- `apps/pos-api/.env` → `CORS_ORIGIN` (must include the POS Dashboard origin, e.g. `http://localhost:7103`)
- `apps/main-api/.env` → `CORS_ORIGIN` (must include `http://localhost:7100` and `http://localhost:7101`)

### MongoDB connection fails

```bash
docker ps | grep pahar-pos-mongo
docker logs pahar-pos-mongo --tail 20
```

Verify the URIs in `apps/pos-api/.env` and `apps/main-api/.env` match a reachable MongoDB.

### Reset local state

```bash
pnpm clean
pnpm install
```

## 9. Useful Commands

```bash
pnpm build   # build all apps (skips main-api — no build script)
pnpm lint    # lint all apps
```
