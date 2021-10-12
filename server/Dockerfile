FROM node

WORKDIR /server

RUN npm install -g knex

COPY package.json /server/

COPY yarn.lock /server/

RUN yarn install

COPY . /server/

EXPOSE 3001

CMD [ "npm", "run", "initDocker" ]