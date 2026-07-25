# Pahar Theke — Admin CMS

Content management system for the Pahartheke.com e-commerce storefront. Built with Next.js 16 + TypeScript.

## Overview

This admin panel manages the landing page content displayed on the customer-facing storefront (port 3000). It directly updates the **Main API** (`apps/main-api`, port 5000) which persists data in MongoDB.

## Quick Start

```bash
pnpm install
pnpm run dev    # http://localhost:3001
```

## Pages

| Route   | Section         | Fields Managed                        |
| ------- | --------------- | ------------------------------------- |
| `/`     | Dashboard       | Navigation cards to all sections      |
| `/hero` | Hero Section    | Video, headline, subtitle, CTAs       |
| `/about` | About Section  | "Why Bengal Meat" text + images       |
| `/affiliate` | Affiliate Banner | Banner image, title, link          |
| `/invest` | Invest Banner  | Banner image, title, description      |
| `/reviews` | Customer Reviews | Testimonials, ratings, reviewer info |
| `/footer` | Footer Content | Links, contact info, copyright         |

## Auth

Login is required. Uses the pahar-main backend auth (`/api/auth/login`). JWT is stored in `localStorage` and sent as `Authorization: Bearer` header.

## Tech Stack

- **Framework:** Next.js 16 (App Router) + TypeScript
- **Styling:** Tailwind CSS 4
- **Icons:** Lucide React
- **UI:** shadcn/ui (Button, Input, Card, Sheet)
- **Upload:** Cloudinary via backend `/api/upload` endpoint
- **API Client:** Native `fetch` wrapped in `lib/api.ts`

## Project Structure

```
admin/
├── app/
│   ├── layout.tsx          # Root layout (auth check)
│   ├── globals.css         # Tailwind + theme
│   ├── login/page.tsx      # Admin login
│   └── (dashboard)/
│       ├── layout.tsx      # Sidebar + header
│       ├── page.tsx        # Dashboard cards
│       ├── hero/page.tsx
│       ├── about/page.tsx
│       ├── affiliate/page.tsx
│       ├── invest/page.tsx
│       ├── reviews/page.tsx
│       └── footer/page.tsx
├── components/
│   ├── Sidebar.tsx         # Navigation sidebar
│   ├── SaveButton.tsx      # Reusable save with loading state
│   └── ImageUploader.tsx   # Cloudinary upload widget
├── lib/
│   └── api.ts             # API helpers (get, put, upload)
├── middleware.ts           # Auth guard — redirects to /login
└── next.config.ts
```

## Environment

The admin panel uses the same backend as the main storefront (`BACKEND_API_URL`). Configure in `apps/storefront/.env.local`:

```
BACKEND_API_URL=http://localhost:5000
NEXT_PUBLIC_ADMIN_URL=http://localhost:3001
```

## Dependencies

- `lucide-react` — icons
- `tailwindcss` + `postcss` — styling
- `@tailwindcss/postcss` — PostCSS plugin
- All UI is custom (no external component library beyond shadcn-style primitives)
