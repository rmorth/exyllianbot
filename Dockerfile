FROM node:16-alpine

ENV TZ=Europe/Lisbon
RUN ln -snf /usr/share/zoneinfo/$TZ /etc/localtime && echo $TZ > /etc/timezone

RUN apk update && apk add --no-cache \
	g++ \
	make \
	python3 \
	sqlite && cp $(which python3) /usr/bin/python

WORKDIR /src/app
COPY package.json package-lock.json ./

RUN npm install
COPY . .
RUN apk del g++ make python3
RUN cat data/exylliandb.sql | sqlite3 data/ExyllianDB.db
RUN node deploy-commands.js

CMD [ "node", "index.js" ]
