# Pahartheke.com — POS & Inventory System

Point-of-Sale and Inventory Management system migrated from Laravel/PHP to Node.js/Express/Next.js.

| Team | Name | ID |
|------|------|----|
| Backend | Sajid Nafiz | 007 |
| Frontend + QA | AK Shoikat | 005 |

---

## Architecture

```
apps/
├── storefront/     Next.js 16  :7100   E-commerce storefront
├── admin/          Next.js 16  :7101   Admin CMS
├── main-api/       Express 4   :7102   E-commerce API (own Mongo via apps/main-api/.env)
├── pos/            Next.js 16  :7103   POS Dashboard
├── pos-api/        Express 5   :7104   POS + inventory API
└── mcp/            MCP server  :7105   Streamable HTTP (55 AI tools)
```

---

## Quick Start

```bash
pnpm install
docker compose up -d
pnpm dev
```

See `DEVELOPMENT.md` for full local setup.

> MongoDB 7 runs via `docker-compose.yml` and must be reachable at the `MONGO_URI` in `apps/pos-api/.env` (default `mongodb://127.0.0.1:27017/pahar_pos_v5`).

| Service | URL |
|---------|-----|
| Storefront | http://localhost:7100 |
| Admin | http://localhost:7101 |
| Main API | http://localhost:7102 |
| POS Dashboard | http://localhost:7103 |
| POS API | http://localhost:7104 |
| MCP Server | http://localhost:7105/mcp |

---

## Documentation

| File | Contents |
|------|----------|
| `RUN_LOCAL.md` | Quick local setup: env files, MongoDB, seeding, service URLs |
| `DEVELOPMENT.md` | Main development guide (env files, start services, troubleshooting) |
| `RUN_PROD.md` | Production deployment (PM2, Nginx, SSL, backup) |
| `ARCHITECTURE.md` | System architecture, data flows, database schema |
| `API.md` | All API endpoints documented |
| `CHANGELOG.md` | Full changelog |
| `CONTRIBUTING.md` | Coding standards, PR process |
| `SECURITY.md` | Auth, CORS, vulnerability reporting |

---

## Tech Stack

| Layer | Stack |
|-------|-------|
| Backend | Express 5 + Mongoose 9 (ESM) |
| Frontend | Next.js 16 + React 19 + Tailwind 4 |
| Database | MongoDB 7 |
| Auth | JWT + bcryptjs + role-based + API key |
| AI | MCP Server (55 POS tools) |

---

*This project belongs to **Entrogic.com**.*
