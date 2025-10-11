#!/bin/bash

docker stop $(docker ps -aq)

docker rm -f $(docker ps -aq)

docker rmi -f $(docker images -aq)

docker volume rm -f $(docker volume ls -q)

docker network prune -f

docker builder prune -af
