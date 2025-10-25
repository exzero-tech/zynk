FROM node:18-alpine

# Install OpenSSL for Prisma
RUN apk add --no-cache openssl

WORKDIR /app

# Copy package files and install dependencies
COPY api-gateway/package*.json ./
RUN npm install

# Copy service code
COPY api-gateway ./

EXPOSE 3000

# Run in dev mode with nodemon + tsx
CMD ["npm", "run", "dev"]