# ===========================
# 1️⃣ Builder Stage
# ===========================
FROM node:18-alpine AS builder

# Set working directory
WORKDIR /app

# Copy root package and config files
COPY package*.json ./
COPY nx.json ./
COPY tsconfig.base.json ./
# COPY workspace.json ./
COPY apps ./apps
COPY libs ./libs


# Install global NX and deps
RUN npm install -g nx@latest
# Install dependencies
RUN npm ci

ENV NX_DAEMON=false
ENV NODE_OPTIONS="--experimental-vm-modules"

# Build the admin app (change if needed)
RUN npx nx build types
RUN npx nx build data-access
RUN npx nx build design-system
RUN npx nx build utils
RUN npx nx build ui

RUN NODE_OPTIONS="--experimental-vm-modules" npx nx build admin

# ===========================
# 2️⃣ Production Stage
# ===========================
FROM nginx:alpine AS runner

# Copy the build output to Nginx’s default html folder
COPY --from=builder /app/dist/apps/admin /usr/share/nginx/html
# COPY --from=builder --chown=api:nodejs /app/dist ./dist


# Expose port 80
EXPOSE 80

# Start Nginx
CMD ["nginx", "-g", "daemon off;"]
