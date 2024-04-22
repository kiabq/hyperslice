# Description: Dockerfile for the APIs
FROM node:lts
WORKDIR /api
COPY . .

# Install typescript and ts-node
RUN npm install -g typescript ts-node
RUN npm install

# Expose port 3000
EXPOSE 3000

# Run the server
CMD ts-node index.ts