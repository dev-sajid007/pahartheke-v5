# Pahar Theke — E-commerce Platform

E-commerce platform with a **Node.js/Express backend**, **Next.js customer storefront**, and **Next.js admin panel**. MongoDB via Docker.

## Architecture

```
pahar-main/
├── backend/     # Express.js REST API (port 5000)
├── frontend/    # Customer-facing Next.js storefront (port 3000)
└── admin/       # Admin panel Next.js app (port 3001)
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

# 4. Start admin panel (new terminal)
cd admin
npm install
npm run dev
```

## Services

| Service | Directory | URL | Dev Command |
|---------|-----------|-----|-------------|
| MongoDB | Docker | `mongodb://localhost:27017` | `docker compose up -d` |
| Backend API | `backend/` | http://localhost:5000 | `npm run dev` |
| Storefront | `frontend/` | http://localhost:3000 | `npm run dev` |
| Admin Panel | `admin/` | http://localhost:3001 | `npm run dev` |
| POS Backend | `pahar-pos/backend/` | http://localhost:4001 | `npm run dev` |

## Running Status

| Service | Status |
|---------|--------|
| Frontend (port 3000) | ✅ All pages render, order flow complete |
| POS Backend (port 4001) | ✅ Products, categories, orders API active |
| Main Backend (port 5000) | ✅ Auth, landing page API active |
| MongoDB | ✅ Via Docker |

## Tech Stack

### Backend
- **Runtime:** Node.js (ES Modules)
- **Framework:** Express.js 4
- **Database:** MongoDB + Mongoose 8
- **Auth:** JWT + bcryptjs
- **File Upload:** Multer + Cloudinary
- **Security:** Helmet, CORS
- **Dev:** Nodemon

### Frontend (Storefront)
- **Framework:** Next.js 16 + React 19
- **Routing:** App Router
- **State:** Redux Toolkit 2 + react-redux 9
- **Styling:** Tailwind CSS 4 + shadcn/ui + tw-animate-css
- **HTTP:** Native `fetch` (custom wrapper with timeout)
- **Carousel:** Embla (categories), Swiper (products)
- **Icons:** Lucide React
- **Notifications:** Sonner
- **Theme:** next-themes

### Admin Panel
- **Framework:** Next.js 16 (TypeScript)
- **Styling:** Tailwind CSS 4
- **Icons:** Lucide React
- **UI:** shadcn/ui components

## Backend API

| Route | Description |
|-------|-------------|
| `POST /api/auth/register` | User registration |
| `POST /api/auth/login` | User login |
| `GET /api/auth/me` | Current user profile |
| `GET/POST /api/products` | List/Create products |
| `GET/PUT/DELETE /api/products/:id` | Single product CRUD |
| `GET/POST /api/orders` | List/Create orders |
| `GET/PUT/DELETE /api/orders/:id` | Single order CRUD |
| `GET/PUT /api/landing-page` | Landing page sections |
| `POST /api/upload` | File upload to Cloudinary |

## Frontend Pages (Storefront)

| Route | Page |
|-------|------|
| `/` | Homepage (Hero, Featured, Affiliate, Invest, About, Reviews) |
| `/shop` | Product listing |
| `/products/[id]` | Product detail |
| `/category/[slug]` | Category browse |
| `/cart` | Shopping cart |
| `/checkout` | Checkout (COD, Online) |
| `/order/success` | Order confirmation page |
| `/auth/login` | Login |
| `/auth/register` | Register |
| `/auth/profile` | User profile |
| `/orders` | Order history |
| `/invest` | Investment page |

## Admin Panel Pages

| Route | Page |
|-------|------|
| `/login` | Admin login |
| `/` | Dashboard (section cards) |
| `/hero` | Hero section editor (video, CTA) |
| `/affiliate` | Affiliate banner editor |
| `/invest` | Invest banner editor |
| `/about` | About/Why Bengal Meat section |
| `/reviews` | Customer reviews/testimonials |
| `/footer` | Footer content editor |

## Project Structure

```
pahar-main/
├── docker-compose.yml          # MongoDB service only
├── backend/
│   ├── server.js               # Entry point
│   ├── seed.js                 # Default admin seeder
│   ├── src/
│   │   ├── config/             # DB + Cloudinary config
│   │   ├── middleware/         # Auth middleware
│   │   ├── models/             # Product, Order, User, LandingPage
│   │   └── routes/             # API route handlers
│   └── .env                    # Environment variables
├── frontend/
│   ├── next.config.mjs
│   ├── src/
│   │   ├── app/                # Next.js App Router pages
│   │   ├── components/         # UI + feature components
│   │   ├── store/              # Redux (cart, products, orders, user, ui)
│   │   ├── services/           # API client
│   │   ├── hooks/              # Custom hooks
│   │   ├── lib/                # Utilities + adapters
│   │   └── types/              # TypeScript interfaces
│   └── package.json
└── admin/
    ├── next.config.ts
    ├── middleware.ts            # Auth guard
    ├── lib/api.ts              # API helpers
    ├── components/             # Sidebar, SaveButton, ImageUploader
    └── app/                    # Dashboard pages
```

## Environment Variables

### Backend (`backend/.env`)
```
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017
MONGODB_DB_NAME=pahar_theke
EXTERNAL_PRODUCT_API=https://posapi.pahartheke.com/api/ecommerce/products
EXTERNAL_CATEGORIES_API=https://posapi.pahartheke.com/api/ecommerce/categories
CORS_ORIGIN=http://localhost:3000,http://localhost:3001
CLOUDINARY_CLOUD_NAME=dxacttggi
CLOUDINARY_API_KEY=your_key
CLOUDINARY_API_SECRET=your_secret
JWT_SECRET=your_jwt_secret_key_here_change_in_production
```

### Frontend (`frontend/.env`)
```
POS_API_BASE_URL=http://localhost:4001/api/ecommerce
BACKEND_API_URL=http://localhost:5000
ECOMMERCE_API_KEY=pahar_pos_api_key_2024
NEXT_PUBLIC_SITE_URL=http://localhost:3000
NEXT_PUBLIC_ADMIN_URL=http://localhost:3001
```

## Docker Setup

```bash
docker compose up -d       # Start MongoDB
docker compose down        # Stop
docker compose down -v     # Stop + delete data
```

## Database

Single MongoDB instance with multiple databases:

- `pahar_theke` — E-commerce data (products, orders, users, landing page)

## Connection with Pahar POS

```
pahar-pos (POS System) ──┬── Public API: /api/ecommerce/products, /api/ecommerce/categories
                         │     (consumed by pahar-main frontend proxy routes)
                         │
                         ├── POST /api/ecommerce/orders (API key: pahar_pos_api_key_2024)
                         │     (creates POS sale with source: "website")
                         │
                         └── Sync Script (pos-mcp/scripts/sync-pahartheke.mjs)
                               Pulls categories, products, customers, orders
                               from pahar-main into pahar-pos via MCP API
```

## External Integrations

- **Cloudinary** — Image/video hosting
- **Pahar POS API** (`posapi.pahartheke.com`) — Product & category sync
- **Payment Methods:** Cash on Delivery, Online Payment

## Changelog — Recent Fixes & Features

### 1. Turbopack Root Resolution
- **File:** `frontend/next.config.mjs`
- **Fix:** Added `turbopack.root: process.cwd()` to resolve modules from correct workspace root
- **Issue:** "Cannot find module 'sonner'" — Turbopack inferred wrong root from duplicate lockfiles

### 2. Hydration Mismatch Fix
- **File:** `frontend/src/components/common/header.jsx`
- **Fix:** Replaced `useEffect` with `useSyncExternalStore` for cart badge visibility
- **Issue:** Cart badge rendered differently on server vs client → hydration error on every page

### 3. Error Boundary — Checkout
- **File:** `frontend/src/app/checkout/error.jsx` (new)
- **Fix:** Added error boundary with "Try again / Return to shop" fallback UI

### 4. Theme-Aware Alert Component
- **File:** `frontend/src/components/ui/alert.jsx` (new)
- **Fix:** Reusable Alert with `destructive`/`success` variants, dark mode support

### 5. Removed Static Fallback Data
- **Files:** `frontend/src/app/shop/page.jsx`, `frontend/src/components/common/Sidebar.jsx`
- **Fix:** Removed all hardcoded `FALLBACK_PRODUCTS`, `FALLBACK_CATEGORIES`, `CATEGORIES`, `TAGS` arrays
- **Result:** Shop page fully API-driven — no fake products when API fails

### 6. Category Filter Name-to-Slug Mapping
- **File:** `frontend/src/app/shop/page.jsx`
- **Fix:** Built `nameToSlug` map to convert category names ("Rice & Grains") to slugs ("rice-grains")
- **Issue:** Products had name strings, sidebar used slugs → filter never matched

### 7. Null-Safe Product Normalization
- **File:** `frontend/src/app/shop/page.jsx`
- **Fix:** Added try/catch, `String()` wrappers, `??` operator, `.filter(Boolean)`
- **Issue:** One malformed product threw during `.map()`, killed all products silently

### 8. Isolated Error Handling
- **File:** `frontend/src/app/shop/page.jsx`
- **Fix:** Split categories & products fetch into separate try/catch blocks
- **Issue:** Categories API failure silently killed product loading

### 9. Default Price Filter
- **File:** `frontend/src/app/shop/page.jsx`
- **Fix:** Changed default `maxPrice` from 2000 to 99999
- **Issue:** Products above ৳2000 were hidden by default

### 10. Order API — Save Customer, Payment & Shipping Data
- **Files:** `frontend/src/services/orderMapper.js`, `pahar-pos/backend/src/modules/sale/sale.model.js`, `pahar-pos/backend/src/modules/ecommerce/ecommerce.controller.js`
- **Fix:** Extended Sale model with `customerName`, `customerPhone`, `customerAddress`, `customerCity`, `paymentType`; controller passes through discount, shippingCost
- **Issue:** Customer info, payment type, discount, shipping were all lost by POS controller

### 11. Batch Stock Mismatch Fix
- **File:** `pahar-pos/backend/src/modules/ecommerce/ecommerce.controller.js`
- **Fix:** Added fallback batch with `product.purchasePrice` when purchase batches insufficient
- **Issue:** "Batch stock mismatch" error blocked order placement when batches missing

### 12. Order Success Page
- **File:** `frontend/src/app/order/success/page.jsx` (new)
- **Fix:** Dedicated confirmation page showing invoice, items, address, payment, summary

### 13. Sidebar — Fully Dynamic
- **File:** `frontend/src/components/common/Sidebar.jsx`
- **Fix:** Removed hardcoded `CATEGORIES`/`TAGS`; renders entirely from API props