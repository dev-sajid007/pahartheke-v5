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
├── pos/            Next.js 16  :4000   POS Dashboard
├── pos-api/        Express 5   :4001   POS + inventory API
└── mcp/            MCP server  :4002   Streamable HTTP (55 AI tools)
docker/
└── compose.pos.yml  MongoDB    :27018  pahar_pos_v5
```

---

## Quick Start

```bash
pnpm install
docker compose -f docker/compose.pos.yml up -d
pnpm dev
```

| Service | URL |
|---------|-----|
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
| Database | MongoDB 7 (Docker) |
| Auth | JWT + bcryptjs + role-based + API key |
| AI | MCP Server (55 POS tools) |

---

*This project belongs to **Entrogic.com**.*
