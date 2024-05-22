#!/usr/bin/bash

# Drop previous containers
docker-compose --file docker-compose.yml down

# Drop previous images
docker rmi $(docker image ls -q)

# Drop previous volumes
docker volume rm $(docker volume ls -q)

# Run docker compose
docker-compose --file docker-compose.yml up --detach --build -V

# Start mongoDB replica set
docker exec -it mongodb-primary sh -c 'chmod +x /scripts/rs-init.sh'
docker exec -it mongodb-primary sh ./scripts/rs-init.sh;

