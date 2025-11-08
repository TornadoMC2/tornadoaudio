# Multi-stage build for optimized production image
# Stage 1: Build the React app
FROM node:18-alpine AS builder

WORKDIR /app

# Copy package files first for better layer caching
COPY package*.json ./
COPY server/package*.json ./server/

# Install ALL dependencies (including devDependencies) for building
# Use --legacy-peer-deps to handle React 19 compatibility issues
RUN npm ci --legacy-peer-deps
RUN cd server && npm ci --only=production

# Copy source code
COPY . .

# Build the React app with memory optimization for small servers
ENV NODE_OPTIONS="--max-old-space-size=512"
ENV GENERATE_SOURCEMAP=false
ENV DISABLE_ESLINT_PLUGIN=true
ENV NODE_ENV=production

# Generate sitemap and build
RUN npm run generate-sitemap
RUN npm run build

# Stage 2: Production image (minimal size)
FROM node:18-alpine

WORKDIR /app

# Install dumb-init for proper signal handling
RUN apk add --no-cache dumb-init

# Copy only necessary files from builder
COPY --from=builder /app/build ./build
COPY --from=builder /app/server ./server
COPY --from=builder /app/server/node_modules ./server/node_modules

# Create a non-root user for security
RUN addgroup -g 1001 -S nodejs && adduser -S nodejs -u 1001
RUN chown -R nodejs:nodejs /app

# Switch to non-root user
USER nodejs

# Set working directory to server
WORKDIR /app/server

# Expose port
EXPOSE 3001

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD node -e "require('http').get('http://localhost:3001/api/analytics/health', (r) => {process.exit(r.statusCode === 200 ? 0 : 1)})"

# Run the server with dumb-init for proper signal handling
CMD ["dumb-init", "node", "server.js"]
