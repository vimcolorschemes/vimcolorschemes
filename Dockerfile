FROM node:14.11.0-buster-slim

WORKDIR /usr/src/app

COPY . ./

RUN npm install --no-optional

EXPOSE 8000

ENTRYPOINT ["npm", "run", "start-local"]
