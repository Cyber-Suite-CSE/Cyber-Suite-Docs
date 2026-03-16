# Stage 1: Build the Docusaurus application
FROM node:22-alpine AS builder

WORKDIR /app

# Copy package files
COPY package*.json ./
RUN npm ci

# Copy the rest of the source code
COPY . .
RUN npm run build

# Stage 2: Serve the static files with Nginx
FROM nginx:alpine

# Copy the build output to Nginx's html directory
COPY --from=builder /app/build /usr/share/nginx/html/docs

CMD nginx -g 'daemon off;'
