# Contributing

Thanks for your interest in contributing to Pahartheke.com.

## Project Structure

```
pahartheke-v5/
├── pahar-main/     # E-commerce (backend + frontend + admin)
├── pahar-pos/      # POS & Inventory (backend + frontend + MCP)
└── start-all.sh    # Launch all services
```

Refer to `ARCHITECTURE.md` for a detailed breakdown.

## Getting Started

1. Fork the repo
2. Run `./start-all.sh` or follow steps in root `README.md`
3. Make your changes
4. Test locally

## Coding Standards

- **No comments in code** — code should be self-documenting
- Follow existing patterns (same libraries, same naming conventions)
- Use ES modules (import/export) throughout
- Keep components modular and single-responsibility

## Pull Request Process

1. Update relevant `README.md` if adding features
2. Ensure zero build errors: `npm run build` (or `next build`)
3. Ensure zero lint errors: `npm run lint`
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

| Service | Port |
|---------|------|
| Storefront | 3000 |
| Admin CMS | 3001 |
| Main Backend | 5000 |
| POS Dashboard | 4000 |
| POS Backend | 4001 |
