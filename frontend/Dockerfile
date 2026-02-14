FROM node:25.6-bookworm-slim

WORKDIR /app/frontend/

COPY package*.json ./

RUN npm install

COPY . .
