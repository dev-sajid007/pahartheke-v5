# Pahar Theke

**E-commerce platform + POS (Point of Sale) system** — full-stack retail management solution.

## Projects

| Project | Description | Tech Stack |
|---------|-------------|------------|
| [`pahar-pos/`](./pahar-pos) | POS & Inventory Management system | Express.js 5 + Next.js 16 + MongoDB |
| [`pahar-main/`](./pahar-main) | Customer-facing E-commerce website + Admin CMS | Express.js 4 + Next.js 16 + MongoDB |

## Quick Start

```bash
# Start everything with one command
./start-all.sh
```

Or start individually:

```bash
# 1. Start MongoDB (required for both projects)
docker compose -f pahar-pos/docker-compose.yml up -d

# 2. Start pahar-main (e-commerce)
cd pahar-main/backend && npm run dev      # http://localhost:5000
cd pahar-main/frontend && npm run dev     # http://localhost:3000
cd pahar-main/admin && npm run dev -p 3001 # http://localhost:3001

# 3. Start pahar-pos (POS)
cd pahar-pos/backend && npm run dev       # http://localhost:4001
cd pahar-pos/frontend && npm run dev -p 4000 # http://localhost:4000
```

## Services

| Service | Port | URL | Project |
|---------|------|-----|---------|
| MongoDB | 27017 | (Docker) | Shared |
| Main Storefront | 3000 | http://localhost:3000 | pahar-main |
| Main Admin | 3001 | http://localhost:3001 | pahar-main |
| Main API | 5000 | http://localhost:5000 | pahar-main |
| POS Dashboard | 4000 | http://localhost:4000 | pahar-pos |
| POS API | 4001 | http://localhost:4001 | pahar-pos |

## Architecture

```
                          ┌──────────────────────┐
                          │     Cloudinary        │
                          │   (Image/Video CDN)   │
                          └──────┬───────────────┘
                                 │
        ┌────────────────────────┼────────────────────────┐
        │                        │                        │
        ▼                        ▼                        ▼
┌───────────────┐     ┌──────────────────┐     ┌──────────────────┐
│  pahar-main   │     │   pahar-pos      │     │  External POS    │
│  (E-commerce) │◄───►│  (POS System)    │◄───►│  API             │
│               │     │                  │     │  posapi...com    │
└───────┬───────┘     └────────┬─────────┘     └──────────────────┘
        │                      │
        └──────────┬───────────┘
                   ▼
        ┌──────────────────────┐
        │     MongoDB 7        │
        │   (Docker - local)   │
        │  ┌────────────────┐  │
        │  │ pahar_pos_v5   │  │  ← POS data
        │  │ pahar_theke    │  │  ← E-commerce data
        │  └────────────────┘  │
        └──────────────────────┘
```

## Connection Between Projects

```
pahar-main ◄──────────────────────────────► pahar-pos
     │                                            │
     ├── Frontend API routes fetch products        │
     │   from posapi.pahartheke.com (public)       │
     │                                            │
     ├── Submits orders → POST /ecommerce/orders   │
     │   (API key: pahar_pos_api_key_2024)         │
     │                                            │
     └── Sync script pulls data ◄──────────────────┘
         (pos-mcp/scripts/sync-pahartheke.mjs)
```

## Tech Stack Overview

| Layer | pahar-pos (POS) | pahar-main (E-commerce) |
|-------|-----------------|------------------------|
| **Backend** | Express.js 5 + Mongoose 9 | Express.js 4 + Mongoose 8 |
| **Frontend** | Next.js 16 + React 19 + Tailwind 4 | Next.js 16 + Redux + Tailwind 4 |
| **Admin** | — | Next.js 16 (TypeScript) |
| **DB** | MongoDB (Docker) | MongoDB (Docker) |
| **Auth** | JWT + Role-based | JWT |
| **Extra** | Socket.IO, PDFKit, bwip-js (barcodes) | shadcn/ui, Embla Carousel |
| **MCP** | 55 AI tools via Model Context Protocol | — |

## Prerequisites

- **Node.js** 18+
- **Docker** (for MongoDB only)
- **npm**

## Files

| File | Purpose |
|------|---------|
| [`start-all.sh`](./start-all.sh) | Launch all services with one command |
| [`.gitignore`](./.gitignore) | Root-level gitignore |
| [`pahar-pos/README.md`](./pahar-pos/README.md) | POS project details |
| [`pahar-main/README.md`](./pahar-main/README.md) | E-commerce project details |