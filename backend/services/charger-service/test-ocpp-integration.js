#!/usr/bin/env node

/**
 * OCPP Integration Test Suite
 * Tests all OCPP functionality end-to-end
 */

import WebSocket from 'ws';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient({
  datasourceUrl: "postgresql://postgres:postgres@localhost:5432/zynk"
});

// Test configuration
const TEST_CONFIG = {
  serverUrl: 'ws://localhost:3002/ocpp',
  httpUrl: 'http://localhost:3002',
  testChargerId: `TEST_CHARGER_${Date.now()}`, // Unique ID to avoid conflicts
  testIdTag: 'TEST_TAG_123'
};

// Global WebSocket connection for OCPP tests
let testWebSocket = null;

// Test results
const results = {
  passed: 0,
  failed: 0,
  tests: []
};

function log(message, type = 'info') {
  const timestamp = new Date().toISOString();
  const colors = {
    info: '\x1b[36m',
    success: '\x1b[32m',
    error: '\x1b[31m',
    warning: '\x1b[33m',
    reset: '\x1b[0m'
  };
  console.log(`${colors[type]}[${timestamp}] ${message}${colors.reset}`);
}

function assert(condition, message) {
  if (condition) {
    results.passed++;
    log(`✅ PASS: ${message}`, 'success');
  } else {
    results.failed++;
    log(`❌ FAIL: ${message}`, 'error');
  }
  results.tests.push({ message, passed: condition });
}

// Sleep utility
function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// Test WebSocket connection and keep it open for all OCPP tests
async function setupWebSocketConnection() {
  log('Setting up persistent WebSocket connection...');

  return new Promise((resolve) => {
    testWebSocket = new WebSocket(`${TEST_CONFIG.serverUrl}/${TEST_CONFIG.testChargerId}`);

    testWebSocket.on('open', () => {
      log('✅ WebSocket connection established and will be reused for all tests');
      assert(true, 'WebSocket connection established');
      resolve(true);
    });

    testWebSocket.on('error', (error) => {
      log(`❌ WebSocket connection failed: ${error.message}`, 'error');
      assert(false, 'WebSocket connection failed');
      resolve(false);
    });

    testWebSocket.on('close', (code, reason) => {
      log(`WebSocket connection closed: ${code} - ${reason}`, 'warning');
    });

    testWebSocket.on('message', (data) => {
      log(`Received message: ${data.toString()}`);
    });

    // Timeout after 5 seconds
    setTimeout(() => {
      if (testWebSocket.readyState !== WebSocket.OPEN) {
        log('WebSocket connection timeout during setup', 'error');
        assert(false, 'WebSocket connection timeout');
        resolve(false);
      }
    }, 5000);
  });
}

// Clean up WebSocket connection
function cleanupWebSocketConnection() {
  if (testWebSocket && testWebSocket.readyState === WebSocket.OPEN) {
    testWebSocket.close();
    log('WebSocket connection closed');
  }
}

// Test OCPP BootNotification using persistent connection
async function testBootNotification() {
  log('Testing BootNotification...');

  return new Promise((resolve) => {
    if (!testWebSocket || testWebSocket.readyState !== WebSocket.OPEN) {
      log('WebSocket connection not available for BootNotification', 'error');
      assert(false, 'WebSocket connection not available for BootNotification');
      resolve(false);
      return;
    }

    log('WebSocket is connected, sending BootNotification...');

    // Send BootNotification
    const bootMessage = [
      2, // MessageType: CALL
      "123456", // MessageId
      "BootNotification", // Action
      {
        chargePointVendor: "Test Vendor",
        chargePointModel: "Test Model",
        chargePointSerialNumber: "TEST001",
        chargeBoxSerialNumber: "BOX001",
        firmwareVersion: "1.0.0",
        iccid: "8901234567890123456",
        imsi: "310150123456789",
        meterType: "Test Meter",
        meterSerialNumber: "METER001"
      }
    ];

    testWebSocket.send(JSON.stringify(bootMessage));
    log('Sent BootNotification');

    // Set up message handler for this test
    const messageHandler = (data) => {
      try {
        const response = JSON.parse(data.toString());
        log(`Received response: ${JSON.stringify(response, null, 2)}`);

        // Check if it's a CALLRESULT (3) with BootNotification response
        if (response[0] === 3 && response[1] === "123456") {
          const payload = response[2];
          assert(payload.status === 'Accepted', 'BootNotification accepted');
          assert(payload.currentTime, 'BootNotification has currentTime');
          assert(payload.interval, 'BootNotification has heartbeat interval');

          // Remove this handler and resolve
          testWebSocket.removeEventListener('message', messageHandler);
          resolve(true);
        }
      } catch (error) {
        log(`Error parsing response: ${error}`, 'error');
        assert(false, 'BootNotification response parsing failed');
        testWebSocket.removeEventListener('message', messageHandler);
        resolve(false);
      }
    };

    testWebSocket.on('message', messageHandler);

    // Timeout after 10 seconds
    setTimeout(() => {
      log('BootNotification timeout - removing handler', 'warning');
      testWebSocket.removeEventListener('message', messageHandler);
      assert(false, 'BootNotification timeout');
      resolve(false);
    }, 10000);
  });
}

// Test OCPP StatusNotification using persistent connection
async function testStatusNotification() {
  log('Testing StatusNotification...');

  return new Promise((resolve) => {
    if (!testWebSocket || testWebSocket.readyState !== WebSocket.OPEN) {
      assert(false, 'WebSocket connection not available for StatusNotification');
      resolve(false);
      return;
    }

    const statusMessage = [
      2,
      "789012",
      "StatusNotification",
      {
        connectorId: 1,
        errorCode: "NoError",
        status: "Available",
        timestamp: new Date().toISOString(),
        info: "Connector available",
        vendorId: "TestVendor",
        vendorErrorCode: "None"
      }
    ];

    testWebSocket.send(JSON.stringify(statusMessage));
    log('Sent StatusNotification');

    const messageHandler = (data) => {
      try {
        const response = JSON.parse(data.toString());
        if (response[0] === 3 && response[1] === "789012") {
          assert(true, 'StatusNotification processed successfully');
          testWebSocket.removeEventListener('message', messageHandler);
          resolve(true);
        }
      } catch (error) {
        assert(false, 'StatusNotification response parsing failed');
        testWebSocket.removeEventListener('message', messageHandler);
        resolve(false);
      }
    };

    testWebSocket.on('message', messageHandler);

    setTimeout(() => {
      testWebSocket.removeEventListener('message', messageHandler);
      assert(false, 'StatusNotification timeout');
      resolve(false);
    }, 5000);
  });
}

// Test OCPP Authorize using persistent connection
async function testAuthorize() {
  log('Testing Authorize...');

  return new Promise((resolve) => {
    if (!testWebSocket || testWebSocket.readyState !== WebSocket.OPEN) {
      assert(false, 'WebSocket connection not available for Authorize');
      resolve(false);
      return;
    }

    const authorizeMessage = [
      2,
      "345678",
      "Authorize",
      {
        idTag: TEST_CONFIG.testIdTag
      }
    ];

    testWebSocket.send(JSON.stringify(authorizeMessage));
    log('Sent Authorize request');

    const messageHandler = (data) => {
      try {
        const response = JSON.parse(data.toString());
        if (response[0] === 3 && response[1] === "345678") {
          const payload = response[2];
          assert(payload.idTagInfo.status === 'Accepted', 'Authorize accepted');
          testWebSocket.removeEventListener('message', messageHandler);
          resolve(true);
        }
      } catch (error) {
        assert(false, 'Authorize response parsing failed');
        testWebSocket.removeEventListener('message', messageHandler);
        resolve(false);
      }
    };

    testWebSocket.on('message', messageHandler);

    setTimeout(() => {
      testWebSocket.removeEventListener('message', messageHandler);
      assert(false, 'Authorize timeout');
      resolve(false);
    }, 5000);
  });
}

// Test HTTP Remote Start Command
async function testRemoteStartCommand() {
  log('Testing Remote Start Command...');

  try {
    // First, check if test charger already exists (from BootNotification test)
    let charger = await prisma.charger.findFirst({
      where: { ocppChargePointId: TEST_CONFIG.testChargerId }
    });

    let chargerId;
    if (charger) {
      chargerId = charger.id;
      log(`Using existing test charger with ID: ${chargerId}`);
    } else {
      // Create a test charger in database using raw SQL (PostGIS requires raw SQL)
      const result = await prisma.$queryRaw`
        INSERT INTO chargers (
          "hostId", name, type, "connectorType", "powerOutput", "chargingSpeed",
          "pricePerHour", "isByoc", "ocppChargePointId", "ocppVersion", "ocppStatus",
          location, address, status, "createdAt", "updatedAt"
        ) VALUES (
          1, ${'Test Charger ' + TEST_CONFIG.testChargerId}, 'LEVEL2'::"ChargerType",
          'TYPE2'::"ConnectorType", 7200, '7.2 kW',
          0, false, ${TEST_CONFIG.testChargerId}, '1.6', 'OFFLINE'::"OcppStatus",
          ST_GeographyFromText('POINT(79.8612 6.9271)'), ${'Test Address for ' + TEST_CONFIG.testChargerId},
          'AVAILABLE'::"ChargerStatus", CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
        )
        RETURNING id
      `;

      chargerId = result[0].id;
      log(`Created test charger with ID: ${chargerId}`);
    }

    // Make HTTP request to remote start
    const response = await fetch(`${TEST_CONFIG.httpUrl}/api/v1/chargers/${chargerId}/remote-start`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        connectorId: 1,
        idTag: TEST_CONFIG.testIdTag
      })
    });

    const result2 = await response.json();

    if (response.ok && result2.success) {
      assert(true, 'Remote start command successful');
      return result2.data.session.transactionId;
    } else {
      assert(false, `Remote start failed: ${result2.error?.message}`);
      return null;
    }
  } catch (error) {
    log(`Remote start test error: ${error.message}`, 'error');
    assert(false, 'Remote start HTTP request failed');
    return null;
  }
}

// Test HTTP Remote Stop Command
async function testRemoteStopCommand(transactionId) {
  log('Testing Remote Stop Command...');

  if (!transactionId) {
    assert(false, 'Cannot test remote stop without transaction ID');
    return;
  }

  try {
    // Get charger ID
    const charger = await prisma.charger.findUnique({
      where: { ocppChargePointId: TEST_CONFIG.testChargerId }
    });

    if (!charger) {
      assert(false, 'Test charger not found for remote stop');
      return;
    }

    const response = await fetch(`${TEST_CONFIG.httpUrl}/api/v1/chargers/${charger.id}/remote-stop`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        transactionId: transactionId
      })
    });

    const result = await response.json();

    if (response.ok && result.success) {
      assert(true, 'Remote stop command successful');
    } else {
      assert(false, `Remote stop failed: ${result.error?.message}`);
    }
  } catch (error) {
    log(`Remote stop test error: ${error.message}`, 'error');
    assert(false, 'Remote stop HTTP request failed');
  }
}

// Test database state
async function testDatabaseState() {
  log('Testing database state...');

  try {
    // Check if charger exists (it might not exist yet, that's OK)
    const charger = await prisma.charger.findUnique({
      where: { ocppChargePointId: TEST_CONFIG.testChargerId }
    });

    // This is not necessarily a failure - charger might not exist yet
    log(`Test charger ${TEST_CONFIG.testChargerId} ${charger ? 'exists' : 'does not exist'} in database`);

    // Check charging sessions table is accessible
    const sessions = await prisma.chargingSession.findMany({
      where: { chargerId: charger?.id || 0 }
    });
    assert(sessions !== null, 'Charging sessions table accessible');

    log(`Found ${sessions.length} charging sessions for test charger`);
    assert(true, 'Database connectivity verified');

  } catch (error) {
    log(`Database test error: ${error.message}`, 'error');
    assert(false, 'Database test failed');
  }
}

// Main test runner
async function runTests() {
  log('🚀 Starting OCPP Integration Tests');
  log('=====================================');

  try {
    // Setup persistent WebSocket connection
    const wsConnected = await setupWebSocketConnection();
    if (!wsConnected) {
      log('❌ Cannot proceed with tests - WebSocket connection failed', 'error');
      return;
    }

    await sleep(1000);

    // Test 2: BootNotification
    await testBootNotification();
    await sleep(1000);

    // Test 3: StatusNotification
    await testStatusNotification();
    await sleep(1000);

    // Test 4: Authorize
    await testAuthorize();
    await sleep(1000);

    // Test 5: Database State
    await testDatabaseState();
    await sleep(1000);

    // Test 6: Remote Start Command
    const transactionId = await testRemoteStartCommand();
    await sleep(2000);

    // Test 7: Remote Stop Command
    if (transactionId) {
      await testRemoteStopCommand(transactionId);
    }

    // Cleanup
    cleanupWebSocketConnection();

  } catch (error) {
    log(`Test suite error: ${error.message}`, 'error');
    cleanupWebSocketConnection();
  } finally {
    await prisma.$disconnect();
  }

  // Print results
  log('\n=====================================');
  log('🏁 Test Results Summary');
  log('=====================================');
  log(`Total Tests: ${results.tests.length}`);
  log(`Passed: ${results.passed}`, 'success');
  log(`Failed: ${results.failed}`, results.failed > 0 ? 'error' : 'info');

  if (results.failed === 0) {
    log('\n🎉 All OCPP tests passed! Implementation is working correctly.', 'success');
  } else {
    log('\n⚠️  Some tests failed. Check the implementation.', 'warning');
    log('\nFailed tests:');
    results.tests.filter(test => !test.passed).forEach(test => {
      log(`  - ${test.message}`, 'error');
    });
  }

  process.exit(results.failed > 0 ? 1 : 0);
}

// Check if server is running
async function checkServerHealth() {
  log('Checking if server is running...');

  try {
    const response = await fetch(`${TEST_CONFIG.httpUrl}/health`);
    if (response.ok) {
      log('✅ Server is running and healthy');
      return true;
    } else {
      log('❌ Server health check failed', 'error');
      return false;
    }
  } catch (error) {
    log(`❌ Cannot connect to server: ${error.message}`, 'error');
    log('💡 Make sure the charger service is running on port 3002', 'warning');
    return false;
  }
}

// Run the tests
checkServerHealth().then(serverRunning => {
  if (serverRunning) {
    runTests();
  } else {
    log('Cannot run tests - server is not running', 'error');
    process.exit(1);
  }
});