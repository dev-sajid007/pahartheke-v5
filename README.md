# Pahartheke.com

**Technology Migration: Laravel → Node.js, Express, Next.js & Modern Infrastructure**

---

## Team

| Role | Name | ID |
|------|------|----|
| Backend Developer | Sajid Nafiz | 007 |
| Frontend Developer | AK Shoikat | 005 |
| Debugging & QA | AK Shoikat | 005 |

---

## Server & Cost ( Optional )

| Tier | Specs | Monthly |
|------|-------|---------|
| Slow | 1 vCPU, 1GB RAM | $7.00 |
| Medium | 2 vCPU, 2GB RAM | $14.00 |
| Fast | 4 vCPU, 4GB RAM | $19.00 |

| Add-on - Dev | Cost  30 % |
|--------|------|
| Full Uptime Package | $620.50 |
| Fixed Uptime (per GB) | $0.45 |
| Fixed Uptime (per GB) | $1.10 |

---

## Migration Overview

| Component | Laravel (Old) | Node/Next (New) |
|-----------|--------------|-----------------|
| E-commerce Backend | PHP Laravel | Express.js 4 + Mongoose 8 |
| POS Backend | PHP Laravel | Express.js 5 + Mongoose 9 |
| Storefront | Blade Templates | Next.js 16 + React 19 + Redux Toolkit |
| Admin CMS | Blade Templates | Next.js 16 + TypeScript |
| POS Dashboard | — | Next.js 16 + React 19 |
| Database | MySQL | MongoDB 7 (Docker) |
| File Storage | Local Disk | Cloudinary CDN |
| Authentication | Session-based | JWT + Role-based + API Key |
| AI Integration | — | Model Context Protocol (55 tools) |

---


## Production Bug Fixing Report

### Session: June 26, 2026 — Full Production Overhaul

#### Critical Bugs — What They Caused

| # | Bug | Impact Before Fix |
|---|-----|-------------------|
| 1 | Two competing Redux stores in frontend | Cart items silently failed — "Add to Cart" dispatched to an unused store, items never appeared |
| 2 | Missing proxy route `/api/products/by-category/[slug]` | Entire category browsing returned 404 |
| 3 | No `.env.local` in frontend | All 10 API proxy routes failed with undefined backend URL |
| 4 | Sidebar used hardcoded constant names instead of variables | Categories/tags fetched from API were never displayed in sidebar |
| 5 | Coupon discount stored in wrong form field | Discount always `$0` — coupons completely non-functional |
| 6 | `loadCategories` defined inside `useEffect` scope | Clicking "Retry" on error state crashed with `ReferenceError` |
| 7 | POS backend had no `.env` file | Server crashed on startup — `MONGO_URI` was `undefined` |
| 8 | Double `/api/` prefix in proxy URL construction | Auth (login, register, profile), Orders, and Landing Page all returned 404 |
| 9 | Both backends defaulted to port 5000 | Port collision — could not run e-commerce and POS backends simultaneously |
| 10 | Both `docker-compose.yml` exposed MongoDB on port 27017 | MongoDB port conflict between e-commerce and POS stacks |
| 11 | CORS origin callback threw `Error` on denial | Denied origins received unhandled crash instead of proper CORS rejection |
| 12 | `process.exit(1)` on DB connection failure | POS backend killed process without retry on transient MongoDB errors |
| 13 | `localStorage` accessed without try/catch | Corrupted cart data crashed the entire StoreProvider component |
| 14 | POS ecommerce category filter used slug string directly against `ObjectId` field | Category product filtering failed with `CastError` |

#### Responsive Design Fixes

| # | Issue | Fix |
|---|-------|-----|
| 1 | About carousel `VISIBLE_SLIDES=4` hardcoded — `translateX(-25%)` broke on mobile | Dynamic `getVisibleSlides()` (1/2/4) + dynamic `translatePercent` per breakpoint |
| 2 | Review carousel same issue — `visibleCards=3` hardcoded | Dynamic 1/2/3 cards per screen size |
| 3 | Carousel arrow buttons off-screen on mobile (`left-[-30px]`) | Changed to `left-0 md:left-[-20px]` |
| 4 | Invest banner hidden on mobile (`hidden md:block`) | Visible on all screens + responsive height |
| 5 | Affiliate banner hidden on mobile | Same fix — visible on all screens |
| 6 | Product detail grid padding/gap not reduced on mobile | Added `padding: 16px; gap: 20px` in mobile media query |
| 7 | Shop grid missing `lg:grid-cols-3` | Added breakpoint |
| 8 | Category products grid missing `lg:grid-cols-3` | Added breakpoint |
| 9 | Shipping form `grid-cols-2` cramped on 320px screens | Changed to `grid-cols-1 sm:grid-cols-2` |
| 10 | Header hamburger button dead — no mobile menu | Added functional drawer with nav links |

#### New Features Implemented

- Shop page API integration (replaced 6 hardcoded demo products with real backend data)
- Category-wise product browsing (homepage category cards → filtered products)
- Header search with navigation to shop
- Mobile hamburger menu with Home, Shop, Invest, Sign In links
- Coupon validation system with 3 valid codes and applied/remove state
- Privacy Policy, FAQs, Terms of Use, Refund Policy pages
- Error boundary with retry button
- Loading states for global, category, and checkout routes
- Suspense boundary in root layout
- Toast notifications for cart add, coupon apply, and API errors
- Shared contact constants (eliminated 3 different hardcoded phone formats)
- POS backend `.env` configuration
- POS frontend `.env.local` configuration
- DB retry logic (replaces aggressive `process.exit(1)`)

#### Code Cleanup

| Removed | Reason |
|---------|--------|
| `src/store/` directory (6 files) | Unused old Redux store with different reducer shape |
| `src/lib/adapters/` (3 empty files) | Zero content — productAdapter, categoryAdapter, orderAdapter |
| `src/components/home/promo-banner.jsx` | Empty component |
| `src/components/common/section-title.jsx` | Empty component |
| `src/lib/data.js` | Duplicate of `lib/api/categories.js` |
| `src/app/api/orders.js` | Buggy duplicate with missing `/` in URL |
| `src/app/Shop-page.css` | Unused legacy CSS from old version |
| `src/hooks/redux.ts` | Broken typed hooks importing deleted store |
| `TheamColor` → `ThemeColor` spelling | Fixed in 4 files (globals.css + 3 components) |

---

## Build Status

```
✓ Compiled successfully
✓ TypeScript passed
✓ 23 routes compiled (static + server-rendered)
✓ Zero errors
✓ Zero warnings
✓ Production-ready
```

---


## Changelog

### Session: June 29, 2026 — API Debugging, Data Model Fix & System Audit

---

#### Phase 1: API Endpoint & Data Flow Fixes (12 fixes)

| # | Category | File(s) | Issue | Fix |
|---|----------|---------|-------|-----|
| 1 | POS Model | `pahar-pos/backend/.../product.model.js` | Missing `slug`, `description`, `tags` fields | Added: `slug` (unique, sparse), `description` (String), `tags` ([String]) |
| 2 | POS Controller | `pahar-pos/backend/.../ecommerce.controller.js` | `getProduct` only matched by ObjectId, not slug | Added mongoose import + slug fallback lookup after ObjectId |
| 3 | POS Controller | `pahar-pos/backend/.../product.controller.js` | `createProduct`/`updateProduct` didn't parse `tags` from JSON string | Added `tags` destructuring + JSON.parse fallback |
| 4 | Shop Image | `frontend/.../shop/page.jsx:110` | `p.image?.[0]` — `string[0]` returns first character, not image | Changed to `p.image \|\| (images[0] \|\| "\uD83D\uDED2")` |
| 5 | Shop Data | `frontend/.../shop/page.jsx` | `normalizeProduct` had wrong field mapping for POS data | Rewrote: proper `salePrice`, `currentStock`, `image` (URL or emoji) |
| 6 | Shop Links | `frontend/.../shop/page.jsx` | Product cards had no link to detail page | Added `<Link>` to image area + product name |
| 7 | Product API | `frontend/.../api/products/[slug]/route.js` | Fetched ALL products then client-side filtered | Now calls POS `GET /ecommerce/products/:id` directly (supports ObjectId + slug) |
| 8 | Cache | `frontend/.../products/[id]/page.jsx:35` | `sessionStorage.removeItem()` immediately deleted cache after read | Removed `.removeItem()` — cache now persists across refreshes |
| 9 | Order Flow | `frontend/.../api/orders/route.js` | Orders went to main backend (port 5000) — no POS stock sync | Now forwards to POS `POST /ecommerce/orders` with `x-api-key` header |
| 10 | Order Mapper | `frontend/.../mappers/order.js` | Sent wrong field names to backend | Rewrote to POS format: `items: [{ product, quantity, salePrice }]`, `customerInfo`, `note` |
| 11 | Env | `frontend/.env` + `.env.local` | Missing `POS_API_BASE_URL` and `ECOMMERCE_API_KEY` | Added both env vars |
| 12 | React Lint | `frontend/.../products/[id]/page.jsx` | `setState` called synchronously in useEffect | Refactored to `useState(() => sessionStorage.getItem(...))` lazy initializer |

#### Phase 2: POS Frontend Form Fields for New DB Columns (3 files)

| # | File | Change |
|---|------|--------|
| 1 | `pahar-pos/frontend/.../products/new/page.js` | Added `slug`, `description`, `tags` to formData state + SEO & Details section + submit JSON.stringify tags |
| 2 | `pahar-pos/frontend/.../products/edit/[id]/page.js` | Same fields added + pre-population from existing product + submit handling |
| 3 | `pahar-pos/frontend/.../components/products/ProductModal.jsx` | Same fields added to state + useEffect + compact SEO section + `onSave` payload |

#### Phase 3: Full System Audit — Security, Performance & Cleanup (15 fixes)

| # | Category | File | Issue | Fix |
|---|----------|------|-------|-----|
| 1 | Data Leak | `transform/productTransform.js` + `shop/page.jsx` + `products/[id]/page.jsx` | `purchasePrice` exposed as "oldPrice" to customers | Set `oldPrice = null` / `oldPrice = 0` throughout |
| 2 | Transform | `transform/productTransform.js` | Missing `description`, `tags`, `featured` in mapping | Added all three fields + `Boolean(apiProduct.featured)` |
| 3 | Security | `pahar-main/backend/middleware/auth.js` | JWT fallback to hardcoded `'fallback_secret'` | Replaced with `getJwtSecret()` runtime check — throws if env unset |
| 4 | Security | `pahar-main/backend/routes/authRoutes.js` | No brute-force protection on login/register | Installed `express-rate-limit` — 10 req/15min |
| 5 | Feature | `pahar-main/backend/routes/authRoutes.js` | No password change endpoint | Added `PUT /password` with current password verification |
| 6 | Cache | `frontend/.../api/products/route.js` | Dual caching: in-memory + Next.js revalidate | Removed in-memory cache — relies on `revalidate: 300` only |
| 7 | Cache | `frontend/.../api/products/by-category/[slug]/route.js` | `cache: 'no-store'` — never cached | Changed to `next: { revalidate: 300 }` |
| 8 | CORS | `pahar-pos/backend/src/app.js` (both repos) | Admin panel (`localhost:3001`) not in CORS whitelist | Added `localhost:3001` to allowed origins |
| 9 | Images | `frontend/next.config.mjs` | `localhost` not in remote image patterns | Added `localhost` + `127.0.0.1` |
| 10 | Cleanup | `pahar-main/backend/.env` + `.env.example` | Unused `EXTERNAL_PRODUCT_API`/`EXTERNAL_CATEGORIES_API` | Removed |
| 11 | Cleanup | `pahar-main/backend/routes/orderRoutes.js` | Dead `Product` import | Removed |
| 12 | Cleanup | `pahar-pos/backend/.../category.controller.js` | `description` field accepted but doesn't exist on Category model | Removed from destructuring + assignment |
| 13 | Cleanup | `frontend/src/services/api.ts` | Unused axios instance (dead code) | Deleted |
| 14 | Cleanup | `pahar-main/backend/config/database.js` | Duplicate `dotenv.config()` (already called in server.js) | Removed import + call |
| 15 | Env | `pahar-main/backend/.env` | Unused EXTERNAL vars | Cleaned to only active config |

---

### Performance Audit — Rendering Issues Found (12 issues)

| # | Severity | Issue | File(s) | Impact |
|---|----------|-------|---------|--------|
| 1 | 🔴 | **No pagination** — fetches and renders ALL products at once | `shop/page.jsx` + `api/products/route.js` | 500+ DOM nodes on single page |
| 2 | 🔴 | **Single coarse Suspense** — wraps entire app; any async = whole page spinner | `layout.js` | Blocking waterfall |
| 3 | 🔴 | **useMemo dependency bug** — `products` not in deps; stale closure | `shop/page.jsx:245` | Filters don't update on fetch |
| 4 | 🟡 | **Duplicate API calls** — landing page fetched 5x on home page | 5 home components via `landing-page.js` | 4 redundant network requests |
| 5 | 🟡 | **`cache: "no-store"` everywhere** — completely disables ISR/SSG caching | Every `fetch()` call | Every navigation refetches |
| 6 | 🟡 | **Raw `<img>` tags** — no Next.js optimization, no lazy loading, CLS | 7+ files | Layout shift + bandwidth |
| 7 | 🟡 | **No route-level `loading.jsx`** — blank pages during navigation | `/shop`, `/products/[id]`, `/checkout` | Poor UX |
| 8 | 🟡 | **sessionStorage blocks render** — sync I/O in useState initializer | `products/[id]/page.jsx:20` | Initial render delay |
| 9 | 🟡 | **Throttleless localStorage writes** — every cart render writes to disk | `store-provider.jsx:28` | Disk I/O on rapid clicks |
| 10 | ⬜ | **Blocking CSS `@import`** — Google Font import blocks render | `product-details.css:1` | Font render delay |
| 11 | ⬜ | **Heavy Swiper.js** — ~40KB for simple carousel | `product-slider.jsx` | Bundle bloat |
| 12 | ⬜ | **All "use client"** — server component with all client children | `page.js` + 8 children | No SSR benefits |

---

### Order Flow Audit — Critical Bugs Found (9 issues)

| # | Severity | Issue | Detail |
|---|----------|-------|--------|
| 1 | 🔴 | **No MongoDB transaction** | If item 4 of 5 fails during `createOrder`, items 1-3 stock is already deducted irreversibly with no Sale record |
| 2 | 🔴 | **Invoice collision risk** | `"WEB-" + Date.now()` not unique enough; `invoiceNo` has `unique` constraint — 2 orders in same ms could crash after stock deducted |
| 3 | 🟡 | **Customer info lost** | `customerInfo` destructured from body but never persisted to Sale `customer` field |
| 4 | 🟡 | **Shipping cost lost** | Frontend calculates 65/150 BDT but Sale `shippingCost` defaults to 0 |
| 5 | 🟡 | **Coupon discount lost** | Frontend applies it but Sale `discount` hardcoded to 0 |
| 6 | 🟡 | **grandTotal incomplete** | Equals raw subtotal — doesn't include shipping or discount |
| 7 | ⬜ | **Payment type ignored** | All orders treated as fully paid (`paidAmount = grandTotal`, `dueAmount = 0`) |
| 8 | ⬜ | **user_id ignored** | `soldBy` on Sale never set |
| 9 | ⬜ | **Stock movements unlinked** | `referenceId: null` — not linked back to Sale document |

---

### Pending Fix Plan — Next Session (4 batches)

| Batch | Priority | Description | Files |
|-------|----------|-------------|-------|
| A | 🔴 | Add pagination to products (fix perf #1) | `api/products/route.js`, `shop/page.jsx` |
| B | 🔴 | MongoDB transaction for orders (fix order #1, #2) | `ecommerce.controller.js` |
| C | 🟡 | Persist lost order data — shipping, discount, customer, payment (fix order #3-#9) | `ecommerce.controller.js`, `order.js` mapper |
| D | 🟡 | Performance improvements — Suspense, loading states, caching, images (fix perf #2-#12) | 10+ files across frontend |

---

### Session Stats

| Metric | Count |
|--------|-------|
| Fixes applied today | **27** |
| Files modified | **25** across 4 services |
| Services touched | pahar-main backend, pahar-main frontend, pahar-pos backend, pahar-pos frontend |
| Critical performance issues found | **3** (pending) |
| Critical order bugs found | **2** (pending) |
| Pending fixes for next session | **~20** in 4 batches |
| Lint errors introduced | **0** |
| Lint warnings introduced | **0** |

---


## Services & Ports

| Service | Port | URL |
|---------|------|-----|
| Main Storefront | 3000 | http://localhost:3000 |
| Admin CMS | 3001 | http://localhost:3001 |
| Main Backend API | 5000 | http://localhost:5000 |
| POS Dashboard | 4000 | http://localhost:4000 |
| POS Backend API | 4001 | http://localhost:4001 |
| MongoDB (Main) | 27017 | Docker |
| MongoDB (POS) | 27018 | Docker |
| MCP Server | 3000 | Internal |

---

## API Endpoint Inventory

| System | Endpoints |
|--------|-----------|
| E-commerce Backend | 21 (auth × 4, products × 5, orders × 5, landing-page × 5, upload × 1, health × 1) |
| POS Backend | 54 (auth × 3, products × 4, categories × 4, sales × 3, purchases × 3, purchase-costs × 4, customers × 5, suppliers × 4, expenses × 4, badges × 4, dashboard × 1, stock × 1, invoices × 1, settings × 2, reports × 6, ecommerce × 4, test × 1) |
| **Total** | **75** |

---

## Full System Architecture

```
╔══════════════════════════════════════════════════════════════════╗
║                    BROWSER / CLIENT LAYER                        ║
╠══════════════════════════════════════════════════════════════════╣
║                                                                   ║
║  ┌─────────────────┐ ┌─────────────────┐ ┌─────────────────┐     ║
║  │ E-Commerce      │ │ Admin CMS       │ │ POS Dashboard   │     ║
║  │ Next.js :3000   │ │ Next.js :3001   │ │ Next.js :4000   │     ║
║  └───────┬─────────┘ └───────┬─────────┘ └───────┬─────────┘     ║
║          │                   │                   │                ║
╚══════════╪═══════════════════╪═══════════════════╪════════════════╝
           │                   │                   │
           ▼                   ▼                   ▼
╔══════════╪═══════════════════╪═══════════════════╪════════════════╗
║          │    API GATEWAY / BFF LAYER            │                 ║
║          │  (Next.js App Router Proxy Routes)    │                 ║
║          │                                        │                 ║
║  ┌───────┴─────────┐                               │                 ║
║  │ /api/auth/*     │──► Express :5000              │                 ║
║  │ /api/orders     │──► Express :5000              │                 ║
║  │ /api/landing-*  │──► Express :5000              │                 ║
║  │ /api/products/* │──► POS Ecommerce API :4001    │                 ║
║  │ /api/categories │──► POS Ecommerce API :4001    │                 ║
║  └─────────────────┘                               │                 ║
║                                                    │                 ║
╚════════════════════════════════════════════════════╪════════════════╝
           │                   │                      │
           ▼                   ▼                      ▼
╔══════════╪═══════════════════╪══════════════════════╪════════════════╗
║          │         BACKEND LAYER                    │                 ║
╠══════════╪═══════════════════╪══════════════════════╪════════════════╣
║          ▼                   ▼                      ▼                 ║
║  ┌──────────────────────────┐ ┌───────────────────────────────────┐ ║
║  │ pahar-main BACKEND :5000 │ │ pahar-pos BACKEND :4001           │ ║
║  │ Express 4 + Mongoose 8   │ │ Express 5 + Mongoose 9            │ ║
║  │                          │ │                                    │ ║
║  │ Models:                  │ │ Models:                            │ ║
║  │  • User                  │ │  • User        • Customer+Badge   │ ║
║  │  • Product               │ │  • Category    • Supplier         │ ║
║  │  • Order                 │ │  • Product     • Expense          │ ║
║  │  • LandingPage           │ │  • Purchase    • StockMovement    │ ║
║  │                          │ │  • Sale        • Settings         │ ║
║  └───────────┬──────────────┘ │  • PurchaseBatch                   │ ║
║              │                 └──────────────────┬────────────────┘ ║
╚══════════════╪════════════════════════════════════╪══════════════════╝
               │                                    │
               ▼                                    ▼
╔══════════════╪════════════════════════════════════╪══════════════════╗
║              │            DATA LAYER              │                  ║
╠══════════════╪════════════════════════════════════╪══════════════════╣
║              ▼                                    ▼                  ║
║  ┌──────────────────────┐  ┌──────────────────────────────────────┐ ║
║  │ MongoDB: pahar_theke │  │ MongoDB: pahar_pos_v5                │ ║
║  └──────────────────────┘  └──────────────────────────────────────┘ ║
║         MongoDB 7 Docker (2 databases, 1 instance)                  ║
║                                                                     ║
║  ┌──────────────────────┐                                           ║
║  │ Cloudinary CDN        │  ← Image/Video Storage                   ║
║  └──────────────────────┘                                           ║
╚══════════════════════════════════════════════════════════════════════╝
```

---

## Connection Flows

### E-Commerce Customer Flow

```
[Browser :3000]       [Next.js BFF]           [Express :5000]     [POS :4001]
     │                     │                        │                   │
     │─ GET /shop ────────►│─ fetch(/api/products) ─────────────────────►│
     │                     │  → POS ecommerce       │                   │
     │◄─ products ◄───────│◄──────────────────────────────────────────│
     │                     │                        │                   │
     │─ POST /auth/login ─►│─ proxy ───────────────►│ /api/auth/login   │
     │◄─ JWT cookie ◄─────│◄───────────────────────│                   │
     │                     │                        │                   │
     │─ POST /orders ─────►│─ proxy + x-api-key ───────────────────────►│
     │                     │  → POS ecommerce/orders                   │
     │◄─ order confirmed ◄─│◄──────────────────────────────────────────│
```

### POS Dashboard Flow

```
[Browser :4000]                    [Express :4001]
     │                                  │
     │─ POST /auth/login ──────────────►│ JWT
     │─ GET  /dashboard/stats ─────────►│ Aggregation
     │─ POST /sales ───────────────────►│ Sale + Stock - FIFO
     │─ GET  /reports/daily-sales ─────►│ Aggregation
     │─ GET  /invoices/:id/pdf ────────►│ PDFKit
```

### Admin CMS Flow

```
[Browser :3001]                    [Express :5000]            [Cloudinary]
     │                                  │                         │
     │─ POST /auth/login ──────────────►│                         │
     │─ GET  /landing-page ────────────►│ LandingPage.findOne()   │
     │─ PUT  /landing-page/:id ────────►│ LandingPage.update()    │
     │─ POST /upload ──────────────────►│ multer ────────────────►│
```

---

## Database Schema

```
pahar_theke DB                   pahar_pos_v5 DB
═══════════════                   ═══════════════

User                             User ──► Sale ──► Customer ──► Badge
  │                                        │
Order ←────────────────────────┐           ▼
  │                            │        Product ◄── Category
Product                        │           ▲
                               │           │
LandingPage (CMS)             Purchase ──► Supplier
                                       │
                                       ▼
                               PurchaseCost
                                       │
                                       ▼
                               PurchaseBatch (FIFO)
                                       │
                                       ▼
                               StockMovement (audit)
                                       │
                                       ▼
                               Settings (store config)
                                       │
                                       ▼
                               Expense
```

---


## Installation & Setup

### Prerequisites

- **Node.js** 18+
- **Docker** (for MongoDB)
- **npm**

### Quick Start

```bash
# Start everything with one command
./start-all.sh
```

### Manual Start

```bash
# 1. Start MongoDB
docker compose -f pahar-main/docker-compose.yml up -d
docker compose -f pahar-pos/docker-compose.yml up -d

# 2. Start Backends
cd pahar-main/backend && npm run dev      # http://localhost:5000
cd pahar-pos/backend && npm run dev       # http://localhost:4001

# 3. Start Frontends
cd pahar-main/frontend && npm run dev     # http://localhost:3000
cd pahar-main/admin && npm run dev -p 3001 # http://localhost:3001
cd pahar-pos/frontend && npm run dev -p 4000 # http://localhost:4000
```

### Environment Files Required

| Project | File | Status |
|---------|------|--------|
| `pahar-main/backend` | `.env` | Created |
| `pahar-main/frontend` | `.env.local` | Created |
| `pahar-pos/backend` | `.env` | Created |
| `pahar-pos/frontend` | `.env.local` | Created |
| `pahar-pos/pos-mcp` | `.env.example` | Updated |

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| **E-commerce Backend** | Express.js 4, Mongoose 8, JWT, Multer |
| **POS Backend** | Express.js 5, Mongoose 9, JWT, API Key |
| **Frontend** | Next.js 16, React 19, Redux Toolkit, Tailwind CSS 4 |
| **Admin CMS** | Next.js 16, TypeScript, Tailwind CSS 4 |
| **Database** | MongoDB 7 (Docker) |
| **CDN** | Cloudinary |
| **PDF Generation** | PDFKit |
| **Barcode Generation** | bwip-js |
| **UI Components** | shadcn/ui, Radix UI, Embla Carousel, Swiper |
| **Notifications** | Sonner (toast) |
| **AI Automation** | Model Context Protocol (55 POS tools) |
| **Real-time** | Socket.IO |

---

## Files

| File | Purpose |
|------|---------|
| `start-all.sh` | Launch all services with one command |
| `README.md` | This file — project documentation |
| `pahar-main/` | E-commerce website + Admin CMS |
| `pahar-pos/` | POS & Inventory Management system |

---

*This project belongs to **Entrogic.com**.*
