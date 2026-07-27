# Contributing

## Project Structure

```
pahartheke-v5/
├── apps/
│   ├── pos/            # POS dashboard (port 4000)
│   ├── pos-api/        # Express 5 backend (port 4001)
│   └── mcp/            # MCP AI server (stdio)
├── docker/
│   └── compose.pos.yml # MongoDB (port 27018)
├── package.json
├── pnpm-workspace.yaml
└── turbo.json
```

## Getting Started

1. Fork the repo
2. `pnpm install` at root
3. Copy `.env.example` → `.env` for each service
4. `docker compose -f docker/compose.pos.yml up -d`
5. `pnpm dev`

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
| MCP Server | stdio | `apps/mcp` |
