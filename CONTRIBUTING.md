# Contributing

## Project Structure

```
pahartheke-v5/
├── apps/
│   ├── pos/            # POS dashboard (port 4000)
│   ├── pos-api/        # Express 5 backend (port 4001)
│   ├── mcp/            # MCP AI server (Streamable HTTP :4002)
│   ├── storefront/     # E-commerce storefront (port 3000)
│   ├── admin/          # Admin CMS (port 3001)
│   └── main-api/       # E-commerce API (port 5000)
├── package.json
├── pnpm-workspace.yaml
└── turbo.json
```

## Getting Started

1. Fork the repo
2. `pnpm install` at root
3. Follow `DEVELOPMENT.md` for env setup
4. `pnpm dev`

## Coding Standards

- **No comments in code**
- ES modules (import/export) everywhere
- Follow existing patterns

## Pull Request Process

1. Update relevant `README.md` if adding features
2. Ensure `pnpm build` and `pnpm lint` pass
3. Link related issues

## Service Ports

| Service | Port | App |
|---------|------|-----|
| POS Dashboard | 4000 | `apps/pos` |
| POS API | 4001 | `apps/pos-api` |
| MCP Server | 4002 | `apps/mcp` |
