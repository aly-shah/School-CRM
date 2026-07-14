#!/usr/bin/env bash
# Runs on the VPS after CI rsyncs a fresh build. Fast: only installs deps when
# the lockfile changed, applies any new schema, then restarts PM2.
set -e
cd "$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

# reinstall deps only when package-lock.json actually changed
if [ -f package-lock.json ]; then
  H="$(sha1sum package-lock.json | awk '{print $1}')"
  if [ "$(cat .lockhash 2>/dev/null)" != "$H" ]; then
    echo "==> dependencies changed — installing"
    npm ci
    echo "$H" > .lockhash
  fi
fi

# apply any new DB schema (idempotent)
if [ -f .env.local ]; then
  DBURL="$(grep -m1 '^DATABASE_URL=' .env.local | cut -d= -f2-)"
  if [ -n "$DBURL" ] && [ -f db/schema.sql ]; then
    psql "$DBURL" -f db/schema.sql >/dev/null 2>&1 || true
  fi
fi

pm2 restart educrm --update-env 2>/dev/null || PORT="${APP_PORT:-1111}" pm2 start npm --name educrm --cwd "$(pwd)" -- run start
pm2 save
echo "==> restarted"
