FROM node:20.17.0

WORKDIR /opt/app

COPY ./package*.json .

RUN npm i

COPY . .

RUN npm run build

ENTRYPOINT [ "npm" ]
CMD [ "start" ]
