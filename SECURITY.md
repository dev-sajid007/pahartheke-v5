# Security Policy

## Reporting

Report vulnerabilities via Entrogic.com. Do not open public issues.

## Authentication

- **JWT tokens** with bcryptjs password hashing
- Role-based access control (`admin`, `manager`, `cashier`)
- API key (`x-api-key`) for ecommerce endpoints

## CORS

- Default allowed origins: `localhost:3000`, `localhost:3001`, `localhost:4000`, `localhost:8000`, `pos.pahartheke.com` (http/https), `v2.pahartheke.com`
- Override via `CORS_ORIGIN` env var (comma-separated list)

## Best Practices

1. Strong JWT secrets (`openssl rand -base64 32`)
2. `NODE_ENV=production` in production
3. MongoDB auth enabled
4. Firewall on ports 80, 443 only
5. Regular MongoDB backups
6. Login endpoints currently have no rate limiting — add `express-rate-limit` before public exposure
