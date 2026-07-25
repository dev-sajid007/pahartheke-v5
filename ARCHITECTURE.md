# System Architecture

## Overview

Pahartheke.com is a three-tier monorepo with two independent backend services (E-commerce + POS) sharing frontend proxy routes, two MongoDB databases on a single Docker instance, and a MCP AI server for POS automation.

```
                    BROWSER / CLIENT LAYER
  ┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐
  │ Storefront      │  │ Admin CMS       │  │ POS Dashboard   │
  │ :3000           │  │ :3001           │  │ :4000           │
  └───────┬─────────┘  └───────┬─────────┘  └───────┬─────────┘
          │                    │                     │
          ▼                    ▼                     ▼
                    API GATEWAY / BFF LAYER
          │  (Next.js App Router Proxy Routes)       │
  ┌───────┴─────────┐                                │
  │ /api/auth/*     │──► Main API :5000              │
  │ /api/orders     │──► Main API :5000              │
  │ /api/landing-*  │──► Main API :5000              │
  │ /api/products/* │──► POS API :4001               │
  │ /api/categories │──► POS API :4001               │
  └─────────────────┘                                │
          │                    │                     │
          ▼                    ▼                     ▼
                    BACKEND LAYER
  ┌──────────────────────────┐ ┌──────────────────────────────┐
  │ MAIN API :5000           │ │ POS API :4001                 │
  │ Express 4 + Mongoose 8   │ │ Express 5 + Mongoose 9       │
  │ Models: User, Product,   │ │ Models: User, Category,      │
  │ Order, LandingPage       │ │ Product, Purchase, Sale,     │
  │                          │ │ Customer, Supplier, Expense, │
  │                          │ │ StockMovement, Settings,     │
  │                          │ │ PurchaseBatch, Badge         │
  └───────────┬──────────────┘ └──────────────────┬───────────┘
              │                                    │
              ▼                                    ▼
                    DATA LAYER
  ┌──────────────────────┐  ┌──────────────────────────────┐
  │ MongoDB: pahar_theke │  │ MongoDB: pahar_pos_v5        │
  │ Port: 27017          │  │ Port: 27018                  │
  └──────────────────────┘  └──────────────────────────────┘

  ┌──────────────────────┐
  │ Cloudinary CDN        │  ← Image/Video Storage
  └──────────────────────┘
```

---

## Services & Ports

| Service | Port | App | Purpose |
|---------|------|-----|---------|
| Storefront | 3000 | `apps/storefront` | Customer e-commerce site (Next.js) |
| Admin CMS | 3001 | `apps/admin` | Landing page content management |
| Main API | 5000 | `apps/main-api` | Auth, orders, landing page CRUD |
| POS Dashboard | 4000 | `apps/pos` | POS & inventory management |
| POS API | 4001 | `apps/pos-api` | All POS CRUD + ecommerce public API |
| MongoDB (Main) | 27017 | Docker | `pahar_theke` database |
| MongoDB (POS) | 27018 | Docker | `pahar_pos_v5` database |
| MCP Server | stdio | `apps/mcp` | AI/LLM integration (55 tools) |

---

## Monorepo Structure

```
pahartheke-v5/
├── apps/
│   ├── storefront/     # Next.js customer storefront (port 3000)
│   │   └── src/
│   │       ├── app/          # App Router pages + API proxies
│   │       ├── components/   # React components
│   │       ├── features/     # Redux slices
│   │       └── lib/          # Utilities
│   ├── admin/          # Next.js admin CMS (port 3001)
│   │   ├── app/        # Dashboard pages
│   │   ├── components/ # UI components
│   │   └── lib/        # API client
│   ├── pos/            # Next.js POS dashboard (port 4000)
│   │   └── src/
│   │       ├── app/          # POS pages
│   │       └── components/   # Modals, grid, cart
│   ├── main-api/       # Express 4 API (port 5000)
│   │   └── src/
│   │       ├── config/      # DB + Cloudinary
│   │       ├── middleware/  # JWT auth
│   │       ├── models/      # Mongoose schemas
│   │       └── routes/      # Route handlers
│   ├── pos-api/        # Express 5 API (port 4001)
│   │   └── src/
│   │       ├── config/      # DB + Cloudinary
│   │       ├── middleware/  # Auth, roles, API key
│   │       ├── modules/     # 12 feature modules (MVC)
│   │       └── routes/      # Route aggregator
│   └── mcp/            # MCP AI server
│       ├── tools/      # 55 MCP tool definitions
│       ├── services/   # Business logic
│       └── scripts/    # Import/sync utilities
├── docker/
│   ├── compose.main.yml  # Main MongoDB (port 27017)
│   └── compose.pos.yml   # POS MongoDB (port 27018)
├── package.json
├── pnpm-workspace.yaml
├── turbo.json
└── *.md
```

---

## Data Flows

### E-Commerce Customer Flow
```
Browser :3000  →  Next.js BFF  →  Main API :5000 / POS API :4001
```

### POS Dashboard Flow
```
Browser :4000  →  POS API :4001
```

### Admin CMS Flow
```
Browser :3001  →  Main API :5000  →  Cloudinary
```

---

## Database Schema

### `pahar_theke` (Main E-commerce)
```
User ──► Order
Product
LandingPage (CMS content)
```

### `pahar_pos_v5` (POS & Inventory)
```
User ──► Sale ──► Customer ──► Badge
Product ◄── Category
Purchase ──► Supplier ──► PurchaseCost ──► PurchaseBatch (FIFO) ──► StockMovement
Settings, Expense
```

---

## Key Design Decisions

1. **Two backends, not one** — Main API (Express 4) and POS API (Express 5) are independent for separate scaling.
2. **MongoDB over MySQL** — Migrated from Laravel/MySQL for schema flexibility.
3. **FIFO via PurchaseBatches** — Accurate COGS tracking.
4. **Next.js as BFF** — Storefront proxies API calls, shielding client from backend URLs.
5. **MCP for AI** — 55 POS operations exposed for LLM-driven automation.
6. **Separate MongoDB ports** — Main DB on 27017, POS DB on 27018.
