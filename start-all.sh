#!/bin/bash
set -e

ROOT_DIR="$(cd "$(dirname "$0")" && pwd)"

echo "========================================="
echo "  Pahar Theke - Starting All Services"
echo "========================================="

# ─── 1. Start MongoDB ─────────────────────────
echo ""
echo "[1/6] Starting MongoDB (Docker)..."
docker compose -f "$ROOT_DIR/pahar-pos/docker-compose.yml" up -d
echo "       Waiting for MongoDB..."
sleep 4

# ─── 2. pahar-main Backend ────────────────────
echo ""
echo "[2/6] Starting pahar-main Backend (port 5000)..."
cd "$ROOT_DIR/pahar-main/backend"
if [ ! -d "node_modules" ]; then
  npm install
fi
npm run dev &
PID_MAIN_BACKEND=$!
sleep 2

# ─── 3. pahar-main Frontend ───────────────────
echo ""
echo "[3/6] Starting pahar-main Frontend (port 3000)..."
cd "$ROOT_DIR/pahar-main/frontend"
if [ ! -d "node_modules" ]; then
  npm install
fi
npx next dev &
PID_MAIN_FRONT=$!
sleep 2

# ─── 4. pahar-main Admin ──────────────────────
echo ""
echo "[4/6] Starting pahar-main Admin (port 3001)..."
cd "$ROOT_DIR/pahar-main/admin"
if [ ! -d "node_modules" ]; then
  npm install
fi
npx next dev -p 3001 &
PID_MAIN_ADMIN=$!
sleep 2

# ─── 5. pahar-pos Backend ─────────────────────
echo ""
echo "[5/6] Starting pahar-pos Backend (port 4001)..."
cd "$ROOT_DIR/pahar-pos/backend"
if [ ! -d "node_modules" ]; then
  npm install
fi
npm run dev &
PID_POS_BACKEND=$!
sleep 2

# ─── 6. pahar-pos Frontend ────────────────────
echo ""
echo "[6/6] Starting pahar-pos Frontend (port 4000)..."
cd "$ROOT_DIR/pahar-pos/frontend"
if [ ! -d "node_modules" ]; then
  npm install
fi
npm run dev -- -p 4000 &
PID_POS_FRONT=$!

# ─── Summary ───────────────────────────────────
echo ""
echo "========================================="
echo "  All services started!"
echo "========================================="
echo "  Main Storefront : http://localhost:3000"
echo "  Main Admin      : http://localhost:3001"
echo "  POS Dashboard   : http://localhost:4000"
echo "  POS API         : http://localhost:4001"
echo "  MongoDB         : localhost:27017"
echo "========================================="
echo ""
echo "Press Ctrl+C to stop all services"

# ─── Graceful Shutdown ────────────────────────
trap "echo ''; echo 'Stopping all services...'; kill $PID_MAIN_BACKEND $PID_MAIN_FRONT $PID_MAIN_ADMIN $PID_POS_BACKEND $PID_POS_FRONT 2>/dev/null; echo 'Done.'; exit" SIGINT SIGTERM

wait