# System Architecture

## Overview

Three-tier POS & Inventory system with an Express 5 API, Next.js dashboard, MongoDB database, and MCP AI server.

```
                    BROWSER LAYER
                  ┌──────────────┐
                  │ POS Dashboard│
                  │ Next.js :4000│
                  └──────┬───────┘
                         │
                         ▼
                    BACKEND LAYER
                  ┌──────────────┐
                  │ POS API :4001│
                  │ Express 5    │
                  │ Mongoose 9   │
                  └──────┬───────┘
                         │
                         ▼
                    DATA LAYER
                  ┌──────────────┐
                  │ MongoDB      │
                  │ pahar_pos_v5 │
                  │ Port 27018   │
                  └──────────────┘
```

## Services

| Service | Port | Purpose |
|---------|------|---------|
| POS Dashboard | 4000 | POS terminal & inventory management |
| POS API | 4001 | All POS CRUD + ecommerce public API |
| MongoDB (POS) | 27018 | `pahar_pos_v5` database |
| MCP Server | stdio | AI/LLM integration (55 tools) |

## Database Schema

```
User ──► Sale ──► Customer ──► Badge
Product ◄── Category
Purchase ──► Supplier ──► PurchaseCost
  └── PurchaseBatch (FIFO) ──► StockMovement
Settings
Expense
```

## Monorepo Structure

```
pahartheke-v5/
├── apps/
│   ├── pos/         # Next.js dashboard
│   ├── pos-api/     # Express 5 API
│   │   └── src/
│   │       ├── modules/   # 12 feature modules (MVC)
│   │       ├── middleware/ # Auth, roles, error handling
│   │       ├── config/    # DB + Cloudinary
│   │       └── routes/    # Route aggregator
│   └── mcp/         # MCP AI server
│       ├── tools/   # 55 MCP tools
│       ├── services/ # Business logic
│       └── scripts/  # Import utilities
├── docker/
│   └── compose.pos.yml
├── package.json
├── pnpm-workspace.yaml
└── turbo.json
```
