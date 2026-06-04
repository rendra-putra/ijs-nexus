# ============================
# 1) Build Stage — Using Node.js 22
# ============================
FROM node:22-alpine AS builder

WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm ci --legacy-peer-deps

# Copy all source files
COPY . .

# Build Vite project
RUN npm run build


# ============================
# 2) Production Stage — nginx
# ============================
FROM nginx:stable-alpine

WORKDIR /usr/share/nginx/html

# Clean default nginx web folder
RUN rm -rf ./*

# Copy built assets
COPY --from=builder /app/dist ./

# Copy runtime environment injector
COPY docker-entrypoint.sh /docker-entrypoint.sh
RUN chmod +x /docker-entrypoint.sh

# Copy nginx configuration
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

ENTRYPOINT ["/docker-entrypoint.sh"]
CMD ["nginx", "-g", "daemon off;"]
