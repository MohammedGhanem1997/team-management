#!/usr/bin/env bash
set -euo pipefail

parse_db() {
  local url="$1"
  if [[ "$url" =~ ^postgresql:\/\/[^:]+:[^@]+@([^:]+):([0-9]+)\/.*$ ]]; then
    echo "${BASH_REMATCH[1]} ${BASH_REMATCH[2]}"
  else
    echo "team-postgres 5432"
  fi
}

read DB_HOST DB_PORT < <(parse_db "${DATABASE_URL:-postgresql://postgres:password@team-postgres:5432/football_teams}")

echo "Waiting for Postgres at $DB_HOST:$DB_PORT..."
until (echo > /dev/tcp/$DB_HOST/$DB_PORT) >/dev/null 2>&1; do
  sleep 1
done
echo "Postgres is up"

echo "Running migrations..."
npm run migration:run || true

exec "$@"
