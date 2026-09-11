#!/bin/sh

set -e

echo "Waiting for database..."

python - <<'PY'
import os
import time
import psycopg

database_url = os.environ["DATABASE_URL"]

for attempt in range(30):
    try:
        with psycopg.connect(database_url):
            print("Database is ready.")
            break
    except Exception as exc:
        print(f"Database not ready: {exc}")
        time.sleep(2)
else:
    raise SystemExit("Could not connect to database.")
PY

echo "Running migrations..."

python manage.py migrate --noinput

echo "Collecting static files..."

python manage.py collectstatic --noinput

echo "Starting Gunicorn..."

exec gunicorn config.wsgi:application \
    --bind 0.0.0.0:8000 \
    --workers 3 \
    --timeout 120
