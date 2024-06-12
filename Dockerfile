FROM node:16

WORKDIR /app

COPY . .

RUN npm ci --legacy-peer-deps

RUN npm run build

CMD ["npm", "run", "start"]
