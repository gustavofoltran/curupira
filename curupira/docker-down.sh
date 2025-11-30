#!/bin/bash

docker compose -f docker-compose.yml -f docker-compose.prod.yml -f docker-compose.test.yml down -v

docker system prune --all