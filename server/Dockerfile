FROM node

WORKDIR /server

RUN npm install -g knex

COPY package.json /server/

COPY . /server/

RUN yarn install

EXPOSE 3001

CMD [ "npm", "run", "initDocker" ]