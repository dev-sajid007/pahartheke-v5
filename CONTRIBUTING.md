# Contributing

Thanks for your interest in contributing to Pahartheke.com.

## Project Structure

```
pahartheke-v5/
├── apps/
│   ├── storefront/     # Customer Next.js storefront (port 3000)
│   ├── admin/          # Admin CMS (port 3001)
│   ├── main-api/       # Express 4 backend (port 5000)
│   ├── pos/            # POS dashboard (port 4000)
│   ├── pos-api/        # Express 5 backend (port 4001)
│   └── mcp/            # MCP AI server (stdio)
├── docker/
│   ├── compose.main.yml  # Main MongoDB (port 27017)
│   └── compose.pos.yml   # POS MongoDB (port 27018)
├── package.json
├── pnpm-workspace.yaml
└── turbo.json
```

Refer to `ARCHITECTURE.md` for a detailed breakdown.

## Getting Started

1. Fork the repo
2. Run `pnpm install` at root
3. Copy `.env.example` files to `.env` for each service
4. Start MongoDB: `docker compose -f docker/compose.main.yml up -d`
5. Run `pnpm dev` to start all services
6. Make your changes
7. Test locally

## Coding Standards

- **No comments in code** — code should be self-documenting
- Follow existing patterns (same libraries, same naming conventions)
- Use ES modules (import/export) throughout
- Keep components modular and single-responsibility

## Pull Request Process

1. Update relevant `README.md` if adding features
2. Ensure zero build errors: `pnpm build`
3. Ensure zero lint errors: `pnpm lint`
4. Link any related issues in the PR description
5. PRs require at least one reviewer

## Commit Messages

Use concise, descriptive commit messages:

```
fix: resolve cart hydration mismatch on header
feat: add order success confirmation page
refactor: remove hardcoded fallback products from shop
chore: clean up unused redux store files
```

## Branch Naming

- `fix/<short-description>` — bug fixes
- `feat/<short-description>` — new features
- `refactor/<short-description>` — code restructuring
- `chore/<short-description>` — maintenance

## Service Ports

| Service | Port | App |
|---------|------|-----|
| Storefront | 3000 | `apps/storefront` |
| Admin CMS | 3001 | `apps/admin` |
| Main API | 5000 | `apps/main-api` |
| POS Dashboard | 4000 | `apps/pos` |
| POS API | 4001 | `apps/pos-api` |
| MCP Server | stdio | `apps/mcp` |
