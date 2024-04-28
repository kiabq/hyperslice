# Description: Dockerfile for the client
FROM node:lts AS runtime
WORKDIR /client

COPY . .

# Define ARGS and ENV
ARG PUBLIC_BACKEND_URL
ENV PUBLIC_BACKEND_URL=$PUBLIC_BACKEND_URL
ENV HOST=0.0.0.0
ENV PORT=4321

# Print URLs
RUN echo "BACKEND URL IS: ${PUBLIC_BACKEND_URL}"

# Install dependencies and build the client
RUN npm install
RUN PUBLIC_BACKEND_URL=${PUBLIC_BACKEND_URL} npm run build

# Expose port 4321
EXPOSE ${PORT}

# Run the server
CMD node ./dist/server/entry.mjs