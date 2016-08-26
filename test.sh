#!/bin/sh
docker run -v `pwd`/postman:/var/newman -w /var/newman -t postman/newman_alpine33 --collection="collection.json" --environment="environment.json"
