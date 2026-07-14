#!/usr/bin/env bash
# ------------------------------------------------------------------
# EduCRM 360 — one-shot VPS deploy (Ubuntu/Debian)
# Installs Node, PostgreSQL, Nginx, PM2, and Let's Encrypt SSL, then
# builds & runs the app behind Nginx and makes it live over HTTPS.
#
# Usage (run from the cloned repo root, as root):
#   sudo DOMAIN=crm.example.com EMAIL=you@example.com bash deploy.sh
#
# Re-run any time to pull the latest code and redeploy.
# ------------------------------------------------------------------
set -euo pipefail

# ---------------- CONFIG (override via env vars) ----------------
DOMAIN="${DOMAIN:-}"                 # REQUIRED, e.g. crm.example.com
EMAIL="${EMAIL:-}"                   # REQUIRED for Let's Encrypt
DB_NAME="${DB_NAME:-educrm}"
DB_USER="${DB_USER:-educrm}"
DB_PASS="${DB_PASS:-}"              # auto-generated if empty
APP_PORT="${APP_PORT:-1111}"   # internal app port (Nginx proxies your domain to this)
APP_NAME="${APP_NAME:-educrm}"
BRANCH="${BRANCH:-main}"
NODE_MAJOR="${NODE_MAJOR:-20}"
DO_SSL="${DO_SSL:-yes}"             # set to "no" to skip certbot
DO_SEED="${DO_SEED:-yes}"          # seed demo data on first deploy
# ----------------------------------------------------------------

log() { echo -e "\n\033[1;36m==> $*\033[0m"; }
die() { echo -e "\033[1;31mERROR: $*\033[0m" >&2; exit 1; }

[ "$(id -u)" -eq 0 ] || die "Run as root (sudo bash deploy.sh)"
[ -n "$DOMAIN" ] || die "DOMAIN is required.  e.g. sudo DOMAIN=crm.example.com EMAIL=you@example.com bash deploy.sh"
[ -n "$EMAIL" ]  || die "EMAIL is required (for Let's Encrypt)."

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
APP="$SCRIPT_DIR/educrm-app"
[ -d "$APP" ] || die "educrm-app not found next to this script. Clone the repo and run from its root."
git config --global --add safe.directory "$SCRIPT_DIR" 2>/dev/null || true

export DEBIAN_FRONTEND=noninteractive

log "Installing base packages"
apt-get update -y
apt-get install -y curl git ufw ca-certificates gnupg openssl rsync

log "Node.js ${NODE_MAJOR} (if missing/old)"
if ! command -v node >/dev/null 2>&1 || [ "$(node -v | sed 's/v//' | cut -d. -f1)" -lt 18 ]; then
  curl -fsSL "https://deb.nodesource.com/setup_${NODE_MAJOR}.x" | bash -
  apt-get install -y nodejs
fi
node -v

log "PostgreSQL, Nginx, Certbot"
apt-get install -y postgresql postgresql-contrib nginx python3-certbot-nginx

log "PM2 (global)"
command -v pm2 >/dev/null 2>&1 || npm install -g pm2

log "Database role & database"
systemctl enable --now postgresql
[ -n "$DB_PASS" ] || DB_PASS="$(openssl rand -hex 16)"
sudo -u postgres psql -v ON_ERROR_STOP=1 <<SQL
DO \$do\$ BEGIN
  IF EXISTS (SELECT FROM pg_roles WHERE rolname='${DB_USER}') THEN
    ALTER ROLE ${DB_USER} LOGIN PASSWORD '${DB_PASS}';
  ELSE
    CREATE ROLE ${DB_USER} LOGIN PASSWORD '${DB_PASS}';
  END IF;
END \$do\$;
SQL
sudo -u postgres psql -tAc "SELECT 1 FROM pg_database WHERE datname='${DB_NAME}'" | grep -q 1 \
  || sudo -u postgres createdb -O "${DB_USER}" "${DB_NAME}"

DATABASE_URL="postgresql://${DB_USER}:${DB_PASS}@127.0.0.1:5432/${DB_NAME}"
SEED_SECRET="$(openssl rand -hex 12)"

log "Pulling latest code (${BRANCH})"
cd "$SCRIPT_DIR"
git pull --ff-only origin "$BRANCH" 2>/dev/null || echo "(skip git pull)"

log "Writing environment"
cat > "$APP/.env.local" <<EOF
DATABASE_URL=${DATABASE_URL}
SEED_SECRET=${SEED_SECRET}
EOF

log "Installing dependencies & building"
cd "$APP"
npm ci 2>/dev/null || npm install
npm run build

log "Starting app under PM2 (port ${APP_PORT})"
pm2 delete "$APP_NAME" >/dev/null 2>&1 || true
PORT="$APP_PORT" pm2 start npm --name "$APP_NAME" --cwd "$APP" -- run start
pm2 save
pm2 startup systemd -u root --hp /root >/dev/null 2>&1 || true

log "Waiting for the app to respond"
for i in $(seq 1 40); do curl -fsS "http://127.0.0.1:${APP_PORT}/" >/dev/null 2>&1 && break; sleep 2; done

if [ "$DO_SEED" = "yes" ]; then
  log "Creating schema + seeding demo data"
  curl -fsS -X POST -H "x-seed-secret: ${SEED_SECRET}" "http://127.0.0.1:${APP_PORT}/api/dev/seed" \
    && echo "  seeded." || echo "  (seed failed — you can run it later with the SEED_SECRET in $APP/.env.local)"
fi

log "Configuring Nginx reverse proxy"
cat > "/etc/nginx/sites-available/${APP_NAME}" <<EOF
server {
    listen 80;
    server_name ${DOMAIN};

    client_max_body_size 25m;

    location / {
        proxy_pass http://127.0.0.1:${APP_PORT};
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
        proxy_cache_bypass \$http_upgrade;
    }
}
EOF
ln -sf "/etc/nginx/sites-available/${APP_NAME}" "/etc/nginx/sites-enabled/${APP_NAME}"
rm -f /etc/nginx/sites-enabled/default
nginx -t && systemctl reload nginx

log "Firewall (allow SSH + web)"
ufw allow OpenSSH >/dev/null 2>&1 || true
ufw allow 'Nginx Full' >/dev/null 2>&1 || true
yes | ufw enable >/dev/null 2>&1 || true

if [ "$DO_SSL" = "yes" ]; then
  log "Obtaining SSL certificate (Let's Encrypt)"
  certbot --nginx -d "${DOMAIN}" --non-interactive --agree-tos -m "${EMAIL}" --redirect \
    || echo "  certbot failed — make sure ${DOMAIN}'s DNS A-record points to this server, then re-run: certbot --nginx -d ${DOMAIN}"
  systemctl reload nginx || true
fi

cat <<DONE

======================================================================
 ✅  EduCRM 360 deployed
     URL:      https://${DOMAIN}
     App port: ${APP_PORT}  (behind Nginx)
     Database: postgresql://${DB_USER}:***@127.0.0.1:5432/${DB_NAME}
     Secrets:  ${APP}/.env.local  (DB password + SEED_SECRET)

 Handy commands:
     pm2 status                 # process status
     pm2 logs ${APP_NAME}       # live logs
     pm2 restart ${APP_NAME}    # restart after changes
     sudo bash deploy.sh        # pull latest + redeploy

 To update later: git pull && sudo bash deploy.sh
======================================================================
DONE
