#!/bin/bash
docker run -it -v $(pwd):/app -w /app node:6.9.1-slim sh -c "npm install -g webpack;npm install;env $(cat .env | xargs) webpack -p --progress"
