# Pahartheke.com — AI Agent Guide

## Project Overview

Full-stack e-commerce + POS system migrated from Laravel to Node.js/Next.js.

## Services & Ports

| Service | Port | Directory |
|---------|------|-----------|
| Frontend | 3000 | `pahar-main/frontend/` |
| Admin | 3001 | `pahar-main/admin/` |
| Main API | 5000 | `pahar-main/backend/` |
| POS UI | 4000 | `pahar-pos/frontend/` |
| POS API | 4001 | `pahar-pos/backend/` |
| MCP Server | stdio | `pahar-pos/pos-mcp/` |

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
4. Run `npm run lint` and `npm run build` after changes

## Common Commands

```bash
./start-all.sh                          # Start everything
npm run dev                             # Start single service
npm run build                           # Build for production
npm run lint                            # Check lint errors
```

## Important Notes

- Next.js uses Turbopack — configure `turbopack.root` if module resolution fails in monorepo
- Both MongoDB instances run in Docker (ports 27017, 27018)
- The storefront uses Next.js App Router as a BFF proxy layer
- POS ecommerce endpoints require `x-api-key` header
- The `pahar-main/admin/` and `pahar-pos/frontend/` contain `AGENTS.md` with Next.js-specific guidance
