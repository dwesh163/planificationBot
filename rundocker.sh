#!/bin/bash

cd /srv/planificationBot
docker run -d node:latest npm i && node main.js
