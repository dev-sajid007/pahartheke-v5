# Production Deployment

## Prerequisites

- Ubuntu 22.04+ VPS
- Node.js 18+, pnpm 11, Docker, Nginx

---

## Quick Deploy

```bash
git clone https://github.com/dev-sajid007/pahartheke-v5.git
cd pahartheke-v5
pnpm install
```

## Environment

**`apps/pos-api/.env`**
```
PORT=4001
NODE_ENV=production
MONGO_URI=mongodb://localhost:27018/pahar_pos_v5
JWT_SECRET=<generate-strong-secret>
ECOMMERCE_API_KEY=<generate-unique-key>
```

**`apps/pos/.env.local`**
```
PORT=4000
NEXT_PUBLIC_API_URL=https://pos-api.yourdomain.com/api
```

## Start MongoDB

```bash
docker compose -f docker/compose.pos.yml up -d
```

## Build & Run (PM2)

```bash
pnpm build
npm install -g pm2
```

Create `ecosystem.config.js`:

```js
module.exports = {
  apps: [
    { name: 'pos-api', cwd: './apps/pos-api', script: 'server.js', env: { NODE_ENV: 'production' } },
    { name: 'pos', cwd: './apps/pos', script: 'node_modules/next/dist/bin/next', args: 'start -p 4000', env: { NODE_ENV: 'production' } },
  ],
}
```

```bash
pm2 start ecosystem.config.js
pm2 save
pm2 startup
```

## Nginx

### POS Dashboard (`pos.yourdomain.com`)
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

### POS API (`api.yourdomain.com`)
```nginx
server {
    listen 80;
    server_name api.yourdomain.com;
    location / {
        proxy_pass http://127.0.0.1:4001;
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

## SSL

```bash
sudo certbot --nginx -d pos.yourdomain.com
sudo certbot --nginx -d api.yourdomain.com
```

## Backup

```bash
docker exec pahar-pos-mongo mongodump --db pahar_pos_v5 --out /data/backup/$(date +%Y%m%d) --gzip
```
