# System Architecture

## Overview

Pahartheke.com is a three-tier monorepo with two independent backend services (E-commerce + POS) sharing frontend proxy routes, two MongoDB databases on a single Docker instance, and a MCP AI server for POS automation.

```
                    BROWSER / CLIENT LAYER
  ┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐
  │ E-Commerce      │  │ Admin CMS       │  │ POS Dashboard   │
  │ Next.js :3000   │  │ Next.js :3001   │  │ Next.js :4000   │
  └───────┬─────────┘  └───────┬─────────┘  └───────┬─────────┘
          │                    │                     │
          ▼                    ▼                     ▼
                    API GATEWAY / BFF LAYER
          │  (Next.js App Router Proxy Routes)       │
  ┌───────┴─────────┐                                │
  │ /api/auth/*     │──► Express :5000               │
  │ /api/orders     │──► Express :5000               │
  │ /api/landing-*  │──► Express :5000               │
  │ /api/products/* │──► POS Ecommerce API :4001     │
  │ /api/categories │──► POS Ecommerce API :4001     │
  └─────────────────┘                                │
          │                    │                     │
          ▼                    ▼                     ▼
                    BACKEND LAYER
  ┌──────────────────────────┐ ┌──────────────────────────────┐
  │ pahar-main BACKEND :5000 │ │ pahar-pos BACKEND :4001      │
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
  └──────────────────────┘  └──────────────────────────────┘
         MongoDB 7 Docker (2 databases, 1 instance)

  ┌──────────────────────┐
  │ Cloudinary CDN        │  ← Image/Video Storage
  └──────────────────────┘
```

---

## Services & Ports

| Service | Port | URL | Purpose |
|---------|------|-----|---------|
| Main Storefront | 3000 | http://localhost:3000 | Customer e-commerce site |
| Admin CMS | 3001 | http://localhost:3001 | Landing page content management |
| Main Backend API | 5000 | http://localhost:5000 | Auth, orders, products, landing page |
| POS Dashboard | 4000 | http://localhost:4000 | POS & inventory management |
| POS Backend API | 4001 | http://localhost:4001 | All POS CRUD + ecommerce public API |
| MongoDB (Main) | 27017 | Docker | `pahar_theke` database |
| MongoDB (POS) | 27018 | Docker | `pahar_pos_v5` database |
| MCP Server | stdio | Internal | AI/LLM integration (55 tools) |

---

## Data Flow

### E-Commerce Customer Flow
```
Browser :3000  →  Next.js BFF  →  Express :5000 / POS :4001
     │                │                    │
     │─ GET /shop ────►── /api/products ──────────────────► POS
     │◄─ products ◄──◄───────────────────────────────────│
     │                │                    │
     │─ POST /login ─►── /api/auth/login ──► Main Backend
     │◄─ JWT cookie ◄─◄───────────────────│
     │                │                    │
     │─ POST /orders ─►── /api/orders ────────────────────► POS
     │◄─ confirmed ◄─◄───────────────────────────────────│
```

### POS Dashboard Flow
```
Browser :4000  →  Express :4001
     │                    │
     │─ POST /login ─────► JWT auth
     │─ GET /dashboard ──► Aggregation
     │─ POST /sales ─────► Sale + FIFO stock deduction
     │─ GET /reports ────► Aggregation pipelines
     │─ GET /invoices ───► PDFKit generation
```

### Admin CMS Flow
```
Browser :3001  →  Express :5000  →  Cloudinary
     │                    │              │
     │─ POST /login ─────►│              │
     │─ GET /landing ────►│              │
     │─ PUT /landing ────►│              │
     │─ POST /upload ────►│─────────────►│
```

---

## Monorepo Structure

```
pahartheke-v5/
├── start-all.sh              # Launch all 6 services
├── pahar-main/
│   ├── backend/              # Express 4 API (port 5000)
│   │   └── src/
│   │       ├── config/       # DB + Cloudinary
│   │       ├── middleware/   # JWT auth
│   │       ├── models/       # Mongoose schemas
│   │       └── routes/       # Route handlers
│   ├── frontend/             # Next.js storefront (port 3000)
│   │   └── src/
│   │       ├── app/          # App Router pages + API proxies
│   │       ├── components/   # React components
│   │       ├── features/     # Redux slices
│   │       └── lib/          # Utilities
│   └── admin/                # Next.js CMS (port 3001)
│       ├── app/              # Dashboard pages
│       ├── components/       # UI components
│       └── lib/              # API client
└── pahar-pos/
    ├── backend/              # Express 5 API (port 4001)
    │   └── src/
    │       ├── config/       # DB + Cloudinary
    │       ├── middleware/   # Auth, roles, API key, error
    │       ├── modules/      # 12 feature modules (MVC)
    │       └── routes/       # Route aggregator
    ├── frontend/             # Next.js POS (port 4000)
    │   └── src/
    │       ├── app/          # POS pages
    │       └── components/   # Modals, grid, cart
    └── pos-mcp/              # MCP AI server
        ├── tools/            # 55 MCP tool definitions
        ├── services/         # Business logic
        └── scripts/          # Import/sync utilities
```

---

## Database Schema

### `pahar_theke` (Main E-commerce)
```
User ──► Order
Product
LandingPage (single document for CMS content)
```

### `pahar_pos_v5` (POS & Inventory)
```
User ──► Sale ──► Customer ──► Badge
              │
Product ◄── Category
  │
Purchase ──► Supplier
  │
PurchaseCost
  │
PurchaseBatch (FIFO)
  │
StockMovement (audit trail)
  │
Settings (store config)
  │
Expense
```

---

## Key Design Decisions

1. **Two backends, not one** — E-commerce (Express 4) and POS (Express 5) are independent to allow separate scaling and deployment.

2. **MongoDB over MySQL** — Migrated from Laravel/MySQL for schema flexibility with varying product attributes.

3. **FIFO via PurchaseBatches** — Inventory cost tracking uses purchase batches for accurate COGS.

4. **Next.js as BFF** — The storefront App Router proxies API calls, shielding the client from backend URLs and adding caching.

5. **MCP for AI** — 55 POS operations exposed as MCP tools enable LLM-driven POS automation.

6. **Separate MongoDB ports** — Main DB on 27017, POS DB on 27018 to avoid port collision in Docker.
