# Pahartheke.com — AI Agent Guide

## Overview

POS & Inventory Management system. Migrated from Laravel to Node.js/Next.js.

## Services & Ports

| Service | Port | Directory |
|---------|------|-----------|
| POS Dashboard | 4000 | `apps/pos` |
| POS API | 4001 | `apps/pos-api` |
| MCP Server | stdio | `apps/mcp` |

## Tech Stack

- **Backend:** Express 5 + Mongoose 9 (ESM)
- **Frontend:** Next.js 16 + React 19 + Tailwind 4
- **Database:** MongoDB 7 (Docker)
- **Auth:** JWT + bcryptjs + role-based + API key
- **AI:** MCP Server (55 tools)

## Key Conventions

- **No comments in code**
- ES modules (import/export) everywhere
- Follow existing patterns

## Common Commands

```bash
pnpm install
pnpm dev
pnpm build
pnpm lint
pnpm --filter <package-name> dev
```
