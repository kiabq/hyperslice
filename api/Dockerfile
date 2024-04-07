FROM node:lts
WORKDIR /api
COPY . .
RUN npm install -g typescript ts-node
RUN npm install
EXPOSE 3001
CMD ts-node index.ts