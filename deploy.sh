#!/usr/bin/env bash
#
# Deploy the personal-finance API on the VPS.
# Run this ON THE SERVER from inside the repo:  ./deploy.sh
# (or remotely via the workspace Makefile:  make deploy-api)
#
set -euo pipefail

# --- config (override via env) ------------------------------------------------
PM2_NAME="${PM2_NAME:-personal-finance-api}"   # exact `pm2 ls` name
# -----------------------------------------------------------------------------

cd "$(dirname "$0")"

echo "==> [api] git pull"
git pull --ff-only

echo "==> [api] npm ci"
npm ci --legacy-peer-deps

echo "==> [api] build"
npm run build

echo "==> [api] db:migrate"
npm run db:migrate

echo "==> [api] pm2 reload $PM2_NAME"
pm2 reload "$PM2_NAME" --update-env
pm2 save

echo "==> [api] done"
