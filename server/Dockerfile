FROM node:current-bullseye-slim AS development

WORKDIR /project/server

COPY apollo/ /project/apollo/

RUN cd .. && cd apollo && yarn install && yarn build

RUN npm install -g knex

COPY server/ /project/server/

RUN yarn install

EXPOSE 3001

CMD [ "npm", "run", "initDocker" ]

FROM node:current-bullseye-slim AS builder
ENV NODE_ENV production

WORKDIR /project/server

COPY --from=development /project/apollo/ /project/apollo/

COPY --from=development /project/server /project/server

RUN yarn build

FROM node:current-bullseye-slim as production
ENV NODE_ENV production

WORKDIR /project/build

COPY --from=builder /project/server/dist /project/server/scripts /project/build/
COPY --from=builder /project/server/prisma/schema.prisma /project/build/prisma/

COPY --from=builder /project/apollo/ /project/apollo/

EXPOSE 3001

RUN ["chmod", "+x", "./initDocker.sh"]

ENTRYPOINT "./initDocker.sh"
