# Pahartheke.com — AI Agent Guide

## Overview

POS & Inventory Management system (Laravel → Node.js/Next.js), plus the e-commerce stack (storefront, admin CMS, main API) merged into this pnpm/Turbo monorepo.

## Services & Ports

| Service | Port | Directory | Package |
|---------|------|-----------|---------|
| Storefront (e-commerce) | 7100 | `apps/storefront` | `pahar-storefront` |
| Admin CMS | 7101 | `apps/admin` | `pahar-admin` |
| Main API (e-commerce) | 7102 | `apps/main-api` | `pahar-main-api` |
| POS Dashboard | 7103 | `apps/pos` | `pahar-pos-frontend` |
| POS API | 7104 | `apps/pos-api` | `pahar-pos-backend` |
| MCP Server | 7105 | `apps/mcp` | `pahar-pos-mcp-server` |

## Tech Stack

- **Backend:** Express 5 + Mongoose 9 (ESM); legacy main-api is Express 4 + Mongoose 8
- **MCP Server:** TypeScript (compiled with `tsc` to `dist/`)
- **Frontend:** Next.js 16 + React 19 + Tailwind 4 (POS, storefront, admin)
- **Database:** MongoDB 7 (`pahar_pos_v5` on port 27017); main-api uses its own Mongo via `apps/main-api/.env`
- **Auth:** JWT + bcryptjs + role-based + API key
- **AI:** MCP Server (55 tools)

## Key Conventions

- **No comments in code**
- ES modules (import/export) everywhere
- Follow existing patterns
- Next.js 16 differs from older Next — read `node_modules/next/dist/docs/` before writing Next code

## Common Commands

```bash
pnpm install
pnpm dev                 # all dev servers via turbo
pnpm build
pnpm lint
pnpm dev:pos-backend     # POS API only (7104)
pnpm dev:pos-frontend    # POS Dashboard only (7103)
pnpm dev:mcp             # MCP Server (7105, from dist/)
pnpm dev:storefront      # storefront only (7100)
pnpm dev:admin           # admin only (7101)
pnpm dev:main-api        # main API only (7102)
pnpm --filter <package-name> dev
```

## Notes

- `apps/main-api` has no build/lint script — turbo skips it for `pnpm build`/`pnpm lint`
- `apps/admin` needs `.env.local` with `NEXT_PUBLIC_API_URL=http://localhost:7102/api` (lib/api.ts defaults to an internal host otherwise)
- Storefront/admin `eslint.config.mjs` relax the new React-19 rules (`react-hooks/set-state-in-effect`, `refs`, `immutability`) to keep legacy patterns lint-green
