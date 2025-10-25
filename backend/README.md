# ZYNK Backend Services

A microservices-based EV charging platform backend built with Node.js, TypeScript, and Express.

## Architecture

Four microservices:
- **API Gateway** (Port 3000): Entry point, routing, authentication
- **User Service** (Port 3001): User accounts, auth, profiles
- **Charger Service** (Port 3002): EV chargers, bookings, payments
- **Analytics Service** (Port 3003): Usage data and insights

## Quick Start

```bash
cd backend
cp .env.example .env  # Configure DATABASE_URL, JWT_SECRET, etc.
docker-compose up --build
```

## Prerequisites

- Docker and Docker Compose
- PostgreSQL database (Neon recommended)

## Environment Setup

Edit `.env` with:
- `DATABASE_URL`: Neon PostgreSQL connection string
- `DIRECT_URL`: Direct Neon connection for migrations
- `JWT_SECRET`: Secure random string
- `PAYHERE_MERCHANT_ID` & `PAYHERE_MERCHANT_SECRET`: Payment credentials

## Database

```bash
# Push schema changes (handled automatically in Docker)
cd shared && npx prisma db push

# View database
cd shared && npx prisma studio
```

## Development

### Docker Commands
```bash
# Start services
docker-compose up --build

# Run in background
docker-compose up -d --build

# View logs
docker-compose logs -f

# Stop services
docker-compose down
```

## API Endpoints

- **API Gateway**: http://localhost:3000
- **Health Checks**: `/health` on each service
- **API Docs**: http://localhost:3000/api/docs (when implemented)

## Troubleshooting

### Common Issues
- **Port conflicts**: Ensure ports 3000-3003 are free
- **Database connection**: Check DATABASE_URL in .env
- **Docker issues**: `docker-compose down -v` to reset


```