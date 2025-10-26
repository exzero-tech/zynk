# OCPP Integration Test Suite

This test suite validates the complete OCPP implementation end-to-end.

## Prerequisites

1. **Start the charger service:**
   ```bash
   cd backend/services/charger-service
   npm run dev
   ```

2. **Ensure database is running:**
   ```bash
   cd backend
   docker-compose up -d
   ```

## Running Tests

### Windows
```cmd
run-tests.bat
```

### Manual
```bash
node test-ocpp-integration.js
```

## What It Tests

### ✅ WebSocket Connection
- Verifies OCPP WebSocket server is accepting connections
- Tests connection establishment with charger ID

### ✅ OCPP Message Handlers
- **BootNotification**: Charger registration and heartbeat setup
- **StatusNotification**: Connector status updates
- **Authorize**: RFID/user authentication

### ✅ Remote Commands (HTTP API)
- **Remote Start**: Tests `/api/v1/chargers/:id/remote-start` endpoint
- **Remote Stop**: Tests `/api/v1/chargers/:id/remote-stop` endpoint

### ✅ Database Integration
- Verifies charger records are created/updated
- Checks charging session management
- Validates transaction tracking

## Test Flow

1. **Health Check**: Verifies server is running
2. **WebSocket Tests**: Tests core OCPP protocol messages
3. **HTTP API Tests**: Tests remote command endpoints
4. **Database Tests**: Validates data persistence

## Expected Output

```
🚀 Starting OCPP Integration Tests
=====================================
✅ PASS: WebSocket connection successful
✅ PASS: BootNotification accepted
✅ PASS: StatusNotification processed successfully
✅ PASS: Authorize accepted
✅ PASS: Database connectivity verified
✅ PASS: Remote start command successful
✅ PASS: Remote stop command successful

=====================================
🏁 Test Results Summary
=====================================
Total Tests: 7
Passed: 7
Failed: 0

🎉 All OCPP tests passed! Implementation is working correctly.
```

## Troubleshooting

### Server Not Running
```
❌ Cannot connect to server
💡 Make sure the charger service is running on port 3002
```

### Database Issues
- Ensure PostgreSQL is running via Docker
- Run database migrations: `npm run db:migrate`

### WebSocket Connection Failed
- Check if port 3002 is available
- Verify OCPP WebSocket server is initialized in `index.ts`

## Test Configuration

The test uses these default values:
- **Server URL**: `ws://localhost:3002/ocpp`
- **HTTP URL**: `http://localhost:3002`
- **Test Charger ID**: `TEST_CHARGER_001`
- **Test ID Tag**: `TEST_TAG_123`

Modify `TEST_CONFIG` in the test file to change these values.