# Changelog

All notable changes to the Pahartheke.com project.

---

## [Unreleased]

### Removed
- `apps/main-api` — Express 4 e-commerce backend (removed from project)
- `apps/admin` — Next.js admin CMS (removed from project)
- `apps/storefront` — Next.js customer storefront (removed from project)
- `docker/compose.main.yml` — Main MongoDB compose file

### Changed
- Project scoped to POS & Inventory only (no e-commerce)
- All documentation updated to reflect POS-only structure
- Category page: `transformProduct` mapping for consistent field names
- Category page: real category name from API (not slug-derived)

### Changed
- Monorepo restructured to conventional `apps/` layout
- Migrated from npm to pnpm + Turborepo
- Expense model: `category` changed from string to ObjectId reference
- Expense controller: populates category data on list
- ExpenseModal: fetches categories from API instead of hardcoded dropdown
- Sidebar: Expenses changed to dropdown with sub-items
- All documentation updated to reflect new structure
- Storefront footer: fully dynamic — no hardcoded DEFAULTS, shows nothing when API data missing
- Storefront footer: fetches via BFF proxy (client component) — no async server component
- Main API upload route: local disk storage (`public/uploads/`) instead of Cloudinary
- Checkout page: accent color changed from `#E07B2E` (orange) to `#22c55e` (green)
- Checkout page: background changed from `bg-[#f5f5f5]` to `bg-[#f8f9fa]` to match homepage
- Category page: added Header/Footer, uses `transformProduct`, fetches real category name
- API.md: upload endpoint updated (Cloudinary → local storage)

### Fixed
- Purchase quantity input accepts decimal values (added `step="any"`)
- Turbopack root resolution for pnpm monorepo
- POS API MongoDB port corrected to 27018 in `.env.example`
- Expense category display (was plain string, now populated object)
- Storefront build: "Footer is not defined" error on `/order/success` (leftover `<Footer />` reference)
- Category page: missing Header/Footer, raw API field names causing 0 price and out-of-stock display
- Category page: `params` not awaited (Next.js 15+ pattern)

### Planned
- Pagination for product listing (Batch A)
- MongoDB transactions for order creation (Batch B)
- Persist shipping, discount, customer, payment in orders (Batch C)
- Performance: Suspense boundaries, loading states, caching, lazy images (Batch D)

---

## [2026-06-30] — Frontend Fixes & Order Flow Complete

### Added
- Order success page with invoice, items, address, payment summary
- Theme-aware Alert component (`destructive`/`success` variants + dark mode)
- Checkout error boundary with "Try again / Return to shop" fallback
- `nameToSlug` map for category name-to-slug filter matching

### Fixed
- Turbopack monorepo root resolution — "Cannot find module 'sonner'"
- Hydration mismatch on cart badge (useSyncExternalStore)
- Shop page: 6 hardcoded fallback products removed, fully API-driven
- Category filter: name vs slug comparison → empty results on category click
- Product normalization: one malformed product no longer kills all
- Categories API failure no longer silently kills product loading
- Default maxPrice raised from 2000 to 99999
- Customer info, payment type, discount, shipping now persisted to POS Sale
- "Batch stock mismatch" error blocked orders when batches missing — added fallback
- Sidebar: hardcoded CATEGORIES/TAGS arrays removed

### Changed
- `pahar-pos/backend` Sale model: added customer fields + paymentType
- Order mapper now sends correct POS format

---

## [2026-06-29] — API Debugging, Data Model Fix & System Audit

### Added
- Password change endpoint (`PUT /auth/password`)
- `slug`, `description`, `tags` fields to POS product model
- `slug`, `description`, `tags` fields to POS frontend forms (new/edit/modal)
- Brute-force protection on login/register (express-rate-limit)

### Fixed
- POS `getProduct` now matches by slug as well as ObjectId
- POS `createProduct`/`updateProduct` parses `tags` from JSON string
- Shop image display: `p.image[0]` on string returned first character
- `normalizeProduct` field mapping for POS data
- Product cards missing link to detail page
- Product detail API now calls POS directly (not client-side filter)
- `sessionStorage.removeItem()` immediately deleted product cache
- Orders now forwarded to POS with `x-api-key` header
- Order mapper field names corrected for POS format
- `purchasePrice` exposed as "oldPrice" — now hidden
- Product transform: added `description`, `tags`, `featured`
- JWT fallback to hardcoded 'fallback_secret' — runtime check added
- Dual caching removed (in-memory + revalidate)
- `cache: 'no-store'` changed to `revalidate: 300` on category routes
- CORS: added `localhost:3001` to allowed origins
- Image remotePatterns: added `localhost` + `127.0.0.1`
- Cleared unused EXTERNAL_PRODUCT_API / EXTERNAL_CATEGORIES_API env vars
- Dead `Product` import in orderRoutes removed
- `description` field on category controller (model doesn't have it)
- Unused axios instance in `services/api.ts` deleted
- Duplicate `dotenv.config()` in database.js removed

---

## [2026-06-26] — Full Production Overhaul

### Added
- Shop page API integration (replaced 6 hardcoded demo products)
- Category-wise product browsing
- Header search with navigation to shop
- Mobile hamburger menu (Home, Shop, Invest, Sign In)
- Coupon validation system with 3 codes + apply/remove state
- Privacy Policy, FAQs, Terms of Use, Refund Policy pages
- Error boundary with retry button
- Loading states (global, category, checkout)
- Suspense boundary in root layout
- Toast notifications (cart add, coupon apply, API errors)
- Shared contact constants
- POS backend `.env` configuration
- POS frontend `.env.local` configuration
- DB retry logic (replaces `process.exit(1)`)

### Fixed
- 14 critical crash bugs (see README for full list)
- Two competing Redux stores → cart items silently failed
- Missing proxy route `/api/products/by-category/[slug]` → 404
- No `.env.local` in frontend → all 10 proxy routes failed
- Sidebar hardcoded constants vs variables
- Coupon discount stored in wrong form field → always $0
- `loadCategories` defined inside `useEffect` → ReferenceError on retry
- POS backend had no `.env` — crashed on startup
- Double `/api/` prefix in proxy URLs
- Both backends defaulted to port 5000 — port collision
- Both docker-compose exposed MongoDB on port 27017 — port conflict
- CORS origin callback threw Error on denial — unhandled crash
- `process.exit(1)` on DB failure — no retry
- `localStorage` accessed without try/catch
- Category filter used slug string against ObjectId → CastError
- 10 responsive design issues (carousels, banners, grids, mobile menu)

### Removed
- `src/store/` directory (6 files) — unused old Redux store
- `src/lib/adapters/` (3 empty files)
- Empty components (promo-banner, section-title)
- `src/lib/data.js` — duplicate of `lib/api/categories.js`
- `src/app/api/orders.js` — buggy duplicate
- `src/app/Shop-page.css` — unused legacy CSS
- `src/hooks/redux.ts` — broken typed hooks
