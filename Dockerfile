FROM node:20.14.0

WORKDIR /app

COPY package*.json ./

RUN npm install --legacy-peer-deps

COPY . .

COPY .env ./

CMD [ "npm", "run", "dev" ]
