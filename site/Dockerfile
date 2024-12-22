FROM node:18-alpine

WORKDIR /app

COPY package.json npm.lock ./

RUN npm install

COPY pages .

RUN npm build

EXPOSE 3000

CMD ["npm", "start"]