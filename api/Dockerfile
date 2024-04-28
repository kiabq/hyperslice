# Description: Dockerfile for the APIs
FROM node:lts
WORKDIR /api
COPY . .

# Install typescript and ts-node
RUN npm install -g typescript ts-node
RUN npm install

# Print URLs
RUN echo "BACKEND URL IS: ${BACKEND_URL}"
RUN echo "FRONTEND URL IS: ${FRONTEND_URL}"

# Expose port 3000
EXPOSE 3000

# Run the server
CMD ts-node index.ts