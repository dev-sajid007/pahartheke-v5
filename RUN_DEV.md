# Development Setup

## Prerequisites

- Node.js 18+
- **pnpm 11** (`npm install -g pnpm`)
- MongoDB 7 — see [MongoDB](#3-mongodb)

---

## 1. Environment Files

Copy `.env.example` → `.env` for each service:

```bash
cp apps/pos-api/.env.example apps/pos-api/.env
cp apps/mcp/.env.example apps/mcp/.env
cp apps/pos/.env.example apps/pos/.env
cp apps/storefront/.env.example apps/storefront/.env
cp apps/main-api/.env.example apps/main-api/.env
cp apps/admin/.env.example apps/admin/.env.local
```

Notes:

- **`apps/pos/.env`** — `PORT` is read from `.env` by `apps/pos/scripts/run.mjs` and passed to `next dev`/`next start` (Next.js cannot read `PORT` from `.env` itself).
- **`apps/admin/.env.local`** — must set `NEXT_PUBLIC_API_URL=http://localhost:5000/api` (lib/api.ts otherwise defaults to an internal host).
- **`apps/storefront/.env`** — `BACKEND_API_URL` drives the BFF proxy routes (`/api/orders`, `/api/auth/*`, `/api/landing-page`). For a fully local stack point it at the local main-api (`http://localhost:5000`); keep the hosted URL (`https://v3api.pahartheke.com`) to use the remote backend instead. `EXTERNAL_PRODUCT_API`/`EXTERNAL_CATEGORIES_API` point at the POS API (`http://localhost:4001/api/ecommerce/...` locally, or `https://posapi.pahartheke.com/...`).
- `.env` files hold real credentials (Mongo/Cloudinary/API keys) and are gitignored.

---

## 2. Install Dependencies

```bash
pnpm install
pnpm approve-builds sharp unrs-resolver
pnpm install
```

---

## 3. MongoDB

- **POS apps** (`pos-api`, `mcp`) connect via `MONGO_URI` in `apps/pos-api/.env` (default `mongodb://localhost:27018/pahar_pos_v5`).
- **main-api** connects via `MONGODB_URI` in `apps/main-api/.env` (its own database, currently MongoDB Atlas).

Provide your own MongoDB instance(s) — local or remote. `apps/pos-api/.env.example` uses a `pahar_pos_v5` database with `authSource=admin`; adjust credentials to match your server.

---

## 4. Seed Admin User (first time)

```bash
pnpm --filter pahar-pos-backend exec node seed.js
```

POS Admin: `admin@gmail.com` / `22222222`

---

## 5. Start Dev Servers

```bash
pnpm dev
```

| Service | Package | Port | URL |
|---------|---------|------|-----|
| Storefront | `pahar-storefront` | 3000 | http://localhost:3000 |
| Admin | `pahar-admin` | 3001 | http://localhost:3001 |
| Main API | `pahar-main-api` | 5000 | http://localhost:5000 |
| POS Dashboard | `pahar-pos-frontend` | 4000 | http://localhost:4000 |
| POS API | `pahar-pos-backend` | 4001 | http://localhost:4001 |
| MCP Server | `pahar-pos-mcp-server` | 4002 | http://localhost:4002/mcp |

### Individual Services

```bash
pnpm dev:pos-backend                            # POS API only (4001)
pnpm dev:pos-frontend                           # POS Dashboard only (4000)
pnpm --filter pahar-pos-mcp-server build        # compile TS -> dist/ (once)
pnpm dev:mcp                                    # MCP Server (4002, from dist/)
pnpm dev:storefront                             # storefront only (3000)
pnpm dev:admin                                  # admin only (3001)
pnpm dev:main-api                               # main API only (5000)
```

---

## Other Commands

```bash
pnpm build      # Build all (Next apps + MCP; main-api has no build script — turbo skips it)
pnpm lint       # Lint all (via turbo, cached)
pnpm clean      # Remove .next and node_modules
```

---

## Troubleshooting

### Port in use
```bash
lsof -i :4000
kill -9 <PID>
```

### Storefront/Admin can't reach the backend
- Storefront proxy routes use `BACKEND_API_URL` (see step 1).
- Admin uses `NEXT_PUBLIC_API_URL` in `apps/admin/.env.local`.
- main-api CORS: `CORS_ORIGIN` in `apps/main-api/.env` must include the storefront/admin origins (`http://localhost:3000,http://localhost:3001`).

### Reset
```bash
pnpm clean
pnpm install
```
