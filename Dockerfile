FROM node:14.11.0-buster-slim

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install --no-optional --no-progress \
 && npm cache clean --force

COPY . ./

EXPOSE 8000

ENTRYPOINT ["npm", "run", "start::local"]
