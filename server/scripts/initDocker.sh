#!/bin/sh

npm install -g knex
npm install knex

knex --cwd src/db migrate:latest && knex --cwd src/db seed:run

npx prisma migrate dev --name init && node prisma/seed.js

node ./src/index.js