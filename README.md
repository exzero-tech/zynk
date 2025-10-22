# ZYNK

**Peer-to-peer EV charging marketplace for Sri Lanka**

---

## About

ZYNK is a mobile platform that connects electric vehicle drivers with private charging station owners. It enables hosts to monetize their idle EV chargers while providing drivers with convenient, affordable charging options.

### Use Cases

- **EV Drivers**: Search for nearby charging stations, make reservations, and pay seamlessly through the app
- **Charger Hosts**: List private charging stations and earn revenue from idle charging equipment
- **BYOC (Bring Your Own Charger)**: Standard electrical outlets can be used - drivers bring their own charging cables for flexibility

---

## Installation

### Prerequisites
- Node.js 18+
- Docker Desktop
- Expo CLI (`npm install -g expo-cli`)

### Setup

```bash
# Clone repository
git clone https://github.com/exzero-tech/zynk.git
cd zynk

# Backend setup
cd backend
npm install
cp .env.example .env  # Configure your environment variables
npx prisma migrate deploy --schema=./shared/prisma/schema.prisma
npx prisma generate --schema=./shared/prisma/schema.prisma
docker-compose up --build

# Driver app
cd ../driver-app
npm install
npm start

# Host app
cd ../host-app
npm install
npm start
```

---

## Technical Overview

ZYNK uses a microservices architecture with the following components:

- **Backend**: Node.js + TypeScript + Express.js microservices (API Gateway, User Service, Charger Service, Analytics Service)
- **Database**: PostgreSQL with PostGIS extension on Neon serverless platform
- **Mobile Apps**: React Native + Expo for cross-platform iOS/Android development
- **Real-time**: Socket.io for live session tracking and notifications
- **Payments**: PayHere payment gateway integration
- **Smart Chargers**: OCPP 1.6J protocol support via WebSocket

---


