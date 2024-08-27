FROM node:20.17.0

ARG APP_PORT=80

WORKDIR /opt/app

COPY ./package*.json .

RUN npm i

COPY . .

RUN npx tsc 

ENTRYPOINT [ "npm" ]
CMD [ "start" ]

EXPOSE ${APP_PORT}
