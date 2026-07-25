# Security Policy

## Supported Versions

| Version | Supported |
|---------|-----------|
| v5 (current) | ✅ |
| v4 (legacy) | ❌ |
| v3 (legacy) | ❌ |

## Reporting a Vulnerability

Report vulnerabilities to the development team via Entrogic.com. Do not open public issues for security vulnerabilities.

## Security Measures

### Authentication
- **JWT tokens** with bcryptjs password hashing
- HTTP-only cookies for e-commerce sessions
- API key (`x-api-key` header) for POS ecommerce endpoints
- Role-based access control (`admin` / `staff`)

### Rate Limiting
- Login and register endpoints: 10 requests per 15 minutes (express-rate-limit)

### Password Policy
- Passwords hashed with bcryptjs before storage
- Password change endpoint requires current password verification

### CORS
- Whitelisted origins: `localhost:3000`, `localhost:3001`, `localhost:4000`, `localhost:4001`
- Invalid origins receive proper CORS rejection (not a crash)

### Data Protection
- `purchasePrice` is never exposed to storefront customers
- JWT secret must be set via environment variable (no fallback)
- No hardcoded secrets in source code

### Environment Variables
- All secrets stored in `.env` files (not committed)
- `.env.example` files provided for reference
- Production secrets should use environment-specific values

## Best Practices for Production

1. Set strong `JWT_SECRET` environment variables (not defaults)
2. Enable HTTPS in production
3. Use MongoDB auth (not just Docker defaults)
4. Set `NODE_ENV=production`
5. Configure proper Cloudinary API keys
