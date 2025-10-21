# ZYNK Platform - Developer Assignments

**Project Deadline:** November 5, 2025  
**Team Size:** 5 Developers  
**Architecture:** Microservices (Backend) + 2 Separate React Native Apps (Driver App + Host App)

---

## Developer 1: Authentication & User Management

### Backend Responsibilities

#### User Service (Port 3001)

**Authentication System:**
- User registration endpoint with email/password validation
- Login endpoint with JWT token generation (returns role: driver or host)
- Logout functionality
- Token refresh mechanism
- Password hashing using bcrypt
- JWT token creation and verification utilities

**User Profile Management:**
- Get current user profile endpoint
- Update user profile endpoint
- Get user by ID (admin only)
- Delete user (admin only)
- Profile image upload handling

**Authorization & Security:**
- JWT middleware for request authentication
- Role-based access control (driver/host/admin)
- Request validation and sanitization
- Password strength validation

**Backend Files:**
- `services/user-service/src/routes/auth.routes.ts`
- `services/user-service/src/routes/user.routes.ts`
- `services/user-service/src/controllers/auth.controller.ts`
- `services/user-service/src/controllers/user.controller.ts`
- `services/user-service/src/services/auth.service.ts`
- `services/user-service/src/services/user.service.ts`
- `services/user-service/src/utils/jwt.util.ts`
- `services/user-service/src/utils/bcrypt.util.ts`
- `services/user-service/src/utils/validation.ts`

### Frontend Responsibilities

#### Driver App - Authentication

**Authentication Screens:**
- Login screen with email/password input
- Registration screen for drivers only
- Forgot password screen
- Form validation for authentication

**User Profile:**
- Profile screen showing driver details
- Edit profile functionality
- Profile image upload
- Account settings

**State Management:**
- Redux slice for authentication state
- Redux slice for user profile state
- JWT token storage in AsyncStorage
- Auto-login on app launch

**Driver App Files:**
- `zynk-driver-app/src/screens/auth/LoginScreen.tsx`
- `zynk-driver-app/src/screens/auth/RegisterScreen.tsx`
- `zynk-driver-app/src/screens/auth/ForgotPasswordScreen.tsx`
- `zynk-driver-app/src/screens/profile/ProfileScreen.tsx`
- `zynk-driver-app/src/services/api/auth.api.ts`
- `zynk-driver-app/src/store/slices/auth.slice.ts`
- `zynk-driver-app/src/store/slices/user.slice.ts`
- `zynk-driver-app/src/hooks/useAuth.ts`
- `zynk-driver-app/src/navigation/AuthNavigator.tsx`

#### Host App - Authentication

**Authentication Screens:**
- Login screen with email/password input
- Registration screen for hosts only
- Forgot password screen
- Form validation for authentication

**User Profile:**
- Profile screen showing host/business details
- Edit profile functionality
- Profile image upload
- Business information management

**State Management:**
- Redux slice for authentication state
- Redux slice for user profile state
- JWT token storage in AsyncStorage
- Auto-login on app launch

**Host App Files:**
- `zynk-host-app/src/screens/auth/LoginScreen.tsx`
- `zynk-host-app/src/screens/auth/RegisterScreen.tsx`
- `zynk-host-app/src/screens/auth/ForgotPasswordScreen.tsx`
- `zynk-host-app/src/screens/profile/ProfileScreen.tsx`
- `zynk-host-app/src/services/api/auth.api.ts`
- `zynk-host-app/src/store/slices/auth.slice.ts`
- `zynk-host-app/src/store/slices/user.slice.ts`
- `zynk-host-app/src/hooks/useAuth.ts`
- `zynk-host-app/src/navigation/AuthNavigator.tsx`

---

## Developer 2: Charger Management & Geospatial Features

### Backend Responsibilities

#### Charger Service (Port 3002)

**Charger CRUD Operations:**
- Create new charger endpoint (host only)
- Get all chargers with filtering
- Get charger by ID with full details
- Update charger information (host only)
- Delete charger (host only)
- Get chargers by host ID
- Update charger status (available/occupied/offline/maintenance)

**Geospatial Search:**
- Search chargers by location (lat/lng) and radius using PostGIS
- Filter chargers by type (level1/level2/dc_fast)
- Filter by power output and price range
- Calculate distance from user location
- Sort results by distance

**Amenity Management:**
- Create amenity for host location
- Get amenities by host ID
- Update amenity details
- Delete amenity
- Link amenities to chargers in search results

**Real-Time Updates:**
- Send HTTP callbacks to API Gateway when charger status changes
- API Gateway broadcasts to mobile apps via Socket.io

**Backend Files:**
- `services/charger-service/src/routes/charger.routes.ts`
- `services/charger-service/src/routes/amenity.routes.ts`
- `services/charger-service/src/controllers/charger.controller.ts`
- `services/charger-service/src/controllers/amenity.controller.ts`
- `services/charger-service/src/services/charger.service.ts`
- `services/charger-service/src/services/amenity.service.ts`
- `services/charger-service/src/utils/geospatial.util.ts`
- `services/charger-service/src/utils/validation.ts`

### Frontend Responsibilities

#### Driver App - Charger Discovery

**Map & Search Interface:**
- Interactive map screen with Leaflet.js integration
- Display charger markers on map with status indicators
- User location tracking and display
- Real-time charger availability updates

**Charger Search & Discovery:**
- Search by current location or address
- Filter panel for charger type, power, price
- Charger list view with sort options
- Distance calculation and display

**Charger Details:**
- Charger details screen with specifications
- Display amenities at location
- Show host information and ratings
- Availability status display
- Make reservation button

**Driver App Files:**
- `zynk-driver-app/src/screens/map/MapScreen.tsx`
- `zynk-driver-app/src/screens/charger/ChargerDetailsScreen.tsx`
- `zynk-driver-app/src/components/map/MapView.tsx`
- `zynk-driver-app/src/components/map/ChargerMarker.tsx`
- `zynk-driver-app/src/components/map/UserLocationMarker.tsx`
- `zynk-driver-app/src/components/charger/ChargerCard.tsx`
- `zynk-driver-app/src/components/charger/ChargerList.tsx`
- `zynk-driver-app/src/components/charger/FilterPanel.tsx`
- `zynk-driver-app/src/components/charger/AmenityList.tsx`
- `zynk-driver-app/src/services/api/charger.api.ts`
- `zynk-driver-app/src/services/location/location.service.ts`
- `zynk-driver-app/src/store/slices/charger.slice.ts`
- `zynk-driver-app/src/hooks/useLocation.ts`

#### Host App - Charger Management

**Charger Management:**
- Charger list for host dashboard
- Add new charger screen with location picker
- Edit charger details
- Delete charger with confirmation
- Charger status toggle (available/offline/maintenance)

**Amenity Management:**
- Amenity management interface
- Add/edit/delete amenities
- Promote amenities to attract drivers

**Host App Files:**
- `zynk-host-app/src/screens/charger/ChargerListScreen.tsx`
- `zynk-host-app/src/screens/charger/AddChargerScreen.tsx`
- `zynk-host-app/src/screens/charger/EditChargerScreen.tsx`
- `zynk-host-app/src/screens/amenity/AmenityManagementScreen.tsx`
- `zynk-host-app/src/components/charger/ChargerCard.tsx`
- `zynk-host-app/src/components/charger/ChargerList.tsx`
- `zynk-host-app/src/components/charger/ChargerForm.tsx`
- `zynk-host-app/src/services/api/charger.api.ts`
- `zynk-host-app/src/services/api/amenity.api.ts`
- `zynk-host-app/src/store/slices/charger.slice.ts`

---

## Developer 3: Reservations, Sessions & Reviews

### Backend Responsibilities

#### Charger Service - Reservations (Port 3002)

**Reservation Management:**
- Create reservation with time slot validation
- Get all reservations filtered by user role
- Get reservation details by ID
- Update reservation times
- Cancel reservation
- Check charger availability for time slot
- Prevent double-booking

**Charging Session Management:**
- Start charging session from reservation
- Stop charging session
- Get session details
- Get driver's session history
- Get charger's session history
- Update energy consumed (for OCPP)
- Calculate session duration

**BYOC Meter Reading System:**
- Submit initial meter reading endpoint (driver or host)
- Submit final meter reading endpoint (driver or host)
- Verify readings match between driver and host
- Calculate energy consumption from verified readings
- Get meter reading verification status
- Handle reading mismatch scenarios

#### User Service - Reviews (Port 3001)

**Review System:**
- Create review for charger after session
- Get reviews for specific charger
- Get reviews by driver
- Update review (only by author)
- Delete review (author or admin)
- Calculate average ratings

**Backend Files:**
- `services/charger-service/src/routes/reservation.routes.ts`
- `services/charger-service/src/routes/session.routes.ts`
- `services/charger-service/src/controllers/reservation.controller.ts`
- `services/charger-service/src/controllers/session.controller.ts`
- `services/charger-service/src/services/reservation.service.ts`
- `services/charger-service/src/services/session.service.ts`
- `services/user-service/src/routes/review.routes.ts`
- `services/user-service/src/controllers/review.controller.ts`
- `services/user-service/src/services/review.service.ts`

### Frontend Responsibilities

#### Driver App - Reservations & Sessions

**Reservation Interface:**
- Reservation screen with date/time picker
- Time slot selection
- Reservation confirmation
- View active reservations
- Cancel reservation functionality

**Active Session Management:**
- Active session screen showing real-time status
- Start session button (from reservation)
- Stop session button
- Session timer display
- Energy consumption display (for OCPP)

**BYOC Meter Reading Interface:**
- Initial meter reading input screen
- Final meter reading input screen
- Waiting state for host's reading
- Verification status display
- Mismatch handling UI

**Session History:**
- Session history list screen
- Session details view
- Filter by date range
- Display energy consumed and cost

**Review System:**
- Review submission form after session
- Rating stars (1-5)
- Comment text input
- View reviews for charger
- Edit/delete own reviews

**Driver App Files:**
- `zynk-driver-app/src/screens/reservation/ReservationScreen.tsx`
- `zynk-driver-app/src/screens/session/ActiveSessionScreen.tsx`
- `zynk-driver-app/src/screens/session/SessionHistoryScreen.tsx`
- `zynk-driver-app/src/components/session/MeterReadingInput.tsx`
- `zynk-driver-app/src/components/session/SessionTimer.tsx`
- `zynk-driver-app/src/components/review/ReviewForm.tsx`
- `zynk-driver-app/src/components/review/ReviewList.tsx`
- `zynk-driver-app/src/services/api/reservation.api.ts`
- `zynk-driver-app/src/services/api/session.api.ts`
- `zynk-driver-app/src/services/api/review.api.ts`
- `zynk-driver-app/src/store/slices/reservation.slice.ts`
- `zynk-driver-app/src/store/slices/session.slice.ts`

#### Host App - Session Management

**Reservation Management:**
- View all reservations for host's chargers
- Reservation list with filters
- Reservation details view
- Upcoming reservations display

**Active Sessions Monitoring:**
- Active sessions screen for all host chargers
- Real-time session status updates
- Monitor multiple chargers simultaneously

**BYOC Meter Reading Interface:**
- Initial meter reading input screen
- Final meter reading input screen
- Waiting state for driver's reading
- Verification status display

**Host App Files:**
- `zynk-host-app/src/screens/reservation/ReservationManagementScreen.tsx`
- `zynk-host-app/src/screens/session/ActiveSessionsScreen.tsx`
- `zynk-host-app/src/components/session/MeterReadingInput.tsx`
- `zynk-host-app/src/components/session/SessionList.tsx`
- `zynk-host-app/src/components/reservation/ReservationCard.tsx`
- `zynk-host-app/src/services/api/reservation.api.ts`
- `zynk-host-app/src/services/api/session.api.ts`
- `zynk-host-app/src/store/slices/reservation.slice.ts`
- `zynk-host-app/src/store/slices/session.slice.ts`

---

## Developer 4: Payments & OCPP Integration

### Backend Responsibilities

#### Charger Service - Payments (Port 3002)

**PayHere Integration:**
- Initiate payment endpoint
- PayHere callback handler
- Get payment details by ID
- Get payments for specific session
- Payment verification
- Handle payment failures and retries

**Revenue Management:**
- Calculate platform fee (15% of total)
- Calculate host amount (85% of total)
- Store payment records with split details
- Generate payment receipts
- Handle refunds

**Transaction Processing:**
- Link payments to sessions
- Update session status on payment completion
- Trigger notifications on payment events

#### Charger Service - OCPP Integration (Port 3002)

**OCPP WebSocket Server:**
- WebSocket server setup for OCPP communication
- Handle incoming OCPP connections from chargers
- Maintain active charger connections map

**OCPP Message Handling:**
- BootNotification - Register/update charger
- Authorize - Verify driver authorization
- StartTransaction - Create session and return transaction ID
- StopTransaction - Complete session with final energy
- MeterValues - Update energy consumption in real-time
- StatusNotification - Update charger status
- Heartbeat - Maintain connection health

**Remote Commands:**
- RemoteStartTransaction - Initiate charging remotely
- RemoteStopTransaction - Stop charging remotely
- Send commands to specific charge points

**OCPP Data Management:**
- Store OCPP transaction IDs
- Link OCPP transactions to platform sessions
- Update session energy from meter values
- Sync charger status with database

**Backend Files:**
- `services/charger-service/src/routes/payment.routes.ts`
- `services/charger-service/src/controllers/payment.controller.ts`
- `services/charger-service/src/services/payment.service.ts`
- `services/charger-service/src/utils/payhere.util.ts`
- `services/charger-service/src/ocpp/ocpp.server.ts` (WebSocket server)
- `services/charger-service/src/ocpp/ocpp.handler.ts` (OCPP message handlers)
- `services/charger-service/src/services/ocpp.service.ts`

### Frontend Responsibilities

#### Driver App - Payments

**Payment Interface:**
- Payment screen with amount breakdown
- PayHere SDK integration
- Platform fee display
- Host amount display
- Payment method selection

**Payment Processing:**
- Initiate payment flow
- Handle PayHere redirects
- Display payment status (pending/completed/failed)
- Payment confirmation screen
- Payment receipt display

**Payment History:**
- List of all payments
- Filter by status
- Payment details view
- Download receipt functionality

**OCPP Session Monitoring:**
- Real-time energy consumption display (for OCPP chargers)
- Live charging status updates
- Current power output display
- Estimated time remaining

**Driver App Files:**
- `zynk-driver-app/src/screens/payment/PaymentScreen.tsx`
- `zynk-driver-app/src/components/payment/PaymentBreakdown.tsx`
- `zynk-driver-app/src/components/payment/PaymentStatus.tsx`
- `zynk-driver-app/src/components/session/OCPPMeterDisplay.tsx`
- `zynk-driver-app/src/services/api/payment.api.ts`
- `zynk-driver-app/src/hooks/usePayment.ts`

#### Host App - Payment Tracking

**Payment Overview:**
- View incoming payments
- Payment history for all chargers
- Revenue tracking
- Filter by date and status

**Host App Files:**
- `zynk-host-app/src/components/payment/PaymentList.tsx`
- (Payment tracking integrated into Analytics - see Developer 5)

---

## Developer 5: Analytics & API Gateway

### Backend Responsibilities

#### Analytics Service (Port 3003)

**Driver Analytics:**
- Driver usage summary endpoint (total sessions, energy, spending)
- Session history with filters
- Spending analytics by date range
- Favorite chargers analysis
- Charging patterns and trends

**Host Analytics:**
- Host dashboard data aggregation
- Revenue analytics by period
- Charger utilization percentages
- Visitor statistics
- Peak hours analysis
- Revenue trends over time

**Platform Analytics:**
- Platform overview (total users, chargers, sessions, revenue)
- Demand hotspots using geospatial data
- Platform revenue aggregation
- Growth metrics
- Export analytics data to CSV/JSON

**Data Aggregation:**
- Complex SQL queries for analytics
- Time-based aggregations
- Revenue calculations
- Utilization rate calculations

#### API Gateway (Port 3000)

**Request Routing:**
- Route requests to appropriate microservices
- User Service routes (/api/v1/auth, /api/v1/users, /api/v1/reviews)
- Charger Service routes (/api/v1/chargers, /api/v1/reservations, /api/v1/sessions, /api/v1/amenities, /api/v1/payments, /api/v1/ocpp)
- Analytics Service routes (/api/v1/analytics)

**Middleware Implementation:**
- JWT authentication middleware
- Rate limiting and request throttling
- Error handling middleware
- Request logging
- CORS configuration

**Real-Time Communication:**
- Socket.io server for mobile app connections
- Manage connections from both Driver and Host apps
- HTTP callback endpoint (`/internal/notify`) to receive events from microservices
- Broadcast events to mobile apps via Socket.io
- Handle charger availability, reservation, session, and payment notifications

**Backend Files:**
- `api-gateway/src/index.ts`
- `api-gateway/src/routes/index.ts`
- `api-gateway/src/routes/internal.routes.ts` (HTTP callbacks from services)
- `api-gateway/src/middleware/auth.middleware.ts`
- `api-gateway/src/middleware/rateLimit.middleware.ts`
- `api-gateway/src/middleware/errorHandler.middleware.ts`
- `api-gateway/src/websocket/socketio.service.ts` (Socket.io server)
- `api-gateway/src/utils/httpClient.ts`
- `api-gateway/src/utils/logger.ts`
- `services/analytics-service/src/routes/driver.analytics.routes.ts`
- `services/analytics-service/src/routes/host.analytics.routes.ts`
- `services/analytics-service/src/routes/platform.analytics.routes.ts`
- `services/analytics-service/src/controllers/driver.analytics.controller.ts`
- `services/analytics-service/src/controllers/host.analytics.controller.ts`
- `services/analytics-service/src/controllers/platform.analytics.controller.ts`
- `services/analytics-service/src/services/driver.analytics.service.ts`
- `services/analytics-service/src/services/host.analytics.service.ts`
- `services/analytics-service/src/services/platform.analytics.service.ts`
- `services/analytics-service/src/utils/aggregation.util.ts`
- `services/analytics-service/src/utils/export.util.ts`

### Frontend Responsibilities

#### Host App - Analytics Dashboard

**Host Analytics Dashboard:**
- Dashboard screen with key metrics
- Revenue charts (line/bar charts)
- Charger utilization visualization
- Visitor statistics display
- Date range selector
- Export data button

**Analytics Visualization:**
- Revenue chart component
- Usage chart component
- Stat cards for key metrics
- Peak hours heatmap
- Charger performance comparison

**Host App Files:**
- `zynk-host-app/src/screens/dashboard/DashboardScreen.tsx`
- `zynk-host-app/src/screens/analytics/AnalyticsScreen.tsx`
- `zynk-host-app/src/components/analytics/RevenueChart.tsx`
- `zynk-host-app/src/components/analytics/UsageChart.tsx`
- `zynk-host-app/src/components/analytics/StatCard.tsx`
- `zynk-host-app/src/services/api/analytics.api.ts`
- `zynk-host-app/src/store/slices/analytics.slice.ts`

#### Driver App - Usage Statistics

**Driver Analytics:**
- Spending summary screen
- Session statistics
- Energy consumption trends
- Favorite locations
- Charging history charts

**Driver App Files:**
- `zynk-driver-app/src/screens/analytics/SpendingSummaryScreen.tsx` (optional)
- (Basic stats can be integrated into session history)

#### Both Apps - Common Components & Navigation

**Real-Time Updates:**
- Socket.io connection to API Gateway
- Subscribe to real-time events
- Handle incoming notifications
- Update UI on events

**Navigation:**
- App navigator setup for each app
- Tab navigation
- Stack navigation
- Deep linking

**Common Components:**
- Reusable button component
- Input component with validation
- Card component
- Loading spinner
- Error message display

**Driver App Common Files:**
- `zynk-driver-app/src/components/common/Button.tsx`
- `zynk-driver-app/src/components/common/Input.tsx`
- `zynk-driver-app/src/components/common/Card.tsx`
- `zynk-driver-app/src/components/common/Loading.tsx`
- `zynk-driver-app/src/components/common/ErrorMessage.tsx`
- `zynk-driver-app/src/services/api/api.client.ts`
- `zynk-driver-app/src/services/websocket/websocket.service.ts`
- `zynk-driver-app/src/navigation/AppNavigator.tsx`
- `zynk-driver-app/src/hooks/useWebSocket.ts`

**Host App Common Files:**
- `zynk-host-app/src/components/common/Button.tsx`
- `zynk-host-app/src/components/common/Input.tsx`
- `zynk-host-app/src/components/common/Card.tsx`
- `zynk-host-app/src/components/common/Loading.tsx`
- `zynk-host-app/src/components/common/ErrorMessage.tsx`
- `zynk-host-app/src/services/api/api.client.ts`
- `zynk-host-app/src/services/websocket/websocket.service.ts`
- `zynk-host-app/src/navigation/AppNavigator.tsx`
- `zynk-host-app/src/hooks/useWebSocket.ts`

---

## Shared Responsibilities (All Developers)

### Database Setup (Neon + Prisma)
- Create Neon account and project (Developer 1 or 5)
- Share Neon connection strings with team via .env file
- Enable PostGIS extension in Neon SQL Editor
- Run Prisma migrations (Developer 1 creates initial schema)
- Use shared "dev" branch for all developers
- Create seed data for testing using Prisma seed script

### Prisma Schema Collaboration
- Shared Prisma schema in `shared/prisma/schema.prisma`
- Coordinate schema changes via Git
- Run `npx prisma generate` after pulling schema changes
- Create migrations with descriptive names
- Test migrations on Neon dev branch before merging

### Type Definitions
- Shared TypeScript types in `shared/types/`
- Auto-generated Prisma types via `@prisma/client`
- Ensure type consistency across services
- Update types as needed

### Testing
- Test API endpoints using Postman/Thunder Client
- Test real-time Socket.io events from mobile apps
- Test HTTP callbacks from microservices to API Gateway
- Test payment flows with PayHere sandbox
- Test OCPP WebSocket server with charger simulator
- Test BYOC meter reading flows
- Test Prisma queries in Prisma Studio
- Monitor Neon dashboard for query performance

### Database Monitoring
- Check Neon dashboard for storage usage
- Monitor data transfer limits
- Review slow queries in Neon console
- Set up billing alerts at 80% capacity (when approaching limits)

### Documentation
- Document API changes
- Update README files
- Comment complex logic
- Create code examples

---

## Development Workflow

### Backend Development
1. Set up Neon PostgreSQL database account (free tier)
2. Create Neon project and enable PostGIS extension
3. Get Neon connection strings (pooled and direct)
4. Configure environment variables with Neon credentials
5. Install dependencies for each service
6. Run Prisma migrations to Neon database
7. Start services in Docker containers or separate terminals:
   - API Gateway (Port 3000)
   - User Service (Port 3001)
   - Charger Service (Port 3002)
   - Analytics Service (Port 3003)
8. Test endpoints via API Gateway

### Frontend Development

#### Driver App Setup
```bash
cd zynk-driver-app
npm install
npx expo start
```
- Test on iOS/Android simulators or physical devices
- Configure API base URL to point to API Gateway (localhost:3000)

#### Host App Setup
```bash
cd zynk-host-app
npm install
npx expo start
```
- Test on iOS/Android simulators or physical devices
- Configure API base URL to point to API Gateway (localhost:3000)

### Integration Testing
1. Test end-to-end user flows on both apps
2. Verify WebSocket real-time updates
3. Test payment integration with PayHere sandbox
4. Test OCPP with charger simulator
5. Test BYOC meter reading verification between driver and host apps

---

## Critical Dependencies Between Developers

- **Developer 1 → All**: Authentication must be completed first for protected routes
- **Developer 2 → Developer 3**: Chargers must exist before reservations can be created
- **Developer 3 → Developer 4**: Sessions must be created before payments can be initiated
- **Developer 5**: API Gateway must be set up early for other developers to test integrations
- **All → Developer 5**: Microservices send HTTP callbacks to API Gateway, which broadcasts via Socket.io to mobile apps

---

**Note:** Coordinate regularly to ensure smooth integration between backend services and frontend components. Use the shared types to maintain consistency across the stack.

**Communication Pattern:** Microservices use HTTP to notify API Gateway (`POST /internal/notify`). API Gateway broadcasts events to mobile apps via Socket.io. Future migration to Kafka/Redis Pub/Sub possible.

**Last Updated:** October 21, 2025
