# Production Deployment Guide

## Prerequisites

- **VPS / Server** with Ubuntu 22.04+
- **Node.js 18+**
- **pnpm 11** (`npm install -g pnpm`)
- **Docker** (for MongoDB)
- **Nginx** (for reverse proxy)
- Domain names pointed to your server

---

## 1. Clone & Install

```bash
git clone https://github.com/dev-sajid007/pahartheke-v5.git
cd pahartheke-v5
pnpm install
```

---

## 2. Environment Variables

### `apps/main-api/.env`
```
PORT=5000
NODE_ENV=production
MONGODB_URI=mongodb://localhost:27017/pahar_theke
MONGODB_DB_NAME=pahar_theke
CORS_ORIGIN=https://yourdomain.com,https://admin.yourdomain.com
JWT_SECRET=<generate-a-strong-secret>
```

### `apps/pos-api/.env`
```
PORT=4001
NODE_ENV=production
MONGO_URI=mongodb://localhost:27018/pahar_pos_v5
JWT_SECRET=<generate-a-strong-secret>
ECOMMERCE_API_KEY=<generate-a-unique-api-key>
CLOUDINARY_CLOUD_NAME=dxacttggi
CLOUDINARY_API_KEY=your_key
CLOUDINARY_API_SECRET=your_secret
```

### `apps/storefront/.env.local`
```
POS_API_BASE_URL=https://api.yourdomain.com/api/ecommerce
BACKEND_API_URL=https://api.yourdomain.com
ECOMMERCE_API_KEY=pahar_pos_api_key_2024
NEXT_PUBLIC_SITE_URL=https://yourdomain.com
NEXT_PUBLIC_ADMIN_URL=https://admin.yourdomain.com
```

### `apps/pos/.env.local`
```
NEXT_PUBLIC_API_URL=https://pos-api.yourdomain.com/api
```

### `apps/admin/.env.local`
```
NEXT_PUBLIC_API_URL=https://api.yourdomain.com/api
```

> Generate strong secrets with `openssl rand -base64 32`.

---

## 3. Start MongoDB

```bash
docker compose -f docker/compose.main.yml up -d
docker compose -f docker/compose.pos.yml up -d
```

For production, consider MongoDB Atlas instead of Docker.

---

## 4. Build

```bash
pnpm build
```

Builds all Next.js apps (storefront, admin, POS) via Turborepo.

---

## 5. Start Services (Production)

### Option A: PM2 (Recommended)

```bash
npm install -g pm2
```

Create `ecosystem.config.js`:

```js
module.exports = {
  apps: [
    {
      name: 'main-api',
      cwd: './apps/main-api',
      script: 'src/server.js',
      env: { NODE_ENV: 'production' },
    },
    {
      name: 'pos-api',
      cwd: './apps/pos-api',
      script: 'server.js',
      env: { NODE_ENV: 'production' },
    },
    {
      name: 'storefront',
      cwd: './apps/storefront',
      script: 'node_modules/next/dist/bin/next',
      args: 'start -p 3000',
      env: { NODE_ENV: 'production' },
    },
    {
      name: 'admin',
      cwd: './apps/admin',
      script: 'node_modules/next/dist/bin/next',
      args: 'start -p 3001',
      env: { NODE_ENV: 'production' },
    },
    {
      name: 'pos',
      cwd: './apps/pos',
      script: 'node_modules/next/dist/bin/next',
      args: 'start -p 4000',
      env: { NODE_ENV: 'production' },
    },
  ],
}
```

```bash
pm2 start ecosystem.config.js
pm2 save
pm2 startup
```

### Option B: Systemd

Create service files in `/etc/systemd/system/`. Example:

**`/etc/systemd/system/pahar-main-api.service`**
```
[Unit]
Description=Pahar Main API
After=network.target

[Service]
Type=simple
User=deploy
WorkingDirectory=/home/deploy/pahartheke-v5/apps/main-api
ExecStart=/usr/bin/node src/server.js
Restart=always
Environment=NODE_ENV=production

[Install]
WantedBy=multi-user.target
```

---

## 6. Nginx Reverse Proxy

### Storefront (`yourdomain.com`)
```nginx
server {
    listen 80;
    server_name yourdomain.com www.yourdomain.com;

    location / {
        proxy_pass http://127.0.0.1:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

### Admin (`admin.yourdomain.com`)
```nginx
server {
    listen 80;
    server_name admin.yourdomain.com;

    location / {
        proxy_pass http://127.0.0.1:3001;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

### POS Dashboard (`pos.yourdomain.com`)
```nginx
server {
    listen 80;
    server_name pos.yourdomain.com;

    location / {
        proxy_pass http://127.0.0.1:4000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

### API Gateway (`api.yourdomain.com`)
```nginx
server {
    listen 80;
    server_name api.yourdomain.com;

    location /api/ecommerce {
        proxy_pass http://127.0.0.1:4001;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }

    location /api/ {
        proxy_pass http://127.0.0.1:5000;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

---

## 7. SSL / HTTPS

```bash
sudo apt install certbot python3-certbot-nginx
sudo certbot --nginx -d yourdomain.com -d www.yourdomain.com
sudo certbot --nginx -d admin.yourdomain.com
sudo certbot --nginx -d pos.yourdomain.com
sudo certbot --nginx -d api.yourdomain.com
sudo certbot renew --dry-run
```

---

## 8. Full Deployment Flow

```bash
# 1. Server setup
apt update && apt upgrade -y
apt install -y docker.io nginx certbot python3-certbot-nginx
npm install -g pnpm pm2

# 2. Deploy code
git clone https://github.com/dev-sajid007/pahartheke-v5.git
cd pahartheke-v5
pnpm install

# 3. Configure env (edit each file)
vim apps/main-api/.env
vim apps/pos-api/.env
vim apps/storefront/.env.local
vim apps/pos/.env.local
vim apps/admin/.env.local

# 4. Start MongoDB
docker compose -f docker/compose.main.yml up -d
docker compose -f docker/compose.pos.yml up -d

# 5. Build & start
pnpm build
pm2 start ecosystem.config.js
pm2 save
pm2 startup

# 6. Configure Nginx + SSL
# Copy nginx configs to /etc/nginx/sites-available/
# Run certbot for each domain
```

---

## 9. Server Specs

| Tier | Specs | Monthly |
|------|-------|---------|
| Minimal | 1 vCPU, 2GB RAM | ~$12 |
| Recommended | 2 vCPU, 4GB RAM | ~$20 |
| High traffic | 4 vCPU, 8GB RAM | ~$40 |

---

## 10. Production Checklist

- [ ] Strong JWT secrets generated (`openssl rand -base64 32`)
- [ ] Unique `ECOMMERCE_API_KEY` set
- [ ] `NODE_ENV=production` in all backends
- [ ] MongoDB passwords set
- [ ] CORS origins set to real domains
- [ ] HTTPS working (certbot)
- [ ] PM2 set to restart on boot
- [ ] Cloudinary API keys configured
- [ ] Firewall only on ports 80, 443
- [ ] Regular MongoDB backups configured
- [ ] Monitoring set up

---

## 11. Backup

```bash
# Backup
docker exec pahartheke-mongodb mongodump --db pahar_theke --out /data/backup/$(date +%Y%m%d) --gzip
docker exec pahar-pos-mongo mongodump --db pahar_pos_v5 --out /data/backup/$(date +%Y%m%d) --gzip

# Restore
docker cp ./backups/20250101 pahartheke-mongodb:/data/backup/
docker exec pahartheke-mongodb mongorestore --db pahar_theke /data/backup/20250101/pahar_theke --gzip
```

### Daily cron
```
0 2 * * * docker exec pahartheke-mongodb mongodump --db pahar_theke --out /data/backup/$(date +\%Y\%m\%d) --gzip
0 3 * * * docker exec pahar-pos-mongo mongodump --db pahar_pos_v5 --out /data/backup/$(date +\%Y\%m\%d) --gzip
```

---

## 12. Monitoring

```bash
pm2 status
pm2 logs
pm2 monit
docker stats
tail -f /var/log/nginx/access.log
tail -f /var/log/nginx/error.log
```
