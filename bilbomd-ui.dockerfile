# -----------------------------------------------------------------------------
# Build stage
FROM node:22-alpine AS build-stage
ARG GITHUB_TOKEN
ARG BILBOMD_UI_VERSION
ARG BILBOMD_UI_GIT_HASH

# RUN npm install -g npm@10.9.0

WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Create .npmrc file using the build argument
RUN echo "//npm.pkg.github.com/:_authToken=${GITHUB_TOKEN}" > /root/.npmrc

# Install dependencies
RUN npm ci

# Remove .npmrc file for security
RUN rm /root/.npmrc

# Optionally, clean up the environment variable for security
RUN unset GITHUB_TOKEN

# Copy your project files
COPY . .

# Set environment variables for the build process
ENV BILBOMD_UI_VERSION=${BILBOMD_UI_VERSION}
ENV BILBOMD_UI_GIT_HASH=${BILBOMD_UI_GIT_HASH}

# Build our app
RUN npm run build

# Copy over the version.json created in GitHub Actions
# COPY version.json /app/build/version.json

# Generate version.json during the build
# this json is served up from /version-info
RUN echo "{ \"version\": \"${BILBOMD_UI_VERSION}\", \"gitHash\": \"${BILBOMD_UI_GIT_HASH}\" }" > /app/build/version.json


# -----------------------------------------------------------------------------
# Serve stage
FROM docker.io/nginx:alpine
RUN apk add --no-cache bash

# Copy the built app to nginx serving directory
COPY --from=build-stage /app/build /usr/share/nginx/html

# Optionally, customize nginx configuration
COPY nginx.default.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
