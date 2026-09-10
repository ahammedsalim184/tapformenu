#!/usr/bin/env bash

set -o errexit

echo "=== CHECKING MEDIA FILES ==="
pwd
ls -lh media/restaurants/seaking-seafood-restaurant/signature-dishes/
echo "=== MEDIA CHECK COMPLETE ==="

pip install -r requirements.txt

python manage.py collectstatic --no-input

python manage.py migrate