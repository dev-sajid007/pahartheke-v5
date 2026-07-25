# Pahartheke.com — AI Agent Guide

## Project Overview

Full-stack e-commerce + POS system migrated from Laravel to Node.js/Next.js.

## Services & Ports

| Service | Port | Directory |
|---------|------|-----------|
| Storefront | 3000 | `apps/storefront` |
| Admin CMS | 3001 | `apps/admin` |
| Main API | 5000 | `apps/main-api` |
| POS Dashboard | 4000 | `apps/pos` |
| POS API | 4001 | `apps/pos-api` |
| MCP Server | stdio | `apps/mcp` |

## Tech Stack

- **Backend:** Express 4/5 + Mongoose 8/9 (ESM)
- **Frontend:** Next.js 16 + React 19 + Tailwind 4 + Redux Toolkit
- **Database:** MongoDB 7 (Docker, 2 instances)
- **Auth:** JWT + bcryptjs + role-based + API key
- **CDN:** Cloudinary
- **AI:** MCP Server (55 tools)

## Key Conventions

- **No comments in code**
- ES modules (import/export) everywhere
- Follow existing patterns — same libraries, same naming
- Read `next.config.mjs` / `next.config.ts` before modifying Next.js config
- Check `package.json` scripts before running commands

## Before Making Changes

1. Read `ARCHITECTURE.md` for system context
2. Read relevant `README.md` for service-specific info
3. Check `API.md` if adding/modifying endpoints
4. Run `pnpm lint` and `pnpm build` after changes

## Common Commands

```bash
pnpm install                           # Install all dependencies
pnpm dev                               # Start all dev servers (turbo)
pnpm build                             # Build for production
pnpm lint                              # Check lint errors
pnpm --filter <package-name> dev       # Start single service
```

## Important Notes

- Next.js uses Turbopack — configure `turbopack.root` if module resolution fails in monorepo
- Both MongoDB instances run in Docker (ports 27017, 27018)
- The storefront uses Next.js App Router as a BFF proxy layer
- POS ecommerce endpoints require `x-api-key` header
- The `apps/admin/` and `apps/pos/` contain `AGENTS.md` with Next.js-specific guidance
