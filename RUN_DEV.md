# Development Setup — Manual Run Guide

## Prerequisites

- Node.js 18+
- Docker
- **pnpm 11** (`npm install -g pnpm`)

---

## 1. Environment Files

Create `.env` files from examples:

```bash
cp apps/main-api/.env.example apps/main-api/.env
cp apps/pos-api/.env.example apps/pos-api/.env
cp apps/mcp/.env.example apps/mcp/.env
```

Create frontend `.env.local` files manually:

**`apps/storefront/.env.local`**
```
POS_API_BASE_URL=http://localhost:4001/api/ecommerce
BACKEND_API_URL=http://localhost:5000
ECOMMERCE_API_KEY=pahar_pos_api_key_2024
NEXT_PUBLIC_SITE_URL=http://localhost:3000
NEXT_PUBLIC_ADMIN_URL=http://localhost:3001
```

**`apps/pos/.env.local`**
```
NEXT_PUBLIC_API_URL=http://localhost:4001/api
```

**`apps/admin/.env.local`**
```
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

> **Note:** POS API MongoDB is on port **27018** (not 27017). The `.env.example` has the correct port.

---

## 2. Install Dependencies

```bash
pnpm install
```

If prompted about build scripts (sharp, unrs-resolver), approve them:

```bash
pnpm approve-builds sharp unrs-resolver
pnpm install
```

---

## 3. Start MongoDB

If containers already exist (from a previous session):

```bash
docker start pahartheke-mongodb pahar-pos-mongo
```

If running for the first time:

```bash
docker compose -f docker/compose.main.yml up -d
docker compose -f docker/compose.pos.yml up -d
```

---

## 4. Seed Admin Users (first time only)

```bash
pnpm --filter pahar-theke-backend exec node src/seed.js
pnpm --filter pahar-pos-backend exec node seed.js
```

| System | Email | Password |
|--------|-------|----------|
| Storefront / Admin CMS | `admin@pahar.com` | `admin123` |
| POS Dashboard | `admin@gmail.com` | `22222222` |

---

## 5. Start All Dev Servers

```bash
pnpm dev
```

Runs all 5 services in parallel via Turborepo:

| Service | Port | URL |
|---------|------|-----|
| Main API | 5000 | http://localhost:5000 |
| POS API | 4001 | http://localhost:4001 |
| Storefront | 3000 | http://localhost:3000 |
| Admin CMS | 3001 | http://localhost:3001 |
| POS Dashboard | 4000 | http://localhost:4000 |

### Or Start Individual Services

```bash
pnpm dev:backend       # Main API only (port 5000)
pnpm dev:frontend      # Storefront only (port 3000)
pnpm dev:admin         # Admin CMS only (port 3001)
pnpm dev:pos-backend   # POS API only (port 4001)
pnpm dev:pos-frontend  # POS Dashboard only (port 4000)
pnpm dev:mcp           # MCP Server (stdio)
```

---

## Other Commands

```bash
pnpm build      # Build all (Next.js apps)
pnpm lint       # Lint all packages (via turbo, cached)
pnpm clean      # Remove all .next and node_modules
```

---

## Troubleshooting

### Port already in use
```bash
lsof -i :3000   # or :5000, :4001, etc.
kill -9 <PID>
```

### Docker container name conflict
If `docker compose up` says "container name already in use", the containers are already created but stopped. Use:
```bash
docker start pahartheke-mongodb pahar-pos-mongo
```

### MongoDB won't connect
```bash
docker ps
docker logs pahartheke-mongodb
docker logs pahar-pos-mongo
```

### Next.js Turbopack module resolution
If storefront gives "Couldn't find Next.js package" error, ensure `apps/storefront/next.config.mjs` has:
```js
turbopack: {
  root: path.resolve(__dirname, '../../'),
}
```
This tells Turbopack to look for packages in the monorepo root `node_modules`.

### Reset everything
```bash
docker compose -f docker/compose.main.yml down
docker compose -f docker/compose.pos.yml down
pnpm clean
pnpm install
```
