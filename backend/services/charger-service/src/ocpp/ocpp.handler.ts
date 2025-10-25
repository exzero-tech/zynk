import { ocppService } from './ocpp.service.js';
import { connectionMetadata } from './ocpp.server.js';

// Handler functions for OCPP messages
// Each handler receives (chargePointId: string, payload: any) and returns response

export async function handleBootNotification(chargePointId: string, payload: any) {
  console.log(`BootNotification from ${chargePointId}:`, payload);

  // Register the charge point
  await ocppService.registerChargePoint(chargePointId, payload);

  // Return acceptance response
  return {
    status: 'Accepted',
    currentTime: new Date().toISOString(),
    interval: 300 // Heartbeat interval in seconds
  };
}

export async function handleStatusNotification(chargePointId: string, payload: any) {
  console.log(`StatusNotification from ${chargePointId}:`, payload);

  // Update charger status
  await ocppService.updateChargerStatus(
    chargePointId,
    payload.connectorId,
    payload.status,
    payload.errorCode
  );

  // StatusNotification has empty response payload
  return {};
}

export async function handleHeartbeat(chargePointId: string, payload: any) {
  console.log(`Heartbeat from ${chargePointId}`);

  // Update last heartbeat time
  const metadata = connectionMetadata.get(chargePointId);
  if (metadata) {
    metadata.lastHeartbeat = new Date();
  }

  // Return current time
  return {
    currentTime: new Date().toISOString()
  };
}

export async function handleAuthorize(chargePointId: string, payload: any) {
  console.log(`Authorize from ${chargePointId}:`, payload);

  // TODO: Implement user/card authorization logic
  // Check if idTag is valid and authorized to charge

  return {
    idTagInfo: {
      status: 'Accepted', // or 'Blocked', 'Expired', 'Invalid', 'ConcurrentTx'
      expiryDate: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(), // 24 hours
      parentIdTag: payload.idTag
    }
  };
}

export async function handleStartTransaction(chargePointId: string, payload: any) {
  console.log(`StartTransaction from ${chargePointId}:`, payload);

  // TODO: Implement transaction start logic
  // Create OCPP transaction record
  // Link to charging session
  // Update charger status

  return {
    transactionId: Date.now(), // TODO: Generate proper transaction ID
    idTagInfo: {
      status: 'Accepted'
    }
  };
}

export async function handleStopTransaction(chargePointId: string, payload: any) {
  console.log(`StopTransaction from ${chargePointId}:`, payload);

  // TODO: Implement transaction stop logic
  // Update OCPP transaction with final values
  // Calculate energy consumed
  // Update charging session

  return {
    idTagInfo: {
      status: 'Accepted'
    }
  };
}

export async function handleMeterValues(chargePointId: string, payload: any) {
  console.log(`MeterValues from ${chargePointId}:`, payload);

  // TODO: Implement meter values processing
  // Store meter readings
  // Update energy consumption in session

  return {};
}

// Map of action names to handler functions
export const ocppHandlers: { [key: string]: (chargePointId: string, payload: any) => Promise<any> } = {
  BootNotification: handleBootNotification,
  StatusNotification: handleStatusNotification,
  Heartbeat: handleHeartbeat,
  Authorize: handleAuthorize,
  StartTransaction: handleStartTransaction,
  StopTransaction: handleStopTransaction,
  MeterValues: handleMeterValues,
};
