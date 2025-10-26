import { handleBootNotification, handleStatusNotification, handleHeartbeat, handleAuthorize, handleStartTransaction, handleStopTransaction, handleMeterValues } from '../ocpp/ocpp.handler.js';

// OCPP Controller - Business logic layer between WebSocket server and handlers
// Functional programming approach - pure functions with no side effects

// Handle BootNotification message
export const handleBootNotificationController = async (chargePointId: string, payload: any) => {
  try {
    console.log(`[OCPP Controller] Processing BootNotification for ${chargePointId}`);

    // Business logic validation can be added here
    if (!chargePointId || !payload) {
      throw new Error('Invalid BootNotification parameters');
    }

    // Delegate to handler
    const response = await handleBootNotification(chargePointId, payload);

    console.log(`[OCPP Controller] BootNotification processed successfully for ${chargePointId}`);
    return response;

  } catch (error) {
    console.error(`[OCPP Controller] Error in BootNotification for ${chargePointId}:`, error);
    throw error;
  }
};

// Handle StatusNotification message
export const handleStatusNotificationController = async (chargePointId: string, payload: any) => {
  try {
    console.log(`[OCPP Controller] Processing StatusNotification for ${chargePointId}`);

    // Business logic validation
    if (!payload.connectorId || typeof payload.status !== 'string') {
      throw new Error('Invalid StatusNotification parameters');
    }

    // Delegate to handler
    const response = await handleStatusNotification(chargePointId, payload);

    return response;

  } catch (error) {
    console.error(`[OCPP Controller] Error in StatusNotification for ${chargePointId}:`, error);
    throw error;
  }
};

// Handle Heartbeat message
export const handleHeartbeatController = async (chargePointId: string, payload: any) => {
  try {
    console.log(`[OCPP Controller] Processing Heartbeat for ${chargePointId}`);

    // Delegate to handler
    const response = await handleHeartbeat(chargePointId, payload);

    return response;

  } catch (error) {
    console.error(`[OCPP Controller] Error in Heartbeat for ${chargePointId}:`, error);
    throw error;
  }
};

// Handle Authorize message
export const handleAuthorizeController = async (chargePointId: string, payload: any) => {
  try {
    console.log(`[OCPP Controller] Processing Authorize for ${chargePointId}`);

    // Business logic validation
    if (!payload.idTag) {
      throw new Error('Invalid Authorize parameters: idTag required');
    }

    // Delegate to handler
    const response = await handleAuthorize(chargePointId, payload);

    return response;

  } catch (error) {
    console.error(`[OCPP Controller] Error in Authorize for ${chargePointId}:`, error);
    throw error;
  }
};

// Handle StartTransaction message
export const handleStartTransactionController = async (chargePointId: string, payload: any) => {
  try {
    console.log(`[OCPP Controller] Processing StartTransaction for ${chargePointId}`);

    // Business logic validation
    if (!payload.connectorId || !payload.idTag || !payload.meterStart) {
      throw new Error('Invalid StartTransaction parameters');
    }

    // Additional business logic can be added here
    // e.g., check if charger is available, validate user permissions, etc.

    // Delegate to handler
    const response = await handleStartTransaction(chargePointId, payload);

    console.log(`[OCPP Controller] StartTransaction processed successfully for ${chargePointId}`);
    return response;

  } catch (error) {
    console.error(`[OCPP Controller] Error in StartTransaction for ${chargePointId}:`, error);
    throw error;
  }
};

// Handle StopTransaction message
export const handleStopTransactionController = async (chargePointId: string, payload: any) => {
  try {
    console.log(`[OCPP Controller] Processing StopTransaction for ${chargePointId}`);

    // Business logic validation
    if (!payload.transactionId || !payload.idTag || !payload.timestamp || !payload.meterStop) {
      throw new Error('Invalid StopTransaction parameters');
    }

    // Delegate to handler
    const response = await handleStopTransaction(chargePointId, payload);

    console.log(`[OCPP Controller] StopTransaction processed successfully for ${chargePointId}`);
    return response;

  } catch (error) {
    console.error(`[OCPP Controller] Error in StopTransaction for ${chargePointId}:`, error);
    throw error;
  }
};

// Handle MeterValues message
export const handleMeterValuesController = async (chargePointId: string, payload: any) => {
  try {
    console.log(`[OCPP Controller] Processing MeterValues for ${chargePointId}`);

    // Business logic validation
    if (!payload.connectorId || !payload.transactionId || !payload.meterValue) {
      throw new Error('Invalid MeterValues parameters');
    }

    // Delegate to handler
    const response = await handleMeterValues(chargePointId, payload);

    return response;

  } catch (error) {
    console.error(`[OCPP Controller] Error in MeterValues for ${chargePointId}:`, error);
    throw error;
  }
};