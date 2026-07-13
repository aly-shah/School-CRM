#!/usr/bin/env bash
# Fast redeploy (used by the auto-deploy GitHub Action, or run by hand).
# Pulls latest, applies any new DB schema, rebuilds, and restarts under PM2.
set -e

REPO="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
APP="$REPO/educrm-app"
git config --global --add safe.directory "$REPO" 2>/dev/null || true

echo "==> Pulling latest"
cd "$REPO"
git pull --ff-only

cd "$APP"

# apply idempotent schema changes (CREATE/ALTER IF NOT EXISTS)
if [ -f .env.local ]; then
  DBURL="$(grep -m1 '^DATABASE_URL=' .env.local | cut -d= -f2-)"
  if [ -n "$DBURL" ]; then
    echo "==> Applying schema"
    psql "$DBURL" -f db/schema.sql >/dev/null 2>&1 || echo "   (schema step skipped)"
  fi
fi

echo "==> Installing & building"
npm ci || npm install
npm run build

echo "==> Restarting"
pm2 restart educrm --update-env 2>/dev/null || PORT="${APP_PORT:-1111}" pm2 start npm --name educrm --cwd "$APP" -- run start
pm2 save

echo "==> Done."
