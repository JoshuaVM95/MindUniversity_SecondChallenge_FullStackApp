FROM node

WORKDIR /client

COPY package.json /client/

COPY . /client/

RUN yarn install --network-timeout 100000

RUN export NODE_OPTIONS=--openssl-legacy-provider && npm run build

EXPOSE 3000

CMD [ "npm", "run", "initDocker" ]