#!/bin/bash
directory=$(pwd)

echo "$directory"

cp "$directory/.env.local" "$directory/.env"

echo "Setting up the local environment..."

# Check if the environment file exists
ENV_FILE="$directory/.env"
if [ ! -f "$ENV_FILE" ]; then
    echo "Error: Environment file '$ENV_FILE' not found!"
    exit 1
fi
# Read values from the environment file
source "$ENV_FILE"

docker network create "local-network"

mkdir -p $directory/docker/local/postgres-data

cp $directory/.env $directory/docker/local/.env
cp $directory/.dockerignore $directory/docker/local/.dockerignore

docker compose -f $directory/docker/local/docker-compose.yaml up -d --build

npm run migration:run
