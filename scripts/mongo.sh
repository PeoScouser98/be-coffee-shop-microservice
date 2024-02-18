#!/bin/bash

docker-compose up -d

sleep 5

docker exec mongodb-primary scripts/rs-init.sh