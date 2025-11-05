#!/bin/sh

set -e

# Define our compose files
COMPOSE_FILES="-f docker-compose.yml -f docker-compose.test.yml"

echo "--- Tearing down old environment (if any) ---"
docker-compose $COMPOSE_FILES down -v


if [ "$1" = "--build" ]; then
  echo "--- Building images for testing ---"
  docker-compose $COMPOSE_FILES build
fi

echo "--- Starting database for tests ---"
docker-compose $COMPOSE_FILES up -d db

echo "--- Running backend tests ---"
docker-compose $COMPOSE_FILES run --rm backend

echo "--- Tearing down test environment ---"
docker-compose $COMPOSE_FILES down -v

echo "--- End of testing! ---"