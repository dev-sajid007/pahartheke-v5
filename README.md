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
├── storefront/     Next.js 16  :3000   E-commerce storefront
├── admin/          Next.js 16  :3001   Admin CMS
├── main-api/       Express 4   :5000   E-commerce API (own Mongo via apps/main-api/.env)
├── pos/            Next.js 16  :4000   POS Dashboard
├── pos-api/        Express 5   :4001   POS + inventory API
└── mcp/            MCP server  :4002   Streamable HTTP (55 AI tools)
```

---

## Quick Start

```bash
pnpm install
pnpm dev
```

> MongoDB 7 must be running and reachable at the `MONGO_URI` in `apps/pos-api/.env` (default `mongodb://localhost:27018/pahar_pos_v5`).

| Service | URL |
|---------|-----|
| Storefront | http://localhost:3000 |
| Admin | http://localhost:3001 |
| Main API | http://localhost:5000 |
| POS Dashboard | http://localhost:4000 |
| POS API | http://localhost:4001 |
| MCP Server | http://localhost:4002/mcp |

---

## Documentation

| File | Contents |
|------|----------|
| `RUN_DEV.md` | Development setup (env files, start services, troubleshooting) |
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
