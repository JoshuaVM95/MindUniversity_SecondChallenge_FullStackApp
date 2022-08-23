FROM node:current-bullseye-slim

WORKDIR /client

COPY package.json /client/

COPY . /client/

RUN yarn install --network-timeout 100000

RUN npm run build

EXPOSE 3000

CMD [ "npm", "run", "initDocker" ]