FROM node:lts
WORKDIR /api
COPY . .
RUN npm install -g typescript ts-node
RUN npm install
EXPOSE 3000
CMD ts-node index.ts