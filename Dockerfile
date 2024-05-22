# -----------------------------------------------------------------------------
# Build stage
FROM node:20-alpine AS build-stage
RUN npm install -g npm@10.8.0

WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm ci --verbose

# Copy your project files
COPY . .

ARG GIT_HASH
ENV GIT_HASH=$GIT_HASH

# Now, run the build command
RUN npm run build

# -----------------------------------------------------------------------------
# Serve stage
FROM docker.io/nginx:alpine
RUN apk add --no-cache bash

# Copy the built app to nginx serving directory
COPY --from=build-stage /app/dist /usr/share/nginx/html

# Optionally, customize nginx configuration
COPY nginx.default.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
