#!/bin/bash
docker compose --env-file .env -f docker-compose.yml -p "virtual-protocol-backend" down
docker compose --env-file .env -f docker-compose.yml -p "virtual-protocol-backend" build
docker compose --env-file .env -f docker-compose.yml -p "virtual-protocol-backend" up -d
