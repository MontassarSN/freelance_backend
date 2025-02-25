#!/bin/bash
set -e

directory=$(pwd)

cp "$directory/.env.staging" "$directory/.env"

ENV_FILE="$directory/.env"

if [ ! -f "$ENV_FILE" ]; then
  echo "Error: Environment file '$ENV_FILE' not found!"
  exit 1
fi

docker network inspect prod-network > /dev/null 2>&1 || docker network create "prod-network"

mkdir -p "$directory/docker/prod/postgres-data"

cp "$ENV_FILE" "$directory/docker/prod/.env"

cp "$directory/.dockerignore" "$directory/docker/prod/.dockerignore"

mkdir -p $directory/docker/prod/public
mkdir -p $directory/public

cp -r $directory/public $directory/docker/prod

docker compose -f "$directory/docker/prod/docker-compose.yaml" up -d --build

npm run migration:run