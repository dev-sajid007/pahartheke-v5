# Pahartheke.com

Full-stack e-commerce + POS system. Migrated from Laravel/PHP to Node.js, Express, Next.js.

| Team | Name | ID |
|------|------|----|
| Backend | Sajid Nafiz | 007 |
| Frontend + QA | AK Shoikat | 005 |

---

## Architecture

```
apps/
├── storefront/     Next.js 16  :3000   Customer storefront
├── admin/          Next.js 16  :3001   Admin CMS
├── main-api/       Express 4   :5000   Auth, orders, landing page
├── pos/            Next.js 16  :4000   POS dashboard
├── pos-api/        Express 5   :4001   POS + inventory API
└── mcp/            MCP server  stdio   55 AI tools
docker/
├── compose.main.yml  MongoDB  :27017  pahar_theke
└── compose.pos.yml   MongoDB  :27018  pahar_pos_v5
```

---

## Quick Start

```bash
pnpm install
docker compose -f docker/compose.main.yml up -d
docker compose -f docker/compose.pos.yml up -d
pnpm dev
```

| Service | URL |
|---------|-----|
| Storefront | http://localhost:3000 |
| Admin CMS | http://localhost:3001 |
| POS Dashboard | http://localhost:4000 |
| Main API | http://localhost:5000 |
| POS API | http://localhost:4001 |

---

## Documentation

| File | Contents |
|------|----------|
| `RUN_DEV.md` | Development setup (env files, start services, troubleshooting) |
| `RUN_PROD.md` | Production deployment (PM2, Nginx, SSL, backup) |
| `ARCHITECTURE.md` | System architecture, data flows, database schema |
| `API.md` | All 75 API endpoints documented |
| `CHANGELOG.md` | Full changelog across all sessions |
| `CONTRIBUTING.md` | Coding standards, PR process |
| `SECURITY.md` | Auth, rate limiting, vulnerability reporting |

---

## Tech Stack

| Layer | Stack |
|-------|-------|
| Backend | Express 4/5 + Mongoose 8/9 (ESM) |
| Frontend | Next.js 16 + React 19 + Tailwind 4 + Redux Toolkit |
| Database | MongoDB 7 (Docker, 2 instances) |
| Auth | JWT + bcryptjs + role-based + API key |
| CDN | Cloudinary |
| AI | MCP Server (55 POS tools) |

---

*This project belongs to **Entrogic.com**.*
