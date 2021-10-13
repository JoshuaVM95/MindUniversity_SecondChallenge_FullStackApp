FROM node

WORKDIR /server

RUN npm install -g knex

COPY package.json /server/

RUN yarn install

COPY . /server/

EXPOSE 3001

CMD [ "npm", "run", "initDocker" ]