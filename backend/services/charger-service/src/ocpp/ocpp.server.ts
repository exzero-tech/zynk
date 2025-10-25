import { WebSocketServer, WebSocket } from 'ws';
import { IncomingMessage } from 'http';
import { ocppHandlers } from './ocpp.handler.js';

// State management
let wss: WebSocketServer;
const connections = new Map<string, WebSocket>();

export function initializeOCPPServer(server: any) {
  console.log('🔌 Initializing OCPP WebSocket server...');

  try {
    // Create WebSocket server - will handle all connections and filter in handleConnection
    wss = new WebSocketServer({
      server
      // No path filter - we'll handle /ocpp routing in the connection handler
    });

    console.log('WebSocketServer created');

    wss.on('connection', handleConnection);
    wss.on('error', (error) => {
      console.error('WebSocket server error:', error);
    });

    console.log('✅ OCPP WebSocket server initialized');
  } catch (error) {
    console.error('Failed to initialize OCPP server:', error);
  }
}

function handleConnection(ws: WebSocket, request: IncomingMessage) {
  console.log('New WebSocket connection attempt:', request.url);

  // Only handle OCPP connections
  if (!request.url) {
    console.log('Rejecting connection with no URL');
    ws.close(1008, 'Invalid request');
    return;
  }

  // Check if this is an OCPP connection
  if (!request.url.startsWith('/ocpp')) {
    console.log('Rejecting non-OCPP connection:', request.url);
    ws.close(1008, 'OCPP connections only');
    return;
  }

  console.log('New OCPP connection attempt');

  // Extract charge point ID from URL
  const chargePointId = extractChargePointId(request);
  if (!chargePointId) {
    console.error('No charge point ID provided in connection');
    ws.close(1008, 'Charge point ID required');
    return;
  }

  console.log(`Charge point connected: ${chargePointId}`);

  // Store connection
  connections.set(chargePointId, ws);

  // Handle incoming messages
  ws.on('message', async (data: Buffer) => {
    try {
      await handleMessage(chargePointId, data);
    } catch (error) {
      console.error(`Error handling message from ${chargePointId}:`, error);
      sendError(ws, 'GenericError', 'Internal server error');
    }
  });

  // Handle connection close
  ws.on('close', (code, reason) => {
    console.log(`Charge point ${chargePointId} disconnected: ${code} - ${reason}`);
    connections.delete(chargePointId);
  });

  // Handle connection errors
  ws.on('error', (error) => {
    console.error(`WebSocket error for ${chargePointId}:`, error);
    connections.delete(chargePointId);
  });

  // Send connection acknowledgment
  ws.send(JSON.stringify({
    type: 'connection_ack',
    chargePointId,
    timestamp: new Date().toISOString()
  }));
}

function extractChargePointId(request: IncomingMessage): string | null {
  // OCPP charge points typically identify themselves in the URL path
  // e.g., ws://server/ocpp/CP001
  const url = request.url;
  console.log(`Extracting charge point ID from URL: ${url}`);
  if (url && url.startsWith('/ocpp/')) {
    const chargePointId = url.substring(6); // Remove '/ocpp/'
    console.log(`Extracted charge point ID: ${chargePointId}`);
    return chargePointId;
  }

  console.log('No charge point ID found in URL');
  // Alternative: check headers or query parameters
  return null;
}

async function handleMessage(chargePointId: string, data: Buffer) {
  const message = data.toString();
  console.log(`Received from ${chargePointId}: ${message}`);

  try {
    const parsedMessage = JSON.parse(message);

    // Validate OCPP message format - must be an array
    if (!Array.isArray(parsedMessage)) {
      throw new Error('OCPP message must be an array');
    }

    if (parsedMessage.length < 2) {
      throw new Error('OCPP message must have at least 2 elements');
    }

    const [messageTypeId, uniqueId, ...rest] = parsedMessage;

    // Validate message type ID
    if (typeof messageTypeId !== 'number' || ![2, 3, 4].includes(messageTypeId)) {
      throw new Error(`Invalid message type ID: ${messageTypeId}`);
    }

    // Validate unique ID
    if (typeof uniqueId !== 'string' || uniqueId.length === 0) {
      throw new Error('Invalid unique ID');
    }

    // Route based on message type
    switch (messageTypeId) {
      case 2: // CALL
        if (rest.length < 2) {
          throw new Error('CALL message must have action and payload');
        }
        await handleCall(chargePointId, uniqueId, rest[0], rest[1]);
        break;
      case 3: // CALLRESULT
        console.log(`Received CALLRESULT ${uniqueId} from ${chargePointId}`);
        break;
      case 4: // CALLERROR
        console.log(`Received CALLERROR ${uniqueId} from ${chargePointId}:`, rest);
        break;
      default:
        console.log(`Unhandled message type: ${messageTypeId}`);
    }
  } catch (error) {
    console.error('Error parsing OCPP message:', error);
    const ws = connections.get(chargePointId);
    if (ws) {
      sendError(ws, 'ProtocolError', 'Invalid message format');
    }
  }
}

async function handleCall(chargePointId: string, uniqueId: string, action: string, payload: any) {
  console.log(`Handling CALL: ${action} from ${chargePointId}`);

  const ws = connections.get(chargePointId);
  if (!ws) {
    console.error(`No WebSocket connection found for ${chargePointId}`);
    return;
  }

  // Validate action
  if (typeof action !== 'string' || action.length === 0) {
    console.error(`Invalid action: ${action}`);
    sendCallError(ws, uniqueId, 'ProtocolError', 'Invalid action');
    return;
  }

  try {
    // Get handler from handlers map
    const handler = ocppHandlers[action];
    if (!handler) {
      console.log(`Unhandled action: ${action}`);
      sendCallError(ws, uniqueId, 'NotImplemented', `Action ${action} not implemented`);
      return;
    }

    // Execute handler
    const response = await handler(chargePointId, payload);

    // Send CALLRESULT
    sendCallResult(ws, uniqueId, response);
  } catch (error) {
    console.error(`Error handling ${action}:`, error);
    sendCallError(ws, uniqueId, 'InternalError', 'Server error');
  }
}

function sendCallResult(ws: WebSocket, uniqueId: string, payload: any) {
  const response = [3, uniqueId, payload];
  ws.send(JSON.stringify(response));
}

function sendCallError(ws: WebSocket, uniqueId: string, errorCode: string, errorDescription: string) {
  const response = [4, uniqueId, errorCode, errorDescription];
  ws.send(JSON.stringify(response));
}

function sendError(ws: WebSocket, errorCode: string, message: string) {
  // Generic error response
  ws.send(JSON.stringify({
    error: errorCode,
    message: message,
    timestamp: new Date().toISOString()
  }));
}

// Public API functions
export function sendToChargePoint(chargePointId: string, message: any) {
  const ws = connections.get(chargePointId);
  if (ws && ws.readyState === WebSocket.OPEN) {
    ws.send(JSON.stringify(message));
    return true;
  }
  return false;
}

export function getConnectedChargePoints(): string[] {
  return Array.from(connections.keys());
}

export function closeOCPPServer() {
  if (wss) {
    wss.close();
    connections.clear();
  }
}
