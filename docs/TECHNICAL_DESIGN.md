# ZYNK Platform - Technical Design Document

## Table of Contents
1. [System Architecture](#system-architecture)
2. [Database Design](#database-design)
3. [API Endpoints](#api-endpoints)
4. [API Request/Response Structure](#api-requestresponse-structure)
5. [Project File Structure](#project-file-structure)
6. [OCPP Integration](#ocpp-integration)
7. [Developer Responsibilities](#developer-responsibilities)
8. [Technology Stack Summary](#technology-stack-summary)
9. [Database Connection & Shared Resources](#database-connection--shared-resources)
10. [Key Implementation Notes](#key-implementation-notes)
11. [Service Communication Pattern](#service-communication-pattern)

---

## 1. System Architecture

### 1.1 High-Level Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                        Client Layer                             │
│  ┌─────────────────────────┐    ┌─────────────────────────┐     │
│  │   Driver App (Mobile)   │    │   Host App (Mobile)     │     │
│  │  React Native + Expo    │    │  React Native + Expo    │     │ 
│  │  iOS/Android            │    │  iOS/Android            │     │
│  └─────────────────────────┘    └─────────────────────────┘     │
└─────────────────────────────────────────────────────────────────┘
                       │                        │
                       └────────────┬───────────┘
                              │ HTTPS/Socket.io
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                      API Gateway (Port 3000)                    │
│                    Express.js + TypeScript                      │
│  ┌────────────────────────────────────────────────────────┐     │
│  │  Request Routing │ Rate Limiting │ Authentication      │     │
│  └────────────────────────────────────────────────────────┘     │
└─────────────────────────────────────────────────────────────────┘
                              │
        ┌─────────────────────┼─────────────────────┐
        │                     │                     │
        ▼                     ▼                     ▼
┌──────────────┐     ┌──────────────┐     ┌──────────────┐
│ User Service │     │   Charger    │     │  Analytics   │
│  Port 3001   │     │   Service    │     │   Service    │
│              │     │  Port 3002   │     │  Port 3003   │
└──────────────┘     └──────────────┘     └──────────────┘
        │                     │                     │
        └─────────────────────┼─────────────────────┘
                              │
                              ▼
                   ┌─────────────────────┐
                   │   Neon PostgreSQL   │
                   │   with PostGIS      │
                   │  (Cloud Hosted)     │
                   └─────────────────────┘

                   ┌─────────────────────┐
                   │  External Services  │
                   ├─────────────────────┤
                   │  • PayHere API      │
                   │  • OCPP Chargers    │
                   │  • Push Notif.      │
                   └─────────────────────┘
```

### 1.2 Microservice Architecture

```
┌────────────────────────────────────────────────────────────────┐
│                        API Gateway                             │
│  • Request validation and routing                              │
│  • Authentication middleware (JWT verification)                │
│  • Rate limiting and request throttling                        │
│  • Socket.io server (real-time updates to mobile apps)         │
└────────────────────────────────────────────────────────────────┘
         │                    │                    │
         ▼                    ▼                    ▼
┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐
│  User Service   │  │ Charger Service │  │Analytics Service│
├─────────────────┤  ├─────────────────┤  ├─────────────────┤
│ • Registration  │  │ • Charger CRUD  │  │ • Usage Stats   │
│ • Login/Logout  │  │ • Reservations  │  │ • Revenue Data  │
│ • Profile Mgmt  │  │ • Sessions      │  │ • Host Reports  │
│ • JWT Auth      │  │ • OCPP Gateway  │  │ • Driver Stats  │
│ • Roles: Driver │  │ • Availability  │  │ • Demand Hotspots│
│   Host, Admin   │  │ • Amenities     │  │ • Premium Data  │
│ • Reviews       │  │ • Payments      │  │ • Export APIs   │
└─────────────────┘  └─────────────────┘  └─────────────────┘
```

### 1.3 Real-Time Communication Flow

```
Driver/Host Apps ←──Socket.io──→ API Gateway ←──HTTP──→ Microservices
                                │
                                ├──→ Charger availability updates
                                ├──→ Reservation notifications
                                ├──→ Session status changes
                                └──→ Payment confirmations
```

**Note:** Microservices notify API Gateway via HTTP callbacks. API Gateway broadcasts to mobile apps via Socket.io.

---

## 2. Database Design

### 2.1 Entity Relationship Diagram

```
┌─────────────┐         ┌─────────────┐         ┌─────────────┐
│    Users    │         │  Chargers   │         │ Amenities   │
├─────────────┤         ├─────────────┤         ├─────────────┤
│ id (PK)     │         │ id (PK)     │         │ id (PK)     │
│ email       │1       *│ host_id(FK) │1       *│ host_id(FK) │
│ password    │────────▶│ type       │────────▶│ type        │
│ role        │         │ power       │         │ name        │
│ name        │         │ speed       │         │ description │
│ phone       │         │ price_per_h │         └─────────────┘
│ created_at  │         │ is_byoc     │
└─────────────┘         │ location    │
       │                │ status      │
       │                │ created_at  │
       │                └─────────────┘
       │                       │1
       │                       │
       │                       │*
       │                ┌─────────────┐
       │                │Reservations │
       │                ├─────────────┤
       │1              *│ id (PK)     │
       └───────────────▶│ driver_id(FK│
                        │ charger_id  │
                        │ start_time  │
                        │ end_time    │
                        │ status      │
                        │ created_at  │
                        └─────────────┘
                               │1
                               │
                               │1
                               ▼
                        ┌─────────────┐
                        │  Sessions   │
                        ├─────────────┤
                        │ id (PK)     │
                        │reservation  │
                        │ start_time  │
                        │ end_time    │
                        │ energy_kwh  │
                        │ total_cost  │
                        │ status      │
                        └─────────────┘
                               │1
                               │
                               │1
                               ▼
                        ┌─────────────┐
                        │  Payments   │
                        ├─────────────┤
                        │ id (PK)     │
                        │ session_id  │
                        │ amount      │
                        │ platform_fee│
                        │ host_amount │
                        │ status      │
                        │ payhere_id  │
                        │ created_at  │
                        └─────────────┘

┌─────────────┐
│   Reviews   │
├─────────────┤
│ id (PK)     │
│ driver_id   │
│ charger_id  │
│ rating      │
│ comment     │
│ created_at  │
└─────────────┘
```

### 2.2 Table Schemas

#### Users Table
```sql
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  role VARCHAR(20) NOT NULL CHECK (role IN ('driver', 'host', 'admin')),
  name VARCHAR(255) NOT NULL,
  phone VARCHAR(20),
  profile_image_url TEXT,
  is_verified BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_role ON users(role);
```

#### Chargers Table
```sql
CREATE TABLE chargers (
  id SERIAL PRIMARY KEY,
  host_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  type VARCHAR(20) NOT NULL CHECK (type IN ('level1', 'level2', 'dc_fast')),
  connector_type VARCHAR(20) NOT NULL CHECK (connector_type IN ('type1', 'type2', 'ccs1', 'ccs2', 'chademo', 'tesla', 'gbt', 'nacs', 'three_pin', 'blue_commando')),
  power_output INTEGER NOT NULL, -- in watts
  charging_speed VARCHAR(50), -- e.g., "7.2 kW", "50 kW"
  price_per_hour DECIMAL(10, 2) NOT NULL,
  is_byoc BOOLEAN DEFAULT false,
  location GEOGRAPHY(POINT, 4326) NOT NULL, -- PostGIS type
  address TEXT NOT NULL,
  status VARCHAR(20) DEFAULT 'available' CHECK (status IN ('available', 'occupied', 'offline', 'maintenance')),
  description TEXT,
  vendor VARCHAR(100), -- for multi-vendor aggregation
  ocpp_charge_point_id VARCHAR(255), -- for OCPP integration
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_chargers_host ON chargers(host_id);
CREATE INDEX idx_chargers_location ON chargers USING GIST(location);
CREATE INDEX idx_chargers_type ON chargers(type);
CREATE INDEX idx_chargers_connector_type ON chargers(connector_type);
CREATE INDEX idx_chargers_status ON chargers(status);
```

#### Amenities Table
```sql
CREATE TABLE amenities (
  id SERIAL PRIMARY KEY,
  host_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  type VARCHAR(50) NOT NULL CHECK (type IN ('cafe', 'restaurant', 'mall', 'wifi', 'parking', 'restroom', 'lounge')),
  name VARCHAR(255) NOT NULL,
  description TEXT,
  is_promoted BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_amenities_host ON amenities(host_id);
```

#### Reservations Table
```sql
CREATE TABLE reservations (
  id SERIAL PRIMARY KEY,
  driver_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  charger_id INTEGER NOT NULL REFERENCES chargers(id) ON DELETE CASCADE,
  start_time TIMESTAMP NOT NULL,
  end_time TIMESTAMP NOT NULL,
  status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'active', 'completed', 'cancelled')),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_reservations_driver ON reservations(driver_id);
CREATE INDEX idx_reservations_charger ON reservations(charger_id);
CREATE INDEX idx_reservations_status ON reservations(status);
CREATE INDEX idx_reservations_time ON reservations(start_time, end_time);
```

#### Charging Sessions Table
```sql
CREATE TABLE charging_sessions (
  id SERIAL PRIMARY KEY,
  reservation_id INTEGER NOT NULL REFERENCES reservations(id) ON DELETE CASCADE,
  driver_id INTEGER NOT NULL REFERENCES users(id),
  charger_id INTEGER NOT NULL REFERENCES chargers(id),
  start_time TIMESTAMP NOT NULL,
  end_time TIMESTAMP,
  energy_consumed_kwh DECIMAL(10, 2) DEFAULT 0,
  total_cost DECIMAL(10, 2) DEFAULT 0,
  status VARCHAR(20) DEFAULT 'in_progress' CHECK (status IN ('in_progress', 'completed', 'stopped')),
  ocpp_transaction_id INTEGER, -- OCPP transaction reference
  -- BYOC meter reading fields
  initial_meter_reading_driver DECIMAL(10, 2), -- Driver's initial kWh reading
  initial_meter_reading_host DECIMAL(10, 2),   -- Host's initial kWh reading
  final_meter_reading_driver DECIMAL(10, 2),   -- Driver's final kWh reading
  final_meter_reading_host DECIMAL(10, 2),     -- Host's final kWh reading
  initial_readings_verified BOOLEAN DEFAULT false,
  final_readings_verified BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_sessions_reservation ON charging_sessions(reservation_id);
CREATE INDEX idx_sessions_driver ON charging_sessions(driver_id);
CREATE INDEX idx_sessions_charger ON charging_sessions(charger_id);
```

#### Payments Table
```sql
CREATE TABLE payments (
  id SERIAL PRIMARY KEY,
  session_id INTEGER NOT NULL REFERENCES charging_sessions(id),
  driver_id INTEGER NOT NULL REFERENCES users(id),
  host_id INTEGER NOT NULL REFERENCES users(id),
  amount DECIMAL(10, 2) NOT NULL,
  platform_fee DECIMAL(10, 2) NOT NULL,
  host_amount DECIMAL(10, 2) NOT NULL,
  status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'completed', 'failed', 'refunded')),
  payhere_order_id VARCHAR(255),
  payhere_payment_id VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_payments_session ON payments(session_id);
CREATE INDEX idx_payments_driver ON payments(driver_id);
CREATE INDEX idx_payments_host ON payments(host_id);
CREATE INDEX idx_payments_status ON payments(status);
```

#### Reviews Table
```sql
CREATE TABLE reviews (
  id SERIAL PRIMARY KEY,
  driver_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  charger_id INTEGER NOT NULL REFERENCES chargers(id) ON DELETE CASCADE,
  session_id INTEGER REFERENCES charging_sessions(id),
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  comment TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_reviews_driver ON reviews(driver_id);
CREATE INDEX idx_reviews_charger ON reviews(charger_id);
```

---

## 3. API Endpoints

### 3.1 User Service Endpoints (Port 3001)

#### Authentication
```
POST   /api/v1/auth/register          - Register new user (driver/host)
POST   /api/v1/auth/login             - User login (returns JWT)
POST   /api/v1/auth/logout            - User logout
POST   /api/v1/auth/refresh-token     - Refresh access token
```

#### User Profile
```
GET    /api/v1/users/profile          - Get current user profile
PUT    /api/v1/users/profile          - Update user profile
GET    /api/v1/users/:id              - Get user by ID (admin only)
DELETE /api/v1/users/:id              - Delete user (admin only)
```

#### Reviews
```
POST   /api/v1/reviews                - Create review
GET    /api/v1/reviews/charger/:id    - Get reviews for a charger
GET    /api/v1/reviews/driver/:id     - Get reviews by driver
PUT    /api/v1/reviews/:id            - Update review
DELETE /api/v1/reviews/:id            - Delete review
```

### 3.2 Charger Service Endpoints (Port 3002)

#### Charger Management
```
POST   /api/v1/chargers               - Create new charger (host only)
GET    /api/v1/chargers               - Get all chargers (with filters)
GET    /api/v1/chargers/search        - Search chargers by location/radius
GET    /api/v1/chargers/:id           - Get charger details
PUT    /api/v1/chargers/:id           - Update charger (host only)
DELETE /api/v1/chargers/:id           - Delete charger (host only)
GET    /api/v1/chargers/host/:hostId  - Get chargers by host
PATCH  /api/v1/chargers/:id/status    - Update charger status
```

#### Reservations
```
POST   /api/v1/reservations           - Create reservation
GET    /api/v1/reservations           - Get all reservations (filtered by user)
GET    /api/v1/reservations/:id       - Get reservation details
PUT    /api/v1/reservations/:id       - Update reservation
DELETE /api/v1/reservations/:id       - Cancel reservation
GET    /api/v1/reservations/charger/:id/availability - Check availability
```

#### Charging Sessions
```
POST   /api/v1/sessions/start         - Start charging session
POST   /api/v1/sessions/:id/stop      - Stop charging session
GET    /api/v1/sessions/:id           - Get session details
GET    /api/v1/sessions/driver/:id    - Get driver's sessions
GET    /api/v1/sessions/charger/:id   - Get charger's sessions
PATCH  /api/v1/sessions/:id/energy    - Update energy consumed (OCPP)
POST   /api/v1/sessions/:id/meter-reading/start  - Submit initial meter reading (BYOC)
POST   /api/v1/sessions/:id/meter-reading/end    - Submit final meter reading (BYOC)
GET    /api/v1/sessions/:id/meter-reading/status - Check meter reading verification status (BYOC)
```

#### Amenities
```
POST   /api/v1/amenities              - Create amenity (host only)
GET    /api/v1/amenities/host/:id     - Get amenities by host
PUT    /api/v1/amenities/:id          - Update amenity
DELETE /api/v1/amenities/:id          - Delete amenity
```

#### Payments
```
POST   /api/v1/payments/initiate      - Initiate PayHere payment
POST   /api/v1/payments/callback      - PayHere callback handler
GET    /api/v1/payments/:id           - Get payment details
GET    /api/v1/payments/session/:id   - Get payments for session
```

#### OCPP Integration
```
WebSocket Server: ws://charger-service:3002/ocpp
- OCPP chargers connect via WebSocket (not HTTP)
- Handles: BootNotification, Authorize, StartTransaction, StopTransaction, MeterValues, StatusNotification
- Platform can send: RemoteStartTransaction, RemoteStopTransaction
```

### 3.3 Analytics Service Endpoints (Port 3003)

#### Driver Analytics
```
GET    /api/v1/analytics/driver/:id/summary        - Driver usage summary
GET    /api/v1/analytics/driver/:id/sessions       - Session history
GET    /api/v1/analytics/driver/:id/spending       - Spending analytics
```

#### Host Analytics
```
GET    /api/v1/analytics/host/:id/dashboard        - Host dashboard data
GET    /api/v1/analytics/host/:id/revenue          - Revenue analytics
GET    /api/v1/analytics/host/:id/charger-usage    - Charger utilization
GET    /api/v1/analytics/host/:id/visitor-stats    - Visitor statistics
```

#### Platform Analytics
```
GET    /api/v1/analytics/platform/overview         - Platform overview
GET    /api/v1/analytics/platform/demand-hotspots  - Demand hotspot data
GET    /api/v1/analytics/platform/revenue          - Platform revenue
POST   /api/v1/analytics/export                    - Export analytics data
```

---

## 4. API Request/Response Structure

### 4.1 Standard Response Format

#### Success Response
```typescript
{
  success: true,
  data: any,
  message?: string
}
```

#### Error Response
```typescript
{
  success: false,
  error: {
    code: string,
    message: string,
    details?: any
  }
}
```

### 4.2 Sample API Calls

#### Register User
**Request:**
```typescript
POST /api/v1/auth/register
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "SecurePass123!",
  "name": "John Doe",
  "phone": "+94771234567",
  "role": "driver"
}
```

**Response:**
```typescript
{
  "success": true,
  "data": {
    "user": {
      "id": 1,
      "email": "john@example.com",
      "name": "John Doe",
      "role": "driver",
      "createdAt": "2025-10-20T10:30:00Z"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  },
  "message": "Registration successful"
}
```

#### Login
**Request:**
```typescript
POST /api/v1/auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "SecurePass123!"
}
```

**Response:**
```typescript
{
  "success": true,
  "data": {
    "user": {
      "id": 1,
      "email": "john@example.com",
      "name": "John Doe",
      "role": "driver"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

#### Search Chargers
**Request:**
```typescript
GET /api/v1/chargers/search?lat=6.9271&lng=79.8612&radius=5000&type=level2&connectorType=type2&minPower=7000
Authorization: Bearer <token>
```

**Response:**
```typescript
{
  "success": true,
  "data": {
    "chargers": [
      {
        "id": 1,
        "name": "Coffee House Charger",
        "type": "level2",
        "connectorType": "type2",
        "powerOutput": 7200,
        "chargingSpeed": "7.2 kW",
        "pricePerHour": 250.00,
        "location": {
          "lat": 6.9271,
          "lng": 79.8612
        },
        "address": "123 Main St, Colombo",
        "status": "available",
        "distance": 1250, // meters
        "host": {
          "id": 5,
          "name": "Coffee House",
          "rating": 4.5
        },
        "amenities": [
          {
            "type": "cafe",
            "name": "Coffee House Cafe",
            "isPromoted": true
          }
        ]
      }
    ],
    "total": 1
  }
}
```

#### Create Reservation
**Request:**
```typescript
POST /api/v1/reservations
Authorization: Bearer <token>
Content-Type: application/json

{
  "chargerId": 1,
  "startTime": "2025-10-21T14:00:00Z",
  "endTime": "2025-10-21T16:00:00Z"
}
```

**Response:**
```typescript
{
  "success": true,
  "data": {
    "reservation": {
      "id": 10,
      "driverId": 1,
      "chargerId": 1,
      "startTime": "2025-10-21T14:00:00Z",
      "endTime": "2025-10-21T16:00:00Z",
      "status": "confirmed",
      "createdAt": "2025-10-20T10:45:00Z"
    }
  },
  "message": "Reservation created successfully"
}
```

#### Start Charging Session
**Request:**
```typescript
POST /api/v1/sessions/start
Authorization: Bearer <token>
Content-Type: application/json

{
  "reservationId": 10
}
```

**Response:**
```typescript
{
  "success": true,
  "data": {
    "session": {
      "id": 25,
      "reservationId": 10,
      "driverId": 1,
      "chargerId": 1,
      "startTime": "2025-10-21T14:05:00Z",
      "status": "in_progress",
      "energyConsumedKwh": 0,
      "totalCost": 0
    }
  }
}
```

#### Host Dashboard Analytics
**Request:**
```typescript
GET /api/v1/analytics/host/5/dashboard?startDate=2025-10-01&endDate=2025-10-31
Authorization: Bearer <token>
```

**Response:**
```typescript
{
  "success": true,
  "data": {
    "totalRevenue": 45000.00,
    "totalSessions": 120,
    "totalEnergyDelivered": 850.5,
    "averageSessionDuration": 90, // minutes
    "chargerUtilization": {
      "charger1": 75.5, // percentage
      "charger2": 60.2
    },
    "revenueByDay": [
      { "date": "2025-10-01", "revenue": 1500.00 },
      { "date": "2025-10-02", "revenue": 1800.00 }
    ],
    "peakHours": [14, 15, 16, 17],
    "visitorCount": 95
  }
}
```

#### Create Charger
**Request:**
```typescript
POST /api/v1/chargers
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "Mall Parking Charger",
  "type": "level2",
  "connectorType": "type2",
  "powerOutput": 11000,
  "chargingSpeed": "11 kW",
  "pricePerHour": 300.00,
  "isByoc": false,
  "location": {
    "lat": 6.9271,
    "lng": 79.8612
  },
  "address": "456 Liberty Plaza, Colombo",
  "description": "Fast charger at mall parking level 2"
}
```

**Response:**
```typescript
{
  "success": true,
  "data": {
    "charger": {
      "id": 15,
      "hostId": 5,
      "name": "Mall Parking Charger",
      "type": "level2",
      "connectorType": "type2",
      "powerOutput": 11000,
      "chargingSpeed": "11 kW",
      "pricePerHour": 300.00,
      "isByoc": false,
      "location": {
        "lat": 6.9271,
        "lng": 79.8612
      },
      "address": "456 Liberty Plaza, Colombo",
      "status": "available",
      "createdAt": "2025-10-20T11:00:00Z"
    }
  },
  "message": "Charger created successfully"
}
```

#### Create Review
**Request:**
```typescript
POST /api/v1/reviews
Authorization: Bearer <token>
Content-Type: application/json

{
  "chargerId": 1,
  "sessionId": 25,
  "rating": 5,
  "comment": "Great charger, fast and reliable. Coffee shop nearby is a plus!"
}
```

**Response:**
```typescript
{
  "success": true,
  "data": {
    "review": {
      "id": 50,
      "driverId": 1,
      "chargerId": 1,
      "sessionId": 25,
      "rating": 5,
      "comment": "Great charger, fast and reliable. Coffee shop nearby is a plus!",
      "createdAt": "2025-10-21T16:30:00Z"
    }
  }
}
```

#### Submit BYOC Initial Meter Reading
**Request:**
```typescript
POST /api/v1/sessions/25/meter-reading/start
Authorization: Bearer <token>
Content-Type: application/json

{
  "userRole": "driver",  // or "host"
  "meterReading": 1234.5
}
```

**Response:**
```typescript
{
  "success": true,
  "data": {
    "session": {
      "id": 25,
      "initialMeterReadingDriver": 1234.5,
      "initialMeterReadingHost": null,
      "initialReadingsVerified": false,
      "message": "Waiting for host to submit initial reading"
    }
  }
}
```

**After Both Submit (Verified):**
```typescript
{
  "success": true,
  "data": {
    "session": {
      "id": 25,
      "initialMeterReadingDriver": 1234.5,
      "initialMeterReadingHost": 1234.5,
      "initialReadingsVerified": true,
      "status": "in_progress",
      "message": "Initial readings verified. Charging session started."
    }
  }
}
```

#### Submit BYOC Final Meter Reading
**Request:**
```typescript
POST /api/v1/sessions/25/meter-reading/end
Authorization: Bearer <token>
Content-Type: application/json

{
  "userRole": "driver",
  "meterReading": 1250.3
}
```

**Response (After Both Submit & Verify):**
```typescript
{
  "success": true,
  "data": {
    "session": {
      "id": 25,
      "finalMeterReadingDriver": 1250.3,
      "finalMeterReadingHost": 1250.3,
      "finalReadingsVerified": true,
      "energyConsumedKwh": 15.8,  // 1250.3 - 1234.5
      "totalCost": 790.00,
      "status": "completed",
      "message": "Final readings verified. Session completed successfully."
    }
  }
}
```

---

## 5. Project File Structure

### 5.1 Backend Structure

```
zynk-backend/
├── package.json
├── tsconfig.json
├── .gitignore
├── docker-compose.yml              - Main Docker Compose configuration
├── docker-compose.dev.yml          - Development environment overrides
├── .dockerignore
│
├── api-gateway/
│   ├── package.json
│   ├── tsconfig.json
│   ├── Dockerfile                  - API Gateway container definition
│   ├── src/
│   │   ├── index.ts
│   │   ├── config/
│   │   │   ├── database.ts
│   │   │   └── gateway.config.ts
│   │   ├── middleware/
│   │   │   ├── auth.middleware.ts
│   │   │   ├── rateLimit.middleware.ts
│   │   │   └── errorHandler.middleware.ts
│   │   ├── routes/
│   │   │   ├── index.ts
│   │   │   └── internal.routes.ts    - HTTP callbacks from microservices
│   │   ├── websocket/
│   │   │   └── socketio.service.ts   - Socket.io server for mobile apps
│   │   └── utils/
│   │       ├── httpClient.ts
│   │       └── logger.ts
│   └── .env.example
│
├── services/
│   ├── user-service/
│   │   ├── package.json
│   │   ├── tsconfig.json
│   │   ├── Dockerfile              - User Service container definition
│   │   ├── src/
│   │   │   ├── index.ts
│   │   │   ├── routes/
│   │   │   │   ├── auth.routes.ts
│   │   │   │   ├── user.routes.ts
│   │   │   │   └── review.routes.ts
│   │   │   ├── controllers/
│   │   │   │   ├── auth.controller.ts
│   │   │   │   ├── user.controller.ts
│   │   │   │   └── review.controller.ts
│   │   │   ├── services/
│   │   │   │   ├── auth.service.ts
│   │   │   │   ├── user.service.ts
│   │   │   │   └── review.service.ts
│   │   │   ├── models/
│   │   │   │   └── types.ts
│   │   │   └── utils/
│   │   │       ├── jwt.util.ts
│   │   │       ├── validation.ts
│   │   │       └── bcrypt.util.ts
│   │   └── .env.example
│   │
│   ├── charger-service/
│   │   ├── package.json
│   │   ├── tsconfig.json
│   │   ├── Dockerfile              - Charger Service container definition
│   │   ├── src/
│   │   │   ├── index.ts
│   │   │   ├── routes/
│   │   │   │   ├── charger.routes.ts
│   │   │   │   ├── reservation.routes.ts
│   │   │   │   ├── session.routes.ts
│   │   │   │   ├── amenity.routes.ts
│   │   │   │   └── payment.routes.ts
│   │   │   ├── ocpp/
│   │   │   │   ├── ocpp.server.ts      - WebSocket server for OCPP chargers
│   │   │   │   └── ocpp.handler.ts     - OCPP message handlers
│   │   │   ├── controllers/
│   │   │   │   ├── charger.controller.ts
│   │   │   │   ├── reservation.controller.ts
│   │   │   │   ├── session.controller.ts
│   │   │   │   ├── amenity.controller.ts
│   │   │   │   └── payment.controller.ts
│   │   │   ├── services/
│   │   │   │   ├── charger.service.ts
│   │   │   │   ├── reservation.service.ts
│   │   │   │   ├── session.service.ts
│   │   │   │   ├── amenity.service.ts
│   │   │   │   ├── payment.service.ts
│   │   │   │   └── ocpp.service.ts
│   │   │   ├── models/
│   │   │   │   └── types.ts
│   │   │   └── utils/
│   │   │       ├── geospatial.util.ts
│   │   │       ├── payhere.util.ts
│   │   │       └── validation.ts
│   │   └── .env.example
│   │
│   └── analytics-service/
│       ├── package.json
│       ├── tsconfig.json
│       ├── Dockerfile              - Analytics Service container definition
│       ├── src/
│       │   ├── index.ts
│       │   ├── routes/
│       │   │   ├── driver.analytics.routes.ts
│       │   │   ├── host.analytics.routes.ts
│       │   │   └── platform.analytics.routes.ts
│       │   ├── controllers/
│       │   │   ├── driver.analytics.controller.ts
│       │   │   ├── host.analytics.controller.ts
│       │   │   └── platform.analytics.controller.ts
│       │   ├── services/
│       │   │   ├── driver.analytics.service.ts
│       │   │   ├── host.analytics.service.ts
│       │   │   └── platform.analytics.service.ts
│       │   ├── models/
│       │   │   └── types.ts
│       │   └── utils/
│       │       ├── aggregation.util.ts
│       │       └── export.util.ts
│       └── .env.example
│
├── shared/
│   ├── types/
│   │   ├── user.types.ts
│   │   ├── charger.types.ts
│   │   ├── reservation.types.ts
│   │   ├── session.types.ts
│   │   ├── payment.types.ts
│   │   └── analytics.types.ts
│   ├── constants/
│   │   └── index.ts
│   └── prisma/
│       ├── schema.prisma         - Prisma schema with all models
│       ├── migrations/           - Auto-generated migrations
│       └── seed.ts              - Database seeding script
│
└── README.md
```

### 5.2 Frontend Structure

#### Driver App
```
zynk-driver-app/
├── package.json
├── tsconfig.json
├── app.json
├── babel.config.js
├── tailwind.config.js          - NativeWind/Tailwind CSS configuration
├── .gitignore
│
├── src/
│   ├── App.tsx
│   ├── navigation/
│   │   ├── AppNavigator.tsx
│   │   └── AuthNavigator.tsx
│   │
│   ├── screens/
│   │   ├── auth/
│   │   │   ├── LoginScreen.tsx
│   │   │   ├── RegisterScreen.tsx
│   │   │   └── ForgotPasswordScreen.tsx
│   │   ├── map/
│   │   │   └── MapScreen.tsx
│   │   ├── charger/
│   │   │   └── ChargerDetailsScreen.tsx
│   │   ├── reservation/
│   │   │   └── ReservationScreen.tsx
│   │   ├── session/
│   │   │   ├── ActiveSessionScreen.tsx
│   │   │   └── SessionHistoryScreen.tsx
│   │   ├── payment/
│   │   │   └── PaymentScreen.tsx
│   │   └── profile/
│   │       └── ProfileScreen.tsx
│   │
│   ├── components/
│   │   ├── common/
│   │   │   ├── Button.tsx
│   │   │   ├── Input.tsx
│   │   │   ├── Card.tsx
│   │   │   ├── Loading.tsx
│   │   │   └── ErrorMessage.tsx
│   │   ├── map/
│   │   │   ├── MapView.tsx
│   │   │   ├── ChargerMarker.tsx
│   │   │   └── UserLocationMarker.tsx
│   │   ├── charger/
│   │   │   ├── ChargerCard.tsx
│   │   │   ├── ChargerList.tsx
│   │   │   ├── FilterPanel.tsx
│   │   │   └── AmenityList.tsx
│   │   ├── session/
│   │   │   ├── MeterReadingInput.tsx
│   │   │   ├── SessionTimer.tsx
│   │   │   └── OCPPMeterDisplay.tsx
│   │   ├── payment/
│   │   │   ├── PaymentBreakdown.tsx
│   │   │   └── PaymentStatus.tsx
│   │   └── review/
│   │       ├── ReviewForm.tsx
│   │       └── ReviewList.tsx
│   │
│   ├── services/
│   │   ├── api/
│   │   │   ├── api.client.ts
│   │   │   ├── auth.api.ts
│   │   │   ├── charger.api.ts
│   │   │   ├── reservation.api.ts
│   │   │   ├── session.api.ts
│   │   │   ├── payment.api.ts
│   │   │   └── review.api.ts
│   │   ├── websocket/
│   │   │   └── websocket.service.ts
│   │   └── location/
│   │       └── location.service.ts
│   │
│   ├── store/
│   │   ├── index.ts
│   │   ├── slices/
│   │   │   ├── auth.slice.ts
│   │   │   ├── charger.slice.ts
│   │   │   ├── reservation.slice.ts
│   │   │   ├── session.slice.ts
│   │   │   └── user.slice.ts
│   │   └── types/
│   │       └── store.types.ts
│   │
│   ├── hooks/
│   │   ├── useAuth.ts
│   │   ├── useLocation.ts
│   │   ├── useWebSocket.ts
│   │   └── usePayment.ts
│   │
│   ├── utils/
│   │   ├── storage.ts
│   │   ├── validation.ts
│   │   ├── formatting.ts
│   │   └── constants.ts
│   │
│   ├── types/
│   │   ├── navigation.types.ts
│   │   ├── user.types.ts
│   │   ├── charger.types.ts
│   │   └── api.types.ts
│   │
│   └── assets/
│       ├── images/
│       ├── icons/
│       └── fonts/
│
└── README.md
```

#### Host App
```
zynk-host-app/
├── package.json
├── tsconfig.json
├── app.json
├── babel.config.js
├── tailwind.config.js          - NativeWind/Tailwind CSS configuration
├── .gitignore
│
├── src/
│   ├── App.tsx
│   ├── navigation/
│   │   ├── AppNavigator.tsx
│   │   └── AuthNavigator.tsx
│   │
│   ├── screens/
│   │   ├── auth/
│   │   │   ├── LoginScreen.tsx
│   │   │   ├── RegisterScreen.tsx
│   │   │   └── ForgotPasswordScreen.tsx
│   │   ├── dashboard/
│   │   │   └── DashboardScreen.tsx
│   │   ├── charger/
│   │   │   ├── ChargerListScreen.tsx
│   │   │   ├── AddChargerScreen.tsx
│   │   │   └── EditChargerScreen.tsx
│   │   ├── amenity/
│   │   │   └── AmenityManagementScreen.tsx
│   │   ├── reservation/
│   │   │   └── ReservationManagementScreen.tsx
│   │   ├── session/
│   │   │   └── ActiveSessionsScreen.tsx
│   │   ├── analytics/
│   │   │   └── AnalyticsScreen.tsx
│   │   └── profile/
│   │       └── ProfileScreen.tsx
│   │
│   ├── components/
│   │   ├── common/
│   │   │   ├── Button.tsx
│   │   │   ├── Input.tsx
│   │   │   ├── Card.tsx
│   │   │   ├── Loading.tsx
│   │   │   └── ErrorMessage.tsx
│   │   ├── charger/
│   │   │   ├── ChargerCard.tsx
│   │   │   ├── ChargerList.tsx
│   │   │   └── ChargerForm.tsx
│   │   ├── session/
│   │   │   ├── MeterReadingInput.tsx
│   │   │   └── SessionList.tsx
│   │   ├── analytics/
│   │   │   ├── RevenueChart.tsx
│   │   │   ├── UsageChart.tsx
│   │   │   └── StatCard.tsx
│   │   └── reservation/
│   │       └── ReservationCard.tsx
│   │
│   ├── services/
│   │   ├── api/
│   │   │   ├── api.client.ts
│   │   │   ├── auth.api.ts
│   │   │   ├── charger.api.ts
│   │   │   ├── amenity.api.ts
│   │   │   ├── reservation.api.ts
│   │   │   ├── session.api.ts
│   │   │   └── analytics.api.ts
│   │   └── websocket/
│   │       └── websocket.service.ts
│   │
│   ├── store/
│   │   ├── index.ts
│   │   ├── slices/
│   │   │   ├── auth.slice.ts
│   │   │   ├── charger.slice.ts
│   │   │   ├── reservation.slice.ts
│   │   │   ├── session.slice.ts
│   │   │   ├── analytics.slice.ts
│   │   │   └── user.slice.ts
│   │   └── types/
│   │       └── store.types.ts
│   │
│   ├── hooks/
│   │   ├── useAuth.ts
│   │   └── useWebSocket.ts
│   │
│   ├── utils/
│   │   ├── storage.ts
│   │   ├── validation.ts
│   │   ├── formatting.ts
│   │   └── constants.ts
│   │
│   ├── types/
│   │   ├── navigation.types.ts
│   │   ├── user.types.ts
│   │   ├── charger.types.ts
│   │   └── api.types.ts
│   │
│   └── assets/
│       ├── images/
│       ├── icons/
│       └── fonts/
│
└── README.md
```

---

## 6. OCPP Integration

### 6.1 OCPP Architecture

```
┌──────────────────────────────────────────────────────────────┐
│                   OCPP Charge Points                          │
│  (Physical EV Chargers supporting OCPP 1.6J or 2.0.1)        │
└──────────────────────────────────────────────────────────────┘
                          │
                          │ WebSocket (OCPP JSON)
                          ▼
┌──────────────────────────────────────────────────────────────┐
│            OCPP Central System (Charger Service)             │
│                                                              │
│  ┌────────────────────────────────────────────────────┐      │
│  │              WebSocket Server (ws://)              │      │
│  └────────────────────────────────────────────────────┘      │
│                          │                                   │
│  ┌────────────────────────────────────────────────────┐      │
│  │             OCPP Message Handler                   │      │
│  │  • BootNotification                                │      │
│  │  • StatusNotification                              │      │
│  │  • Authorize                                       │      │
│  │  • StartTransaction                                │      │
│  │  • StopTransaction                                 │      │
│  │  • MeterValues                                     │      │
│  │  • Heartbeat                                       │      │
│  └────────────────────────────────────────────────────┘      │
│                          │                                   │
│                          ▼                                   │
│              Database & Business Logic                       │
└──────────────────────────────────────────────────────────────┘
```

### 6.2 Supported OCPP Messages

**Core Profile (OCPP 1.6J):**
- `BootNotification` - Charger registration
- `Authorize` - User/card authorization
- `StartTransaction` - Begin charging session
- `StopTransaction` - End charging session
- `MeterValues` - Energy consumption updates
- `StatusNotification` - Charger status changes
- `Heartbeat` - Connection health check

**Remote Control:**
- `RemoteStartTransaction` - Platform-initiated start
- `RemoteStopTransaction` - Platform-initiated stop

### 6.3 OCPP Message Examples

**BootNotification Request:**
```json
[
  2,
  "unique-message-id-1",
  "BootNotification",
  {
    "chargePointVendor": "VendorName",
    "chargePointModel": "Model-XYZ",
    "chargePointSerialNumber": "SN12345",
    "firmwareVersion": "1.2.3",
    "iccid": "",
    "imsi": "",
    "meterType": "EnergyMeter",
    "meterSerialNumber": "MTR-001"
  }
]
```

**BootNotification Response:**
```json
[
  3,
  "unique-message-id-1",
  {
    "status": "Accepted",
    "currentTime": "2025-10-20T10:30:00Z",
    "interval": 300
  }
]
```

**StartTransaction Request:**
```json
[
  2,
  "unique-message-id-2",
  "StartTransaction",
  {
    "connectorId": 1,
    "idTag": "DRIVER-ID-12345",
    "meterStart": 0,
    "timestamp": "2025-10-21T14:05:00Z",
    "reservationId": 10
  }
]
```

**StartTransaction Response:**
```json
[
  3,
  "unique-message-id-2",
  {
    "transactionId": 25,
    "idTagInfo": {
      "status": "Accepted"
    }
  }
]
```

**MeterValues Request:**
```json
[
  2,
  "unique-message-id-3",
  "MeterValues",
  {
    "connectorId": 1,
    "transactionId": 25,
    "meterValue": [
      {
        "timestamp": "2025-10-21T14:15:00Z",
        "sampledValue": [
          {
            "value": "2.5",
            "unit": "kWh",
            "measurand": "Energy.Active.Import.Register"
          },
          {
            "value": "7200",
            "unit": "W",
            "measurand": "Power.Active.Import"
          }
        ]
      }
    ]
  }
]
```

**StopTransaction Request:**
```json
[
  2,
  "unique-message-id-4",
  "StopTransaction",
  {
    "transactionId": 25,
    "idTag": "DRIVER-ID-12345",
    "timestamp": "2025-10-21T16:05:00Z",
    "meterStop": 15000,
    "reason": "Local"
  }
]
```

### 6.4 BYOC (Non-OCPP) Charger Handling

For BYOC chargers (standard outlets without OCPP), ZYNK uses a dual-verification kWh meter reading system:

#### Process Flow:
1. **Session Start:**
   - Driver arrives at BYOC charging location
   - Driver initiates session via app
   - Both driver and host read the **initial kWh meter reading**
   - Both parties input the reading into the app
   - System verifies that both readings match
   - If readings match, session is confirmed and starts

2. **During Charging:**
   - Timer-based duration tracking
   - Driver charges using their own cable

3. **Session End:**
   - Driver completes charging and stops session via app
   - Both driver and host read the **final kWh meter reading**
   - Both parties input the final reading into the app
   - System verifies that both readings match
   - If readings match, energy consumed is calculated: `final_reading - initial_reading`

4. **Fare Calculation:**
   - Energy consumed (kWh) = Final Reading - Initial Reading
   - Total cost = Energy consumed × Price per kWh (or Duration × Price per hour)
   - Platform fee and host amount split is calculated
   - Payment is initiated

#### Database Fields for BYOC Sessions:
```typescript
{
  initial_meter_reading_driver: number,  // Driver's initial reading
  initial_meter_reading_host: number,    // Host's initial reading
  final_meter_reading_driver: number,    // Driver's final reading
  final_meter_reading_host: number,      // Host's final reading
  readings_verified: boolean,            // Both readings match
  energy_consumed_kwh: number            // Calculated from verified readings
}
```

#### API Endpoints for BYOC Meter Readings:
```
POST   /api/v1/sessions/:id/meter-reading/start     - Submit initial meter reading
POST   /api/v1/sessions/:id/meter-reading/end       - Submit final meter reading
GET    /api/v1/sessions/:id/meter-reading/status    - Check verification status
```

#### Verification Logic:
```typescript
// Allow small tolerance for reading differences (e.g., 0.1 kWh)
const READING_TOLERANCE = 0.1;

function verifyReadings(driverReading: number, hostReading: number): boolean {
  return Math.abs(driverReading - hostReading) <= READING_TOLERANCE;
}
```

**Key Differences from OCPP:**
- Manual readings instead of automated meter values
- Dual verification system for trust and accuracy
- Simpler infrastructure requirements
- Host involvement in verification process
- No real-time energy updates during charging

---

## 7. Developer Responsibilities

### Developer 1: Authentication & User Management
**Service:** User Service

**Responsibilities:**
- User registration endpoint with email/password validation
- Login endpoint with JWT token generation
- Logout and token refresh functionality
- User profile CRUD operations (using Prisma)
- Password hashing with bcrypt
- JWT middleware for authentication
- Role-based access control (driver/host/admin)
- User data validation and sanitization

**Key Files:**
- `services/user-service/src/routes/auth.routes.ts`
- `services/user-service/src/routes/user.routes.ts`
- `services/user-service/src/controllers/auth.controller.ts`
- `services/user-service/src/controllers/user.controller.ts`
- `services/user-service/src/services/auth.service.ts` (uses Prisma Client)
- `services/user-service/src/services/user.service.ts` (uses Prisma Client)
- `services/user-service/src/utils/jwt.util.ts`
- `services/user-service/src/utils/bcrypt.util.ts`

---

### Developer 2: Charger Management & Geospatial Search
**Service:** Charger Service

**Responsibilities:**
- Charger CRUD endpoints (using Prisma)
- Geospatial search using PostGIS (via Prisma raw queries)
- Charger filtering by type, power, price
- Charger status management (available/occupied/offline)
- Amenity management for hosts (using Prisma)
- HTTP callbacks to API Gateway for real-time updates
- BYOC charger support

**Key Files:**
- `services/charger-service/src/routes/charger.routes.ts`
- `services/charger-service/src/routes/amenity.routes.ts`
- `services/charger-service/src/controllers/charger.controller.ts`
- `services/charger-service/src/controllers/amenity.controller.ts`
- `services/charger-service/src/services/charger.service.ts` (uses Prisma Client)
- `services/charger-service/src/services/amenity.service.ts` (uses Prisma Client)
- `services/charger-service/src/utils/geospatial.util.ts` (Prisma raw queries for PostGIS)

---

### Developer 3: Reservations, Sessions & Reviews
**Service:** Charger Service + User Service

**Responsibilities:**
- Reservation creation with time slot validation (using Prisma)
- Reservation cancellation and updates
- Charger availability checking
- Charging session start/stop endpoints (using Prisma)
- Session duration and energy tracking
- BYOC meter reading submission endpoints (initial and final)
- Dual verification system for BYOC meter readings (driver + host)
- Energy consumption calculation from verified meter readings
- Review creation and management (using Prisma)
- Rating system for chargers
- Session history retrieval

**Key Files:**
- `services/charger-service/src/routes/reservation.routes.ts`
- `services/charger-service/src/routes/session.routes.ts`
- `services/charger-service/src/controllers/reservation.controller.ts`
- `services/charger-service/src/controllers/session.controller.ts`
- `services/charger-service/src/services/reservation.service.ts` (uses Prisma Client)
- `services/charger-service/src/services/session.service.ts` (uses Prisma Client)
- `services/user-service/src/routes/review.routes.ts`
- `services/user-service/src/controllers/review.controller.ts`
- `services/user-service/src/services/review.service.ts` (uses Prisma Client)

---

### Developer 4: Payments & OCPP Integration
**Service:** Charger Service

**Responsibilities:**
- PayHere payment gateway integration
- Payment initiation and callback handling (using Prisma)
- Revenue split calculation (platform fee + host amount)
- Payment status tracking
- OCPP WebSocket server setup
- OCPP message handling (BootNotification, Authorize, StartTransaction, StopTransaction, MeterValues, StatusNotification)
- Remote start/stop transaction commands
- OCPP charger registration and management (using Prisma)

**Key Files:**
- `services/charger-service/src/routes/payment.routes.ts`
- `services/charger-service/src/controllers/payment.controller.ts`
- `services/charger-service/src/services/payment.service.ts` (uses Prisma Client)
- `services/charger-service/src/utils/payhere.util.ts`
- `services/charger-service/src/ocpp/ocpp.server.ts` (WebSocket server)
- `services/charger-service/src/ocpp/ocpp.handler.ts` (message handlers)
- `services/charger-service/src/services/ocpp.service.ts` (uses Prisma Client)

---

### Developer 5: Analytics & API Gateway
**Service:** Analytics Service + API Gateway

**Responsibilities:**
- Driver analytics endpoints (usage summary, session history, spending - using Prisma)
- Host analytics endpoints (revenue, charger utilization, visitor stats - using Prisma)
- Platform analytics (overview, demand hotspots, platform revenue - using Prisma)
- Analytics data aggregation and calculations
- Export functionality for analytics data
- API Gateway routing to all microservices
- Rate limiting and request throttling
- Socket.io server for real-time updates to mobile apps
- Error handling middleware

**Key Files:**
- `api-gateway/src/index.ts`
- `api-gateway/src/routes/index.ts`
- `api-gateway/src/routes/internal.routes.ts` (HTTP callbacks from services)
- `api-gateway/src/middleware/auth.middleware.ts`
- `api-gateway/src/middleware/rateLimit.middleware.ts`
- `api-gateway/src/websocket/socketio.service.ts` (Socket.io for mobile apps)
- `services/analytics-service/src/routes/driver.analytics.routes.ts`
- `services/analytics-service/src/routes/host.analytics.routes.ts`
- `services/analytics-service/src/routes/platform.analytics.routes.ts`
- `services/analytics-service/src/controllers/driver.analytics.controller.ts`
- `services/analytics-service/src/controllers/host.analytics.controller.ts`
- `services/analytics-service/src/controllers/platform.analytics.controller.ts`
- `services/analytics-service/src/services/driver.analytics.service.ts` (uses Prisma Client)
- `services/analytics-service/src/services/host.analytics.service.ts` (uses Prisma Client)
- `services/analytics-service/src/services/platform.analytics.service.ts` (uses Prisma Client)

---

## 8. Technology Stack Summary

### Backend
- **Runtime:** Node.js 18+
- **Language:** TypeScript 5.0+
- **Framework:** Express.js 4.x
- **Database:** PostgreSQL 15+ with PostGIS extension (Neon serverless)
- **ORM:** Prisma 5.x
- **Database Client:** @prisma/client (auto-generated types)
- **Real-Time:** Socket.io 4.x (mobile app connections)
- **Authentication:** JWT (jsonwebtoken)
- **Password Hashing:** bcrypt
- **Validation:** express-validator
- **OCPP:** WebSocket server (ws library) for OCPP 1.6J protocol
- **Containerization:** Docker & Docker Compose

### Frontend
- **Framework:** React Native with Expo
- **Language:** TypeScript 5.0+
- **Styling:** NativeWind (Tailwind CSS for React Native)
- **State Management:** Redux Toolkit
- **Navigation:** React Navigation 6.x
- **Maps:** Leaflet.js (via react-native-webview)
- **HTTP Client:** Axios
- **Payment:** react-native-payhere-sdk

### External Services
- **Payment Gateway:** PayHere (Sri Lanka)
- **Map Tiles:** OpenStreetMap
- **Push Notifications:** Expo Notifications

---

## 9. Database Connection & Shared Resources

### 9.1 Neon Serverless PostgreSQL

All microservices use **Neon** as the serverless PostgreSQL database with **Prisma** as the ORM.

**Neon Project Structure:**
```
Neon Project: zynk-production
├── Main Branch (production)
├── Dev Branch (shared development)
├── Feature Branches (per developer - optional)
└── Test Branch (CI/CD testing)
```

### 9.2 Prisma ORM Setup

All microservices use **Prisma** for type-safe database access with auto-generated TypeScript types.

**Prisma Schema Location:**
```
shared/prisma/
├── schema.prisma          - Main schema with all models
├── migrations/            - Auto-generated migration files
└── seed.ts               - Database seeding script
```

**Prisma Configuration for Neon:**
```prisma
// schema.prisma
datasource db {
  provider  = "postgresql"
  url       = env("DATABASE_URL")       // Pooled connection for queries
  directUrl = env("DIRECT_URL")         // Direct connection for migrations
}

generator client {
  provider        = "prisma-client-js"
  previewFeatures = ["postgresqlExtensions"]
}
```

**Environment Variables:**
```env
# Neon Connection Strings

# Pooled connection (for application queries)
DATABASE_URL="postgresql://user:pass@ep-xxx.us-east-2.aws.neon.tech/neondb?sslmode=require&pgbouncer=true&connection_limit=10"

# Direct connection (for Prisma migrations)
DIRECT_URL="postgresql://user:pass@ep-xxx.us-east-2.aws.neon.tech/neondb?sslmode=require"
```

**Prisma Client per Service:**
Each microservice instantiates its own PrismaClient in its service files:
```typescript
// services/user-service/src/services/auth.service.ts
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

// services/charger-service/src/services/charger.service.ts
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

// Each service has independent database connection pool
```

**Connection Pooling:**
Neon's PgBouncer handles pooling. Each service maintains 10-20 connections. Total: ~60 connections across 4 services.

**Benefits:**
- **Type Safety:** Auto-generated TypeScript types for all models
- **Migration Management:** `npx prisma migrate dev` handles schema changes
- **Developer Experience:** IntelliSense autocomplete for queries
- **Prisma Studio:** Built-in GUI at `npx prisma studio`
- **No Manual SQL:** Query builder with full type safety
- **Neon Optimization:** Prisma optimized for serverless databases

**Example Usage:**
```typescript
// Type-safe query with autocomplete
const user = await prisma.user.findUnique({
  where: { email },
  include: { chargers: true }
});

// Geospatial queries use Prisma's raw SQL with Neon
const chargers = await prisma.$queryRaw`
  SELECT *, ST_Distance(location, ST_MakePoint(${lng}, ${lat})::geography) as distance
  FROM chargers
  WHERE ST_DWithin(location, ST_MakePoint(${lng}, ${lat})::geography, ${radius})
  ORDER BY distance
`;
```

### 9.3 Neon Database Branching (Development Workflow)

**Branch Strategy:**
```
main (production)           - Production database
  ├── dev (shared)          - Shared development database (all 5 devs)
  ├── staging               - Pre-production testing
  └── feature-* (optional)  - Individual developer branches
```

**Development Workflow:**
```bash
# Option 1: All developers share 'dev' branch (Recommended for tight deadline)
DATABASE_URL="postgresql://...neon.tech/neondb?branch=dev"

# Option 2: Each developer has own branch (for isolated testing)
neon branches create dev-developer1
neon branches create dev-developer2
# ... etc
```

**Migration Workflow with Neon:**
```bash
# Developer creates migration
npx prisma migrate dev --name add_meter_readings

# Migration runs on Neon dev branch
# Other developers pull and apply
git pull
npx prisma migrate deploy
```

### 9.4 PostGIS Extension Setup

PostGIS is enabled in Neon for geospatial queries:

```sql
-- Run once in Neon SQL Editor
CREATE EXTENSION IF NOT EXISTS postgis;

-- Verify installation
SELECT PostGIS_version();
```

Prisma schema handles PostGIS types via `Unsupported` type or raw SQL queries for geospatial operations.

### 9.5 Docker Compose Setup

The backend microservices are containerized using **Docker Compose**. The database (Neon) is hosted externally as a serverless service.

**Container Architecture:**
```
┌─────────────────────────────────────────────────────────────┐
│                    Docker Compose Stack                      │
├─────────────────────────────────────────────────────────────┤
│  • api-gateway         - API Gateway (Port 3000)            │
│  • user-service        - User Service (Port 3001)           │
│  • charger-service     - Charger Service (Port 3002)        │
│  • analytics-service   - Analytics Service (Port 3003)      │
└─────────────────────────────────────────────────────────────┘
                            │
                            │ Connects to
                            ▼
                  ┌──────────────────────┐
                  │   Neon PostgreSQL    │
                  │   (Cloud Hosted)     │
                  │   • PostGIS enabled  │
                  │   • Auto-scaling     │
                  │   • Connection pool  │
                  └──────────────────────┘
```

**Docker Compose File Location:**
```
zynk-backend/
├── docker-compose.yml           - Main compose configuration
├── docker-compose.dev.yml       - Development overrides
├── .env                         - Neon connection strings
├── .dockerignore
└── services/
    ├── api-gateway/Dockerfile
    ├── user-service/Dockerfile
    ├── charger-service/Dockerfile
    └── analytics-service/Dockerfile
```

**Key Features:**
- **Service Isolation:** Each microservice runs in its own container
- **External Database:** Neon PostgreSQL hosted in cloud (no local DB container)
- **Network Configuration:** Internal Docker network for service-to-service communication
- **Environment Variables:** Neon connection strings in .env file
- **Hot Reload:** Volume mounting for development with live code changes
- **Health Checks:** Container health monitoring for auto-restart
- **One-Command Setup:** `docker-compose up` starts all services

**Environment Configuration:**
```env
# .env file (shared by all containers)

# Neon Database (Development)
DATABASE_URL="postgresql://user:pass@ep-xxx.neon.tech/neondb?sslmode=require&pgbouncer=true&connection_limit=10"
DIRECT_URL="postgresql://user:pass@ep-xxx.neon.tech/neondb?sslmode=require"

# Service Ports
API_GATEWAY_PORT=3000
USER_SERVICE_PORT=3001
CHARGER_SERVICE_PORT=3002
ANALYTICS_SERVICE_PORT=3003

# JWT Secret
JWT_SECRET=your-secret-key

# PayHere API
PAYHERE_MERCHANT_ID=your-merchant-id
PAYHERE_MERCHANT_SECRET=your-secret
```

**Development Workflow:**
```bash
# Start all services (connects to Neon)
docker-compose up

# Start specific service
docker-compose up user-service

# Run Prisma migrations on Neon
docker-compose exec user-service npx prisma migrate dev

# View logs
docker-compose logs -f charger-service

# Access Prisma Studio
docker-compose exec user-service npx prisma studio

# Stop all services (Neon DB stays running)
docker-compose down
```

---

## 10. Key Implementation Notes

### 10.1 Mobile App Styling
Both Driver App and Host App use **NativeWind** (Tailwind CSS for React Native) for styling. Tailwind configuration file included in each app.

**Theme:**
- Background: `#000000` (Black)
- Text: `#FFFFFF` (White)
- Card Background: `#242424` (Dark Gray)
- Accent Color: `#00BC74` (Green)
- Font: Inter (use throughout entire project)

### 10.2 Real-Time Communication
Mobile apps connect to API Gateway via Socket.io. Microservices notify API Gateway via HTTP POST to `/internal/notify` endpoint. API Gateway broadcasts events to mobile apps via Socket.io.

**Example:** Charger Service → HTTP POST to Gateway → Gateway emits Socket.io event → Mobile apps receive update.

**Future:** Migrate to Kafka/Redis Pub/Sub when scaling.

### 10.3 Geospatial Queries with Prisma & Neon
Prisma supports PostGIS through raw SQL queries for geospatial operations on Neon:

```typescript
// Using Prisma's raw query for geospatial search on Neon
const chargers = await prisma.$queryRaw`
  SELECT *, ST_Distance(location, ST_MakePoint(${lng}, ${lat})::geography) as distance
  FROM chargers
  WHERE ST_DWithin(location, ST_MakePoint(${lng}, ${lat})::geography, ${radiusInMeters})
    AND status = 'available'
  ORDER BY distance
`;

// Or using Prisma's type-safe query builder for non-spatial queries
const availableChargers = await prisma.charger.findMany({
  where: {
    status: 'available',
    type: 'level2'
  },
  include: {
    host: true,
    amenities: true
  }
});
```

### 10.6 API Gateway Routing
```typescript
// HTTP endpoints routed to services
app.use('/api/v1/auth', proxyTo('http://localhost:3001'));
app.use('/api/v1/users', proxyTo('http://localhost:3001'));
app.use('/api/v1/reviews', proxyTo('http://localhost:3001'));
app.use('/api/v1/chargers', proxyTo('http://localhost:3002'));
app.use('/api/v1/reservations', proxyTo('http://localhost:3002'));
app.use('/api/v1/sessions', proxyTo('http://localhost:3002'));
app.use('/api/v1/amenities', proxyTo('http://localhost:3002'));
app.use('/api/v1/payments', proxyTo('http://localhost:3002'));
app.use('/api/v1/analytics', proxyTo('http://localhost:3003'));

// OCPP chargers connect directly to Charger Service WebSocket (ws://localhost:3002/ocpp)
```

---

## 11. Service Communication Pattern

### HTTP Callback for Real-Time Events
```typescript
// Microservice (e.g., Charger Service) notifies Gateway
await axios.post('http://api-gateway:3000/internal/notify', {
  event: 'session-started',
  data: { sessionId, driverId, chargerId }
});

// API Gateway receives and broadcasts via Socket.io
app.post('/internal/notify', (req, res) => {
  io.emit(req.body.event, req.body.data);
  res.sendStatus(200);
});

// Mobile apps receive real-time update
socket.on('session-started', (data) => {
  // Update UI
});
```

**Future Migration:** Replace HTTP with Kafka/Redis Pub/Sub when scaling.

---

**Project Deadline:** November 5, 2025

**Last Updated:** October 21, 2025
