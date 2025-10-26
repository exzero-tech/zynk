import { connections, sendToChargePoint } from './ocpp.server.js';
import { logOCPPMessageDefault } from '../services/ocpp.service.js';
import type { RemoteCommandRequest, RemoteCommandResponse } from '../models/ocpp.types.js';

// Command queue for offline chargers
const commandQueue = new Map<string, RemoteCommandRequest[]>();
const pendingResponses = new Map<string, {
  resolve: (value: any) => void;
  reject: (reason: any) => void;
  timeout: NodeJS.Timeout;
}>();

// Default timeout for remote commands (30 seconds)
const DEFAULT_TIMEOUT_MS = 30000;

// Generate unique message ID for OCPP CALL messages
function generateMessageId(): string {
  return `remote-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

// Send CALL message to charge point
export async function sendRemoteCommand(command: RemoteCommandRequest): Promise<RemoteCommandResponse> {
  const { chargePointId, action, payload, timeoutMs = DEFAULT_TIMEOUT_MS } = command;

  console.log(`Sending remote command ${action} to ${chargePointId}`);

  // Check if charge point is connected
  if (!connections.has(chargePointId)) {
    console.log(`Charge point ${chargePointId} is offline, queuing command`);

    // Queue command for when charger comes online
    if (!commandQueue.has(chargePointId)) {
      commandQueue.set(chargePointId, []);
    }
    commandQueue.get(chargePointId)!.push(command);

    return {
      success: false,
      errorCode: 'ChargePointOffline',
      errorDescription: 'Charge point is currently offline. Command queued for execution when it comes online.'
    };
  }

  // Generate unique message ID
  const messageId = generateMessageId();

  // Create OCPP CALL message [2, messageId, action, payload]
  const callMessage = [2, messageId, action, payload];

  try {
    // Send the message
    const sent = sendToChargePoint(chargePointId, callMessage);

    if (!sent) {
      throw new Error('Failed to send message to charge point');
    }

    // Log outbound message
    await logOCPPMessageDefault(
      chargePointId,
      'CALL',
      action,
      payload,
      'OUTBOUND'
    );

    console.log(`Sent ${action} command to ${chargePointId} with message ID ${messageId}`);

    // Wait for response with timeout
    const response = await waitForResponse(messageId, timeoutMs);

    return {
      success: true,
      ...response
    };

  } catch (error) {
    console.error(`Error sending remote command ${action} to ${chargePointId}:`, error);

    // Log error
    await logOCPPMessageDefault(
      chargePointId,
      'CALL_ERROR',
      action,
      {
        payload,
        error: error instanceof Error ? error.message : 'Unknown error'
      },
      'OUTBOUND'
    );

    return {
      success: false,
      errorCode: 'InternalError',
      errorDescription: error instanceof Error ? error.message : 'Unknown error occurred'
    };
  }
}

// Wait for CALLRESULT or CALLERROR response
function waitForResponse(messageId: string, timeoutMs: number): Promise<any> {
  return new Promise((resolve, reject) => {
    const timeout = setTimeout(() => {
      pendingResponses.delete(messageId);
      reject(new Error(`Timeout waiting for response to message ${messageId}`));
    }, timeoutMs);

    pendingResponses.set(messageId, { resolve, reject, timeout });
  });
}

// Handle incoming CALLRESULT messages (called from message handler)
export async function handleCallResult(chargePointId: string, messageId: string, payload: any) {
  console.log(`Received CALLRESULT for message ${messageId} from ${chargePointId}`);

  const pending = pendingResponses.get(messageId);
  if (pending) {
    clearTimeout(pending.timeout);
    pendingResponses.delete(messageId);
    pending.resolve(payload);
  }

  // Log inbound response
  await logOCPPMessageDefault(
    chargePointId,
    'CALLRESULT',
    'Response',
    payload,
    'INBOUND'
  );
}

// Handle incoming CALLERROR messages (called from message handler)
export async function handleCallError(chargePointId: string, messageId: string, errorCode: string, errorDescription: string) {
  console.log(`Received CALLERROR for message ${messageId} from ${chargePointId}: ${errorCode} - ${errorDescription}`);

  const pending = pendingResponses.get(messageId);
  if (pending) {
    clearTimeout(pending.timeout);
    pendingResponses.delete(messageId);
    pending.reject(new Error(`${errorCode}: ${errorDescription}`));
  }

  // Log inbound error
  await logOCPPMessageDefault(
    chargePointId,
    'CALLERROR',
    'Error',
    { errorCode, errorDescription },
    'INBOUND'
  );
}

// Process queued commands when charger comes online
export async function processQueuedCommands(chargePointId: string) {
  const queue = commandQueue.get(chargePointId);
  if (!queue || queue.length === 0) {
    return;
  }

  console.log(`Processing ${queue.length} queued commands for ${chargePointId}`);

  // Process commands in order
  for (const command of queue) {
    try {
      await sendRemoteCommand(command);
    } catch (error) {
      console.error(`Failed to process queued command ${command.action} for ${chargePointId}:`, error);
    }
  }

  // Clear the queue
  commandQueue.delete(chargePointId);
}

// Remote command functions
export async function sendRemoteStartTransaction(
  chargePointId: string,
  connectorId: number,
  idTag: string,
  reservationId?: number
): Promise<RemoteCommandResponse> {
  const payload = {
    connectorId,
    idTag,
    ...(reservationId && { reservationId })
  };

  const response = await sendRemoteCommand({
    chargePointId,
    action: 'RemoteStartTransaction',
    payload,
    timeoutMs: 30000 // 30 seconds timeout
  });

  return response;
}

export async function sendRemoteStopTransaction(
  chargePointId: string,
  transactionId: number
): Promise<RemoteCommandResponse> {
  const payload = {
    transactionId
  };

  const response = await sendRemoteCommand({
    chargePointId,
    action: 'RemoteStopTransaction',
    payload,
    timeoutMs: 30000 // 30 seconds timeout
  });

  return response;
}