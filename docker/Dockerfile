FROM node:18-alpine3.15

ARG PORT
RUN if [ -z "$PORT" ] ; then echo "The PORT argument is missing!" ; exit 1; fi

WORKDIR /srv/app

COPY . .

RUN npm install

EXPOSE ${PORT}/tcp