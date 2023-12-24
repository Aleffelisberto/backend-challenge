FROM node:20-alpine AS builder

WORKDIR /app

COPY . .

RUN npm install
RUN npm run build

FROM node:20-alpine AS final

WORKDIR /app

COPY --from=builder ./app/build ./build
COPY package.json .
COPY package-lock.json .

RUN npm install --production

# setting a delay due to connections
CMD sh -c 'sleep 15 && npm start'