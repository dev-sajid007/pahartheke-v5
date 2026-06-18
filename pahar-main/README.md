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
- **Framework:** Next.js 16 + React
- **State:** Redux Toolkit
- **Styling:** Tailwind CSS 4 + shadcn/ui
- **HTTP Client:** Axios
- **Carousel:** Embla, Swiper
- **Icons:** Lucide React
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
| `/checkout` | Checkout (bKash, Nagad, COD, Card, Bank) |
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
- **Payment Methods:** bKash, Nagad, Cash on Delivery, Card, Bank Transfer