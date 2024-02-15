FROM node:18-bullseye-slim AS development
ENV NODE_ENV development

WORKDIR /project/client

COPY apollo/ /project/apollo/

RUN cd .. && cd apollo && yarn install && yarn build

COPY client/ /project/client/

RUN yarn install

EXPOSE 3000

CMD [ "yarn", "start" ]

FROM node:18-bullseye-slim AS builder
ENV NODE_ENV production
ENV DISABLE_ESLINT_PLUGIN true

WORKDIR /project/client

COPY --from=development /project/apollo/ /project/apollo/

COPY --from=development /project/client/ /project/client/

RUN yarn build --production

FROM nginx:mainline-bookworm-perl as production
ENV NODE_ENV production

COPY --from=builder /project/client/build /usr/share/nginx/html

COPY --from=builder /project/client/nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]