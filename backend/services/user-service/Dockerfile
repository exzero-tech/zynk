FROM node:18-alpine

WORKDIR /app

# Copy package files and install dependencies
COPY services/user-service/package*.json ./
RUN npm install

# Copy only schema and migrations (not seed.ts)
COPY shared/prisma/schema.prisma ./shared/prisma/schema.prisma
COPY shared/prisma/migrations ./shared/prisma/migrations
RUN npx prisma generate --schema=./shared/prisma/schema.prisma

# Copy service code
COPY services/user-service ./

EXPOSE 3001

# Run in dev mode with nodemon + tsx
CMD ["npm", "run", "dev"]