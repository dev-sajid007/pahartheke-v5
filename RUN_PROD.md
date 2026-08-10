# Production Deployment

## Prerequisites

- Ubuntu 22.04+ VPS
- Node.js 18+, pnpm 11, Nginx, PM2
- MongoDB 7 (or Atlas) reachable from the VPS

---

## Quick Deploy

```bash
git clone https://github.com/dev-sajid007/pahartheke-v5.git
cd pahartheke-v5
pnpm install
```

---

## Environment

Copy `.env.example` → `.env` for each service and set production values.

**`apps/pos-api/.env`**
```
PORT=4001
NODE_ENV=production
MONGO_URI=mongodb://<user>:<pass>@localhost:27018/pahar_pos_v5?authSource=admin
JWT_SECRET=<generate-strong-secret>
ECOMMERCE_API_KEY=<generate-unique-key>
CORS_ORIGIN=https://pos.yourdomain.com,https://yourdomain.com,https://admin.yourdomain.com
```

**`apps/pos/.env.local`**
```
PORT=4000
NEXT_PUBLIC_API_URL=https://pos-api.yourdomain.com/api
```

**`apps/mcp/.env`**
```
PORT=4002
MONGO_URI=mongodb://<user>:<pass>@localhost:27018/pahar_pos_v5?authSource=admin
JWT_SECRET=<same-as-pos-api>
ECOMMERCE_API_KEY=<same-as-pos-api>
```

**`apps/storefront/.env.local`**
```
NEXT_PUBLIC_SITE_URL=https://yourdomain.com
NEXT_PUBLIC_APP_URL=https://yourdomain.com
NEXT_PUBLIC_API_URL=/api
BACKEND_API_URL=https://api.yourdomain.com
NEXT_PUBLIC_BACKEND_API_URL=https://api.yourdomain.com
EXTERNAL_PRODUCT_API=https://pos-api.yourdomain.com/api/ecommerce/products
EXTERNAL_CATEGORIES_API=https://pos-api.yourdomain.com/api/ecommerce/categories
ECOMMERCE_API_KEY=<same-as-pos-api>
```

**`apps/admin/.env.local`**
```
NEXT_PUBLIC_API_URL=https://api.yourdomain.com/api
```

**`apps/main-api/.env`**
```
PORT=5000
NODE_ENV=production
MONGODB_URI=<production-mongo-uri>
MONGODB_DB_NAME=pahar_theke
CORS_ORIGIN=https://yourdomain.com,https://admin.yourdomain.com
JWT_SECRET=<generate-strong-secret>
```

> `apps/storefront/next.config.mjs` sets `output: "standalone"`; you may deploy the standalone build instead of `next start` if preferred.

---

## MongoDB

- POS (`pos-api`, `mcp`) read `MONGO_URI` from `apps/pos-api/.env` / `apps/mcp/.env` (default `mongodb://localhost:27018/pahar_pos_v5`).
- main-api reads `MONGODB_URI` from `apps/main-api/.env` (its own database).

Run MongoDB yourself (systemd service, managed DB, or Atlas) — it is not bundled with this project.

---

## Build & Run (PM2)

```bash
pnpm build
npm install -g pm2
```

A ready-made `ecosystem.config.cjs` (pos-backend, pos-frontend) is included. Extend it with the other services:

```js
module.exports = {
  apps: [
    { name: 'pos-backend', cwd: './apps/pos-api', script: 'node', args: 'server.js', env: { NODE_ENV: 'production' } },
    { name: 'pos-frontend', cwd: './apps/pos', script: 'node', args: 'node_modules/next/dist/bin/next start -p 4000', env: { NODE_ENV: 'production' } },
    { name: 'storefront', cwd: './apps/storefront', script: 'node_modules/next/dist/bin/next', args: 'start -p 3000', env: { NODE_ENV: 'production' } },
    { name: 'admin', cwd: './apps/admin', script: 'node_modules/next/dist/bin/next', args: 'start -p 3001', env: { NODE_ENV: 'production' } },
    { name: 'main-api', cwd: './apps/main-api', script: 'node', args: 'src/server.js', env: { NODE_ENV: 'production' } },
    { name: 'mcp', cwd: './apps/mcp', script: 'node', args: 'dist/index.js', env: { NODE_ENV: 'production' } },
  ],
};
```

```bash
pm2 start ecosystem.config.cjs
pm2 save
pm2 startup
```

> MCP must be built first (`pnpm --filter pahar-pos-mcp-server build`); `pnpm build` at the root already compiles it.

---

## Nginx

Reverse-proxy each public service. Adjust `server_name`/`proxy_pass` per service:

### Storefront (`yourdomain.com` → :3000)
```nginx
server {
    listen 80;
    server_name yourdomain.com www.yourdomain.com;
    location / {
        proxy_pass http://127.0.0.1:3000;
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

### Admin (`admin.yourdomain.com` → :3001)
```nginx
server {
    listen 80;
    server_name admin.yourdomain.com;
    location / {
        proxy_pass http://127.0.0.1:3001;
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

### Main API (`api.yourdomain.com` → :5000)
```nginx
server {
    listen 80;
    server_name api.yourdomain.com;
    location / {
        proxy_pass http://127.0.0.1:5000;
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

### POS Dashboard (`pos.yourdomain.com` → :4000)
```nginx
server {
    listen 80;
    server_name pos.yourdomain.com;
    location / {
        proxy_pass http://127.0.0.1:4000;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

### POS API (`pos-api.yourdomain.com` → :4001)
```nginx
server {
    listen 80;
    server_name pos-api.yourdomain.com;
    location / {
        proxy_pass http://127.0.0.1:4001;
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

---

## SSL

```bash
sudo certbot --nginx \
  -d yourdomain.com -d www.yourdomain.com \
  -d admin.yourdomain.com -d api.yourdomain.com \
  -d pos.yourdomain.com -d pos-api.yourdomain.com
```

---

## Backup

```bash
mongodump --uri "mongodb://localhost:27018/pahar_pos_v5" --out /data/backup/$(date +%Y%m%d) --gzip
```
