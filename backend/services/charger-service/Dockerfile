FROM node:18-alpine

# Install OpenSSL for Prisma
RUN apk add --no-cache openssl

WORKDIR /app

# Copy package files and install dependencies
COPY services/charger-service/package*.json ./
RUN npm install

# Copy only schema and migrations (not seed.ts)
COPY shared/prisma/schema.prisma ./shared/prisma/schema.prisma
COPY shared/prisma/migrations ./shared/prisma/migrations
RUN npx prisma generate --schema=./shared/prisma/schema.prisma

# Copy service code
COPY services/charger-service ./

# Copy and set up entrypoint script
COPY services/charger-service/docker-entrypoint.sh /usr/local/bin/
RUN chmod +x /usr/local/bin/docker-entrypoint.sh

EXPOSE 3002

# Use entrypoint to regenerate Prisma on startup (after volumes are mounted)
ENTRYPOINT ["/usr/local/bin/docker-entrypoint.sh"]
CMD ["npm", "run", "dev"]