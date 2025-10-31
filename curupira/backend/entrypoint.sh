set -e

echo "Waiting for database to be ready..."
python wait-for-db.py

echo "Creating and applying database migrations..."
python manage.py migrate
python manage.py import_activities ./activities.json

exec "$@"
