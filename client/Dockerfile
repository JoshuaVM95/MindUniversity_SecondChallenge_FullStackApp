FROM node

WORKDIR /client

COPY package.json /client/

RUN yarn install

COPY . /client/

RUN yarn add date-fns

RUN npm run build

EXPOSE 3000

CMD [ "npx", "http-server", "build", "--p", "3000" ]