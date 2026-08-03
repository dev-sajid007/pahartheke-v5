# Development Setup

## Prerequisites

- Node.js 18+
- Docker
- **pnpm 11** (`npm install -g pnpm`)

---

## 1. Environment Files

```bash
cp apps/pos-api/.env.example apps/pos-api/.env
cp apps/mcp/.env.example apps/mcp/.env
cp apps/pos/.env.example apps/pos/.env
```

**`apps/pos/.env`**
```
PORT=4000
NEXT_PUBLIC_API_URL=http://localhost:4001/api
```

> `PORT` is read from `.env` by `apps/pos/scripts/run.mjs` and passed to `next dev`/`next start` (Next.js itself cannot read `PORT` from `.env`).

---

## 2. Install Dependencies

```bash
pnpm install
pnpm approve-builds sharp unrs-resolver
pnpm install
```

---

## 3. Start MongoDB

```bash
docker compose -f docker/compose.pos.yml up -d
```

---

## 4. Seed Admin User (first time)

```bash
pnpm --filter pahar-pos-backend exec node seed.js
```

Admin: `admin@gmail.com` / `22222222`

---

## 5. Start Dev Servers

```bash
pnpm dev
```

| Service | Port | URL |
|---------|------|-----|
| POS API | 4001 | http://localhost:4001 |
| POS Dashboard | 4000 | http://localhost:4000 |

### Individual Services

```bash
pnpm dev:pos-backend   # POS API only (port 4001)
pnpm dev:pos-frontend  # POS Dashboard only (port 4000)
pnpm dev:mcp           # MCP Server (stdio)
```

---

## Other Commands

```bash
pnpm build      # Build all
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

### MongoDB container exists but stopped
```bash
docker start pahar-pos-mongo
```

### Reset
```bash
docker compose -f docker/compose.pos.yml down
pnpm clean
pnpm install
```
