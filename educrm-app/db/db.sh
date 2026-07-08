#!/usr/bin/env bash
# Manage the local EduCRM Postgres cluster (user-owned, no sudo).
#   ./db/db.sh start | stop | status | psql
set -e
BIN=/usr/lib/postgresql/16/bin
DATA=/home/asad/Downloads/school_crm/pgdata
PORT=5433
export PGHOST=127.0.0.1 PGPORT=$PORT PGUSER=asad PGDATABASE=educrm

case "${1:-status}" in
  start)  "$BIN/pg_ctl" -D "$DATA" -l "$DATA/server.log" -o "-p $PORT -k $DATA/sock" -w start ;;
  stop)   "$BIN/pg_ctl" -D "$DATA" -w stop ;;
  status) "$BIN/pg_isready" -p $PORT -h 127.0.0.1 ; "$BIN/pg_ctl" -D "$DATA" status || true ;;
  psql)   shift; "$BIN/psql" "$@" ;;
  *) echo "usage: $0 {start|stop|status|psql}"; exit 1 ;;
esac
