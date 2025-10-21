# ZYNK Backend Services

A microservices-based EV charging platform backend built with Node.js, TypeScript, and Express.

## Architecture

The backend consists of four microservices:

- **API Gateway** (Port 3000): Entry point for all client requests, handles routing and authentication
- **User Service** (Port 3001): Manages user accounts, authentication, and profiles
- **Charger Service** (Port 3002): Handles EV charger management, bookings, and payments
- **Analytics Service** (Port 3003): Processes usage data and generates insights

## Prerequisites

- Node.js 18+
- Docker and Docker Compose
- PostgreSQL database (Neon recommended)

## Setup

1. **Clone the repository and navigate to backend:**
   ```bash
   cd backend
   ```

2. **Install dependencies for all services:**
   ```bash
   # Install dependencies for each service
   cd services/api-gateway && npm install && cd ../..
   cd services/user-service && npm install && cd ../..
   cd services/charger-service && npm install && cd ../..
   cd services/analytics-service && npm install && cd ../..
   ```

3. **Environment Configuration:**
   ```bash
   # Copy the example environment file
   cp .env.example .env

   # Edit .env with your actual values:
   # - DATABASE_URL: Your Neon PostgreSQL connection string
   # - JWT_SECRET: A secure random string for JWT signing
   # - PayHere credentials if using payment features
   ```

4. **Database Setup:**
   ```bash
   # Run database migrations (when Prisma is set up)
   # cd services/user-service && npx prisma migrate dev
   # cd services/charger-service && npx prisma migrate dev
   # cd services/analytics-service && npx prisma migrate dev
   ```

## Running with Docker (Recommended)

1. **Build and start all services:**
   ```bash
   docker-compose up --build
   ```

2. **Run in background:**
   ```bash
   docker-compose up -d --build
   ```

3. **View logs:**
   ```bash
   docker-compose logs -f
   ```

4. **Stop services:**
   ```bash
   docker-compose down
   ```

## Running Locally (Development)

1. **Start PostgreSQL database** (or use Docker):
   ```bash
   docker run --name postgres -e POSTGRES_PASSWORD=password -p 5432:5432 -d postgres:15
   ```

2. **Start each service individually:**
   ```bash
   # Terminal 1: API Gateway
   cd services/api-gateway && npm run dev

   # Terminal 2: User Service
   cd services/user-service && npm run dev

   # Terminal 3: Charger Service
   cd services/charger-service && npm run dev

   # Terminal 4: Analytics Service
   cd services/analytics-service && npm run dev
   ```

## API Documentation

Once services are running, API documentation will be available at:
- API Gateway: http://localhost:3000/api/docs

## Health Checks

All services include health check endpoints:
- API Gateway: http://localhost:3000/health
- User Service: http://localhost:3001/health
- Charger Service: http://localhost:3002/health
- Analytics Service: http://localhost:3003/health

## Development

### Code Quality
- ESLint and Prettier are configured for code formatting
- TypeScript strict mode enabled
- Pre-commit hooks recommended

### Testing
```bash
# Run tests for all services
cd services/api-gateway && npm test
cd services/user-service && npm test
cd services/charger-service && npm test
cd services/analytics-service && npm test
```

### Database Management
```bash
# Generate Prisma client
cd services/[service-name] && npx prisma generate

# Create migration
cd services/[service-name] && npx prisma migrate dev

# View database
cd services/[service-name] && npx prisma studio
```

## Deployment

### Production Docker Build
```bash
# Build production images
docker-compose -f docker-compose.prod.yml up --build
```

### Environment Variables for Production
- Set `NODE_ENV=production`
- Use secure `JWT_SECRET`
- Configure production database URL
- Set up proper logging and monitoring

## Troubleshooting

### Common Issues

1. **Port conflicts**: Ensure ports 3000-3003 are available
2. **Database connection**: Verify DATABASE_URL in .env file
3. **Docker networking**: Services communicate via service names defined in docker-compose.yml

### Logs
```bash
# View specific service logs
docker-compose logs api-gateway
docker-compose logs user-service

# View all logs
docker-compose logs
```

## Contributing

1. Follow the established code style
2. Write tests for new features
3. Update documentation as needed
4. Ensure all services build and pass health checks