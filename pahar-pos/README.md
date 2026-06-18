# Pahar POS

Full-stack **Point-of-Sale (POS)** and **Inventory Management** system for Pahar Theke. Includes a **MCP (Model Context Protocol) server** for AI/LLM integration.

## Architecture

```
pahar-pos/
├── backend/     # Express.js REST API (port 3002)
├── frontend/    # Next.js POS dashboard (port 3000)
└── pos-mcp/     # MCP server for AI integration
```

## Prerequisites

- Node.js 18+
- Docker (for MongoDB only)
- npm

## Quick Start

```bash
# 1. Start MongoDB
docker compose up -d

# 2. Start backend
cd backend
npm install
npm run dev

# 3. Start frontend (new terminal)
cd frontend
npm install
npm run dev

# 4. Seed database (first time only)
cd backend
node seed.js
```

## Services

| Service | Directory | URL | Dev Command |
|---------|-----------|-----|-------------|
| MongoDB | Docker | `mongodb://localhost:27017` | `docker compose up -d` |
| Backend API | `backend/` | http://localhost:3002 | `npm run dev` |
| Frontend | `frontend/` | http://localhost:3000 | `npm run dev` |
| MCP Server | `pos-mcp/` | stdio | `node src/index.js` |

## Tech Stack

### Backend
- **Runtime:** Node.js (ES Modules)
- **Framework:** Express.js 5
- **Database:** MongoDB + Mongoose 9
- **Auth:** JWT + bcryptjs
- **Real-time:** Socket.IO
- **File Upload:** Multer + Cloudinary
- **PDF:** PDFKit
- **Barcode:** bwip-js

### Frontend
- **Framework:** Next.js 16 + React 19
- **Styling:** Tailwind CSS 4
- **Icons:** Lucide React
- **HTTP Client:** Axios

### MCP Server
- **SDK:** @modelcontextprotocol/sdk
- **Validation:** Zod
- **Tools:** 55 POS operations exposed as MCP tools

## API Modules

| Module | Endpoints |
|--------|-----------|
| Auth | Register, Login, Profile |
| Products | CRUD, Barcodes, Purchase Batches |
| Categories | CRUD |
| Customers | CRUD + Badges (Loyalty) |
| Suppliers | CRUD |
| Purchases | Create, History, Costs |
| Sales | POS Sale, History, Returns |
| Stock | Levels, Movements, Adjustments, Low-Stock Alerts |
| Expenses | CRUD |
| Reports | Daily Sales, Product Sales, COGS, Profit, Returns, Expenses |
| Dashboard | KPIs, Charts, Overview |
| Settings | System Configuration |
| Ecommerce | Public product/category API for website |
| Invoice | PDF Generation |

## Frontend Pages

| Route | Page |
|-------|------|
| `/login` | Authentication |
| `/` | POS Terminal (Dashboard) |
| `/products` | Product List / New / Edit |
| `/categories` | Category Management |
| `/customers` | Customer + Badge Management |
| `/suppliers` | Supplier Management |
| `/purchases` | Purchases List / New / Costs / View |
| `/sales` | POS Sales / History / View |
| `/stock` | Stock Management |
| `/expenses` | Expense Tracking |
| `/reports/*` | Daily Sales, Product Sales, COGS, Profit, Returns, Expenses |
| `/settings` | System Settings |
| `/badges` | Customer Badge Management |

## Project Structure

```
pahar-pos/
├── docker-compose.yml          # MongoDB service only
├── backend/
│   ├── server.js               # Entry point
│   ├── seed.js                 # Database seeder
│   ├── src/
│   │   ├── app.js              # Express app (CORS, middleware, routes)
│   │   ├── config/             # DB + Cloudinary config
│   │   ├── middleware/         # Auth, role, error, upload middleware
│   │   ├── modules/            # 12 feature modules (MVC)
│   │   ├── routes/             # Route aggregator
│   │   ├── utils/              # Helpers + error classes
│   │   └── invoices/           # Generated PDFs
│   └── .env                    # Environment variables
├── frontend/
│   ├── next.config.mjs
│   ├── src/
│   │   ├── app/                # Next.js App Router pages
│   │   │   ├── (auth)/login   # Login page
│   │   │   └── (dashboard)/   # 20+ POS pages
│   │   ├── components/         # Reusable UI components
│   │   └── lib/                # Axios client
│   └── .env                    # NEXT_PUBLIC_API_URL
└── pos-mcp/
    ├── src/
    │   ├── index.js            # MCP server entry
    │   ├── tools/              # 55 tool definitions
    │   ├── services/           # Business logic
    │   └── utils/              # DB + Logger
    └── scripts/                # Import/sync scripts
```

## Environment Variables

### Backend (`backend/.env`)
```
PORT=3002
MONGO_URI=mongodb://localhost:27017/pahar_pos_v5
JWT_SECRET=pahar_pos_secret_key_12345
CLOUDINARY_CLOUD_NAME=dxacttggi
CLOUDINARY_API_KEY=your_key
CLOUDINARY_API_SECRET=your_secret
ECOMMERCE_API_KEY=pahar_pos_api_key_2024
```

### Frontend (`frontend/.env`)
```
NEXT_PUBLIC_API_URL=http://localhost:3002/api
```

## Docker Setup

MongoDB runs in Docker:

```bash
docker compose up -d       # Start MongoDB
docker compose down        # Stop MongoDB
docker compose down -v     # Stop + delete data
```

## Database

Single MongoDB instance with multiple databases:

- `pahar_pos_v5` — POS system data

## Connection with Pahar Main (E-commerce)

```
pahar-main (E-commerce)  ──┬── Frontend API Routes → posapi.pahartheke.com/api/ecommerce/*
                           │     (reads products/categories from POS)
                           │
                           ├── Ecommerce API → POST /ecommerce/orders
                           │     (creates sales with API key auth)
                           │
                           └── Sync Script → pos-mcp/scripts/sync-pahartheke.mjs
                                 (pulls data from main site into POS)
```

## MCP Tools (55)

The `pos-mcp` server exposes all major POS operations as MCP tools:
- **Create:** product, category, customer, supplier, sale, purchase, expense, badge, stock-adjustment, user
- **Read:** products, customers, suppliers, sales, purchases, expenses, reports (6 types), dashboard, stock, settings, users
- **Update:** product, category, customer, supplier, expense, badge, settings, user
- **Delete:** product, category, customer, supplier, sale, purchase, expense, badge, user
