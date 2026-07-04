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

# ssh <host> 'cmd' runs a non-login shell, which doesn't source ~/.bashrc, so
# nvm (and npm/node/pm2 with it) wouldn't be on PATH without this.
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"

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
