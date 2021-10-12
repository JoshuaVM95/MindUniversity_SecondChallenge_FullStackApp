FROM node

WORKDIR /client

COPY package.json /client/

COPY yarn.lock /client/

RUN yarn install

COPY . /client/

RUN npm run build

EXPOSE 3000

CMD [ "npx", "http-server", "build", "--p", "3000" ]