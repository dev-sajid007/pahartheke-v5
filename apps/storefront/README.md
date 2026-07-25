# PaharTheke — Storefront (Next.js)

Customer-facing e-commerce storefront built with Next.js 16, React 19, Redux Toolkit, and Tailwind CSS 4.

## Running Status

| Service | URL | Status |
|---------|-----|--------|
| Frontend | http://localhost:3000 | ✅ All pages render, order flow complete |
| POS Backend | http://localhost:4001 | ✅ Products, categories, orders API active |
| Main Backend | http://localhost:5000 | ✅ Auth, landing page API active |
| MongoDB | `mongodb://localhost:27017` | ✅ Via Docker |

## Quick Start

```bash
pnpm install
pnpm run dev
```

> **Note:** Requires POS API (`apps/pos-api`) running on port 4001 and Main API (`apps/main-api`) on port 5000.

## Live

https://v02.pahartheke.com

## Tech Stack

- **Framework:** Next.js 16 (App Router) + React 19
- **State:** Redux Toolkit 2 + react-redux 9
- **Styling:** Tailwind CSS 4 + shadcn/ui + tw-animate-css
- **HTTP:** Native `fetch` (custom wrapper with timeout)
- **Carousel:** Embla (categories), Swiper (products)
- **Icons:** Lucide React
- **Notifications:** Sonner
- **Theme:** next-themes

## Folder Structure

```
paharTheke V0.2/
├── next.config.mjs        # Turbopack root, image remotePatterns
├── package.json
├── .env                   # API keys, backend URLs
├── public/
│   ├── images/
│   └── videos/
├── src/
│   ├── app/
│   │   ├── layout.js      # Root layout (StoreProvider, Toaster, Suspense)
│   │   ├── globals.css    # Tailwind v4 + shadcn/ui theme vars
│   │   ├── error.jsx      # Global error boundary
│   │   ├── page.js        # Homepage
│   │   ├── shop/page.jsx  # Product listing + filtering
│   │   ├── products/[id]/page.jsx  # Product detail
│   │   ├── category/[slug]/page.jsx
│   │   ├── checkout/
│   │   │   ├── page.jsx   # Checkout form + order submission
│   │   │   ├── loading.jsx
│   │   │   └── error.jsx  # Checkout error boundary
│   │   ├── order/success/page.jsx  # Order confirmation page
│   │   ├── auth/ (login, register)
│   │   ├── api/
│   │   │   ├── products/route.js      # BFF → POS products API
│   │   │   ├── products/[slug]/route.js
│   │   │   ├── products/by-category/[slug]/route.js
│   │   │   ├── categories/route.js
│   │   │   ├── orders/route.js        # BFF → POS orders API
│   │   │   ├── landing-page/route.js
│   │   │   └── auth/ (login, register, logout, profile)
│   │   └── middleware.ts  # Auth guard (profile, orders, admin)
│   ├── components/
│   │   ├── ui/            # shadcn/ui components + Alert
│   │   ├── common/        # Header, Footer, Sidebar
│   │   ├── checkout/      # OrderReviewPanel, ShippingAddressForm, etc.
│   │   ├── home/          # Hero, FeaturedProducts, etc.
│   │   ├── product/       # ProductCard, ProductSlider
│   │   ├── cart/          # CartSheet
│   │   └── providers/     # StoreProvider, ThemeProvider
│   ├── features/          # Redux slices (cart, user)
│   ├── services/          # API client functions (orders, products, auth, etc.)
│   ├── hooks/             # Custom hooks (useAsync, useDebounce)
│   └── lib/               # Utils, store, transforms, endpoints
```

## Environment Variables

| Variable | Description |
|----------|-------------|
| `POS_API_BASE_URL` | POS backend URL (e.g. `http://localhost:4001/api/ecommerce`) |
| `BACKEND_API_URL` | Main backend URL (e.g. `http://localhost:5000`) |
| `ECOMMERCE_API_KEY` | API key for POS order endpoint |
| `NEXT_PUBLIC_SITE_URL` | Public site URL |
| `NEXT_PUBLIC_ADMIN_URL` | Admin panel URL |

## Changelog — Recent Fixes & Features

### 1. Turbopack Root Resolution
- **File:** `next.config.mjs`
- **Fix:** Added `turbopack.root: process.cwd()` to resolve modules from correct workspace root in monorepo
- **Issue:** "Cannot find module 'sonner'" — Turbopack was inferring wrong root from duplicate lockfiles

### 2. Hydration Mismatch Fix
- **File:** `src/components/common/header.jsx`
- **Fix:** Replaced `useEffect(() => setMounted(true), [])` with `useSyncExternalStore` for cart badge visibility
- **Issue:** Cart badge (based on localStorage) rendered on client but not server → hydration error on every page

### 3. Error Boundary — Checkout
- **File:** `src/app/checkout/error.jsx` (new)
- **Fix:** Added Next.js error boundary with "Try again / Return to shop" fallback UI
- **Issue:** Uncaught errors in checkout caused blank white screen

### 4. Theme-Aware Alert Component
- **File:** `src/components/ui/alert.jsx` (new)
- **Fix:** Created reusable Alert with `destructive` and `success` variants, dark mode support
- **Usage:** Applied to checkout error & success messages

### 5. Removed Static Fallback Data
- **Files:** `src/app/shop/page.jsx`, `src/components/common/Sidebar.jsx`
- **Fix:** Removed `FALLBACK_PRODUCTS`, `FALLBACK_CATEGORIES`, hardcoded `CATEGORIES`/`TAGS` arrays
- **Result:** Shop page is fully API-driven — no fake products shown when API fails

### 6. Category Filter (Name-to-Slug Mapping)
- **File:** `src/app/shop/page.jsx`
- **Fix:** Built `nameToSlug` map from categories API; converts category names (e.g. "Rice & Grains") to slugs ("rice-grains") before comparison
- **Issue:** Products had category as string name, sidebar used slug → filter never matched

### 7. Null-Safe Product Normalization
- **File:** `src/app/shop/page.jsx`
- **Fix:** Wrapped `normalizeProduct` in try/catch; added `String()` wrappers, `??` operator, `.filter(Boolean)`
- **Issue:** One malformed product threw during `.map()`, killed all products, silently caught → empty shop

### 8. Isolated Error Handling
- **File:** `src/app/shop/page.jsx`
- **Fix:** Split categories and products fetch into separate try/catch blocks
- **Issue:** Categories failure silently killed product loading

### 9. Default Price Filter
- **File:** `src/app/shop/page.jsx`
- **Fix:** Changed default `maxPrice` from 2000 to 99999
- **Issue:** Products above ৳2000 were hidden by default

### 10. Order API — Save Customer & Payment Data
- **Files:** `src/services/orderMapper.js` (frontend), `sale.model.js` (POS), `ecommerce.controller.js` (POS)
- **Fix:** Extended Sale model with `customerName`, `customerPhone`, `customerEmail`, `customerAddress`, `customerCity`, `paymentType`; controller now saves all fields + applies discount/shipping to grand total
- **Issue:** Customer info, payment type, discount, shipping cost were all ignored by POS controller

### 11. Batch Stock Mismatch Fix
- **File:** `pahar-pos/backend/src/modules/ecommerce/ecommerce.controller.js`
- **Fix:** Before batch FIFO loop, check if total batch remainingQty < ordered qty; if so, push a synthetic fallback batch using `product.purchasePrice`
- **Issue:** "Batch stock mismatch" error when purchase batches missing or consumed — prevented order placement

### 12. Order Success Page
- **File:** `src/app/order/success/page.jsx` (new)
- **Fix:** Dedicated confirmation page displaying order details: invoice, items, address, payment, summary
- **Flow:** Checkout saves order to `sessionStorage` → redirects to `/order/success` → reads & displays

### 13. Sidebar — Fully Dynamic
- **File:** `src/components/common/Sidebar.jsx`
- **Fix:** Removed hardcoded `CATEGORIES` and `TAGS` arrays; sidebar now renders only from props
- **Tags section** hidden when empty; categories section always renders "All Products" from parent
