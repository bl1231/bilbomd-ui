# -----------------------------------------------------------------------------
# Build stage
FROM node:20-alpine AS build-stage
RUN npm install -g npm@10.8.3

WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm ci --force

# Copy your project files
COPY . .

# Set environment variables for the build process
ARG BILBOMD_UI_VERSION
ARG BILBOMD_UI_GIT_HASH
ENV BILBOMD_UI_VERSION=$BILBOMD_UI_VERSION
ENV BILBOMD_UI_GIT_HASH=$BILBOMD_UI_GIT_HASH

# Now, run the build command
RUN npm run build

# Copy over the version.json created in GitHub Actions
COPY version.json /app/dist/version.json

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
