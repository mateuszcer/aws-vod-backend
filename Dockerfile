FROM node:20-alpine

ENV NODE_VERSION 20.10.0

WORKDIR /app

COPY . /app

RUN npm install

EXPOSE 3000

CMD ["npm", "start"]
