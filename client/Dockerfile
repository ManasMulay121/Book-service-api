# Build stage
FROM node:18-alpine AS builder

# ARG for build-time environment variables
ARG VITE_API_URL

# Set build-time environment variables
ENV VITE_API_URL=$VITE_API_URL

WORKDIR /app

# Copy package files and yarn lock
COPY package*.json yarn.lock ./

# Install dependencies with retry and timeout settings
RUN yarn install --frozen-lockfile --network-timeout 100000 --network-concurrency 1

# Copy source code
COPY . .

# Build the app
RUN npm run build

# Production stage
FROM nginx:alpine

# Copy built app from builder stage
COPY --from=builder /app/dist /usr/share/nginx/html

# Copy custom nginx config
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expose port 80
EXPOSE 80

# Start nginx
CMD ["nginx", "-g", "daemon off;"]