# -----------------------------------------------------------------------------
# Build stage
FROM node:20-alpine AS build-stage
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

# -----------------------------------------------------------------------------
# Serve stage
FROM nginx:alpine
RUN apk add --no-cache bash
COPY --from=build-stage /app/dist /usr/share/nginx/html
# Ensure the directory exists and copy the nginx.conf.template file
RUN mkdir -p /etc/nginx/templates
COPY nginx.default.conf /etc/nginx/templates/nginx.conf.template
EXPOSE 80
# CMD ["nginx", "-g", "daemon off;"]
CMD ["/bin/bash", "-c", "envsubst '${BACKEND_SERVICE_URL}' < /etc/nginx/templates/nginx.conf.template > /etc/nginx/conf.d/default.conf && nginx -g 'daemon off;'"]