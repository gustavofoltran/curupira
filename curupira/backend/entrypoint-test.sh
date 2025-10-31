#!/bin/bash
set -e

echo "Applying migrations..."
python manage.py makemigrations --noinput || true
python manage.py migrate --noinput

echo "Running tests..."
pytest 

EXIT_CODE=$?
echo "Finishing tests and terminating container"
exit $EXIT_CODE
