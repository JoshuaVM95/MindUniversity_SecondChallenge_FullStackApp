FROM node

WORKDIR /client

COPY package*.json /client/

RUN npm install

COPY . /client/

RUN npm run build

EXPOSE 3000

CMD [ "npx", "http-server", "build", "--p", "3000" ]