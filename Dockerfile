FROM node:23-alpine

RUN apk update && apk upgrade

RUN mkdir -p /home/node/app/node_modules && chown -R node:node /home/node/app

WORKDIR /home/node/app

USER node

COPY --chown=node:node package*.json ./

RUN npm install

COPY --chown=node:node . ./

RUN npm run build

EXPOSE 3000

CMD [ "npm", "run", "dev" ]