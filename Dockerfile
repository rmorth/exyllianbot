FROM node:16

ENV TZ=Europe/Lisbon
RUN ln -snf /usr/share/zoneinfo/$TZ /etc/localtime && echo $TZ > /etc/timezone

RUN apt update --fix-missing && apt-get install -y --no-install-recommends \
	sqlite3

WORKDIR /src/app
COPY . .

RUN npm install

RUN cat data/exylliandb.sql | sqlite3 data/ExyllianDB.db

RUN node deploy-commands.js
CMD [ "node", "index.js" ]
