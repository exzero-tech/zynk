// OCPP 1.6J WebSocket Client Service
export class OCPPClient {
  constructor() {
    this.ws = null;
    this.chargePointId = null;
    this.serverUrl = null;
    this.connected = false;
    this.messageHandlers = [];
    this.heartbeatInterval = null;
    this.messageQueue = [];
  }

  connect(serverUrl, chargePointId) {
    return new Promise((resolve, reject) => {
      try {
        this.serverUrl = serverUrl;
        this.chargePointId = chargePointId;
        
        const wsUrl = `${serverUrl}/${chargePointId}`;
        console.log(`[OCPP] Connecting to: ${wsUrl}`);
        
        this.ws = new WebSocket(wsUrl);

        this.ws.onopen = () => {
          console.log('[OCPP] WebSocket connection established');
          this.connected = true;
          this.startHeartbeat();
          resolve(true);
        };

        this.ws.onerror = (error) => {
          console.error('[OCPP] WebSocket error:', error);
          this.connected = false;
          reject(error);
        };

        this.ws.onclose = (event) => {
          console.log(`[OCPP] WebSocket closed: ${event.code} - ${event.reason}`);
          this.connected = false;
          this.stopHeartbeat();
          this.notifyHandlers('connection', { type: 'disconnected', code: event.code, reason: event.reason });
        };

        this.ws.onmessage = (event) => {
          try {
            const message = JSON.parse(event.data);
            console.log('[OCPP] Received:', message);
            this.handleIncomingMessage(message);
          } catch (error) {
            console.error('[OCPP] Failed to parse message:', error);
          }
        };

        // Connection timeout
        setTimeout(() => {
          if (!this.connected) {
            reject(new Error('Connection timeout'));
          }
        }, 10000);

      } catch (error) {
        console.error('[OCPP] Connection error:', error);
        reject(error);
      }
    });
  }

  disconnect() {
    if (this.ws) {
      this.stopHeartbeat();
      this.ws.close();
      this.ws = null;
      this.connected = false;
      console.log('[OCPP] Disconnected');
    }
  }

  // Send OCPP CALL message (request from charger to server)
  sendCall(action, payload) {
    const messageId = this.generateMessageId();
    const message = [2, messageId, action, payload]; // MessageType: CALL = 2
    
    if (this.ws && this.connected) {
      this.ws.send(JSON.stringify(message));
      console.log(`[OCPP] Sent ${action}:`, message);
      this.notifyHandlers('sent', { action, messageId, payload });
      return messageId;
    } else {
      console.error('[OCPP] Cannot send - not connected');
      return null;
    }
  }

  // Send OCPP CALLRESULT message (response from charger to server)
  sendCallResult(messageId, payload) {
    const message = [3, messageId, payload]; // MessageType: CALLRESULT = 3
    
    if (this.ws && this.connected) {
      this.ws.send(JSON.stringify(message));
      console.log(`[OCPP] Sent CALLRESULT:`, message);
      this.notifyHandlers('sent', { type: 'CALLRESULT', messageId, payload });
    }
  }

  // Send OCPP CALLERROR message
  sendCallError(messageId, errorCode, errorDescription) {
    const message = [4, messageId, errorCode, errorDescription, {}]; // MessageType: CALLERROR = 4
    
    if (this.ws && this.connected) {
      this.ws.send(JSON.stringify(message));
      console.log(`[OCPP] Sent CALLERROR:`, message);
    }
  }

  // Handle incoming messages from server
  handleIncomingMessage(message) {
    const [messageType, messageId, ...rest] = message;

    switch (messageType) {
      case 2: // CALL from server (remote command)
        const [action, payload] = rest;
        console.log(`[OCPP] Received CALL: ${action}`, payload);
        this.notifyHandlers('call', { action, messageId, payload });
        break;

      case 3: // CALLRESULT from server (response to our request)
        const [resultPayload] = rest;
        console.log(`[OCPP] Received CALLRESULT:`, resultPayload);
        this.notifyHandlers('callresult', { messageId, payload: resultPayload });
        break;

      case 4: // CALLERROR from server
        const [errorCode, errorDescription, errorDetails] = rest;
        console.log(`[OCPP] Received CALLERROR:`, errorCode, errorDescription);
        this.notifyHandlers('callerror', { messageId, errorCode, errorDescription, errorDetails });
        break;

      default:
        console.warn('[OCPP] Unknown message type:', messageType);
    }
  }

  // Message handlers
  onMessage(callback) {
    this.messageHandlers.push(callback);
  }

  offMessage(callback) {
    this.messageHandlers = this.messageHandlers.filter(h => h !== callback);
  }

  notifyHandlers(type, data) {
    this.messageHandlers.forEach(handler => {
      try {
        handler(type, data);
      } catch (error) {
        console.error('[OCPP] Handler error:', error);
      }
    });
  }

  // OCPP Message Actions
  sendBootNotification(vendorInfo) {
    return this.sendCall('BootNotification', {
      chargePointVendor: vendorInfo.vendor || 'ZYNK Simulator',
      chargePointModel: vendorInfo.model || 'ZS-1000',
      chargePointSerialNumber: vendorInfo.serialNumber || this.generateSerialNumber(),
      chargeBoxSerialNumber: vendorInfo.boxSerial || this.generateSerialNumber(),
      firmwareVersion: vendorInfo.firmwareVersion || '1.0.0',
      iccid: vendorInfo.iccid || '',
      imsi: vendorInfo.imsi || '',
      meterType: vendorInfo.meterType || 'Energy Meter',
      meterSerialNumber: vendorInfo.meterSerial || this.generateSerialNumber()
    });
  }

  sendStatusNotification(connectorId, status, errorCode = 'NoError', info = null) {
    return this.sendCall('StatusNotification', {
      connectorId,
      errorCode,
      status, // Available, Preparing, Charging, SuspendedEVSE, SuspendedEV, Finishing, Reserved, Unavailable, Faulted
      timestamp: new Date().toISOString(),
      info,
      vendorId: 'ZYNK',
      vendorErrorCode: errorCode !== 'NoError' ? errorCode : null
    });
  }

  sendHeartbeat() {
    return this.sendCall('Heartbeat', {});
  }

  sendAuthorize(idTag) {
    return this.sendCall('Authorize', { idTag });
  }

  sendStartTransaction(connectorId, idTag, meterStart, timestamp = null) {
    return this.sendCall('StartTransaction', {
      connectorId,
      idTag,
      meterStart,
      timestamp: timestamp || new Date().toISOString()
    });
  }

  sendStopTransaction(transactionId, meterStop, timestamp = null, reason = 'Local') {
    return this.sendCall('StopTransaction', {
      transactionId,
      meterStop,
      timestamp: timestamp || new Date().toISOString(),
      reason // Local, EmergencyStop, EVDisconnected, HardReset, PowerLoss, Reboot, Remote, SoftReset, UnlockCommand, DeAuthorized
    });
  }

  sendMeterValues(connectorId, transactionId, meterValues) {
    return this.sendCall('MeterValues', {
      connectorId,
      transactionId,
      meterValue: meterValues
    });
  }

  sendDataTransfer(vendorId, messageId, data) {
    return this.sendCall('DataTransfer', {
      vendorId,
      messageId,
      data
    });
  }

  // Heartbeat management
  startHeartbeat(interval = 30000) {
    this.stopHeartbeat();
    this.heartbeatInterval = setInterval(() => {
      if (this.connected) {
        this.sendHeartbeat();
      }
    }, interval);
  }

  stopHeartbeat() {
    if (this.heartbeatInterval) {
      clearInterval(this.heartbeatInterval);
      this.heartbeatInterval = null;
    }
  }

  // Utility functions
  generateMessageId() {
    return `${Date.now()}-${Math.random().toString(36).substring(2, 15)}`;
  }

  generateSerialNumber() {
    return `SN${Date.now()}${Math.random().toString(36).substring(2, 7).toUpperCase()}`;
  }

  isConnected() {
    return this.connected;
  }

  getChargePointId() {
    return this.chargePointId;
  }
}

export default OCPPClient;
