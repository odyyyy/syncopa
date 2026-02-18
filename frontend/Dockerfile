FROM node:25.6-bookworm-slim

WORKDIR /frontend

COPY package*.json ./

RUN npm install

COPY . .
