#!/bin/bash
set -e

python wait-for-db.py

echo "Applying migrations..."
python manage.py migrate --noinput

python manage.py runserver 0.0.0.0:8000