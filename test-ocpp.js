import WebSocket from 'ws';

const testOCPPConnection = async () => {
  console.log('🧪 Testing OCPP WebSocket connection...');

  try {
    const ws = new WebSocket('ws://localhost:3002/ocpp/CP001');

    ws.on('open', () => {
      console.log('✅ Connected to OCPP server');

      // Send a BootNotification message
      const bootNotification = [
        2, // MessageTypeId: Call
        'test-123', // UniqueId
        'BootNotification', // Action
        {
          chargePointVendor: 'TestVendor',
          chargePointModel: 'TestModel',
          chargePointSerialNumber: 'TEST001',
          chargeBoxSerialNumber: 'BOX001',
          firmwareVersion: '1.0.0',
          iccid: '12345678901234567890',
          imsi: '123456789012345',
          meterType: 'TestMeter',
          meterSerialNumber: 'METER001'
        }
      ];

      console.log('📤 Sending BootNotification...');
      ws.send(JSON.stringify(bootNotification));
    });

    ws.on('message', (data) => {
      const message = data.toString();
      console.log('📥 Received:', message);

      try {
        const parsed = JSON.parse(message);
        console.log('📋 Parsed message:', JSON.stringify(parsed, null, 2));
      } catch (e) {
        console.log('📋 Raw message (not JSON):', message);
      }
    });

    ws.on('error', (error) => {
      console.error('❌ WebSocket error:', error.message);
    });

    ws.on('close', (code, reason) => {
      console.log(`🔌 Connection closed: ${code} - ${reason.toString()}`);
    });

    // Close after 5 seconds
    setTimeout(() => {
      console.log('⏰ Closing connection after test...');
      ws.close();
    }, 5000);

  } catch (error) {
    console.error('❌ Connection failed:', error.message);
  }
};

testOCPPConnection();