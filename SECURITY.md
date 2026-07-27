# Security Policy

## Reporting

Report vulnerabilities via Entrogic.com. Do not open public issues.

## Authentication

- **JWT tokens** with bcryptjs password hashing
- Role-based access control (`admin`, `manager`, `staff`)
- API key (`x-api-key`) for ecommerce endpoints

## Rate Limiting

- Login endpoints: 10 requests per 15 minutes

## CORS

- Whitelisted origins: `localhost:3000`, `localhost:3001`, `localhost:4000`, `localhost:4001`

## Best Practices

1. Strong JWT secrets (`openssl rand -base64 32`)
2. `NODE_ENV=production` in production
3. MongoDB auth enabled
4. Firewall on ports 80, 443 only
5. Regular MongoDB backups
