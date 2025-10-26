import { WebSocketServer, WebSocket } from 'ws';
import { IncomingMessage } from 'http';
import { handleBootNotificationController, handleStatusNotificationController, handleHeartbeatController, handleAuthorizeController, handleStartTransactionController, handleStopTransactionController, handleMeterValuesController } from '../controllers/ocpp.controller.js';
import { updateChargerConnectionStatusDefault } from '../services/ocpp.service.js';
import { handleCallResult, handleCallError, processQueuedCommands } from './ocpp.remote.js';

// State management
let wss: WebSocketServer;
export const connections = new Map<string, WebSocket>();
export const connectionMetadata = new Map<string, {
  connectedAt: Date;
  lastHeartbeat: Date;
  chargePointId: string;
}>();

// Connection limits
const MAX_CONNECTIONS = 1000; // Maximum concurrent connections
const CONNECTION_RATE_LIMIT = 10; // Max connections per minute per IP
const connectionAttempts = new Map<string, { count: number; resetTime: number }>();

export function initializeOCPPServer(server: any) {
  try {
    // Create WebSocket server - will handle all connections and filter in handleConnection
    wss = new WebSocketServer({
      server,
      maxPayload: 1024 * 1024, // 1MB max payload
      perMessageDeflate: false, // Disable compression for better performance
    });

    // Set up periodic cleanup
    setInterval(cleanupStaleConnections, 60000); // Clean up every minute

    wss.on('connection', handleConnection);
    wss.on('error', (error) => {
      console.error('WebSocket server error:', error);
    });

    console.log('OCPP WebSocket server initialized with connection limits');
    console.log('WebSocket server clients:', wss.clients?.size || 'N/A');
  } catch (error) {
    console.error('Failed to initialize OCPP server:', error);
  }
}

function getClientIP(request: IncomingMessage): string {
  // Extract client IP from headers or connection
  const forwarded = request.headers['x-forwarded-for'];
  if (forwarded && typeof forwarded === 'string') {
    return forwarded.split(',')[0]?.trim() || 'unknown';
  }
  return request.socket?.remoteAddress || 'unknown';
}

function checkRateLimit(clientIP: string): boolean {
  const now = Date.now();
  const windowMs = 60 * 1000; // 1 minute window

  const attempts = connectionAttempts.get(clientIP);
  if (!attempts || now > attempts.resetTime) {
    // Reset or initialize rate limit
    connectionAttempts.set(clientIP, { count: 1, resetTime: now + windowMs });
    return true;
  }

  if (attempts.count >= CONNECTION_RATE_LIMIT) {
    return false;
  }

  attempts.count++;
  return true;
}

async function handleConnection(ws: WebSocket, request: IncomingMessage) {
  console.log('New WebSocket connection attempt:', request.url);

  // Check connection limits
  if (connections.size >= MAX_CONNECTIONS) {
    console.log('Rejecting connection: maximum connections reached');
    ws.close(1013, 'Server is at capacity');
    return;
  }

  // Basic rate limiting by IP
  const clientIP = getClientIP(request);
  if (!checkRateLimit(clientIP)) {
    console.log(`Rejecting connection from ${clientIP}: rate limit exceeded`);
    ws.close(1013, 'Rate limit exceeded');
    return;
  }

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

  // Check if charge point is already connected
  if (connections.has(chargePointId)) {
    console.log(`Rejecting connection: charge point ${chargePointId} already connected`);
    ws.close(1008, 'Charge point already connected');
    return;
  }

  console.log(`Charge point connected: ${chargePointId}`);

  // Store connection
  connections.set(chargePointId, ws);

  // Store connection metadata
  connectionMetadata.set(chargePointId, {
    connectedAt: new Date(),
    lastHeartbeat: new Date(),
    chargePointId,
  });

  // Update charger status to online when connection established
  try {
    await updateChargerConnectionStatusDefault(chargePointId, true);
    console.log(`Updated ${chargePointId} status to online`);

    // Process any queued remote commands
    await processQueuedCommands(chargePointId);
  } catch (error) {
    console.error(`Failed to update online status for ${chargePointId}:`, error);
  }

  // Handle incoming messages
  ws.on('message', async (data: Buffer) => {
    console.log(`MESSAGE EVENT TRIGGERED for ${chargePointId}, data type: ${typeof data}, length: ${data.length}`);
    try {
      await handleMessage(chargePointId, data);
    } catch (error) {
      console.error(`Error handling message from ${chargePointId}:`, error);
      sendError(ws, 'GenericError', 'Internal server error');
    }
  });

  // Handle connection close
  ws.on('close', async (code, reason) => {
    console.log(`Charge point ${chargePointId} disconnected: ${code} - ${reason}`);
    console.log(`Cleaning up connection for ${chargePointId}`);
    connections.delete(chargePointId);
    connectionMetadata.delete(chargePointId);
    console.log(`Remaining connections: ${connections.size}`);

    // Update charger status to offline when connection closes
    try {
      await updateChargerConnectionStatusDefault(chargePointId, false);
      console.log(`Updated ${chargePointId} status to offline`);
    } catch (error) {
      console.error(`Failed to update offline status for ${chargePointId}:`, error);
    }
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
  console.log(`Received raw message from ${chargePointId}: ${message}`);
  console.log(`Message length: ${message.length}`);

  try {
    const parsedMessage = JSON.parse(message);
    console.log(`Parsed message type:`, typeof parsedMessage);
    console.log(`Is array:`, Array.isArray(parsedMessage));

    // Validate OCPP message format - must be an array
    if (!Array.isArray(parsedMessage)) {
      throw new Error('OCPP message must be an array');
    }

    if (parsedMessage.length < 2) {
      throw new Error('OCPP message must have at least 2 elements');
    }

    const [messageTypeId, uniqueId, ...rest] = parsedMessage;
    console.log(`Parsed OCPP message: type=${messageTypeId}, uniqueId=${uniqueId}, action=${rest[0] || 'N/A'}`);

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
        await handleCallResult(chargePointId, uniqueId, rest[0]);
        break;
      case 4: // CALLERROR
        await handleCallError(chargePointId, uniqueId, rest[0], rest[1]);
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
    // Route to appropriate controller function based on action
    let response;

    switch (action) {
      case 'BootNotification':
        response = await handleBootNotificationController(chargePointId, payload);
        break;
      case 'StatusNotification':
        response = await handleStatusNotificationController(chargePointId, payload);
        break;
      case 'Heartbeat':
        response = await handleHeartbeatController(chargePointId, payload);
        break;
      case 'Authorize':
        response = await handleAuthorizeController(chargePointId, payload);
        break;
      case 'StartTransaction':
        response = await handleStartTransactionController(chargePointId, payload);
        break;
      case 'StopTransaction':
        response = await handleStopTransactionController(chargePointId, payload);
        break;
      case 'MeterValues':
        response = await handleMeterValuesController(chargePointId, payload);
        break;
      default:
        console.log(`Unhandled action: ${action}`);
        sendCallError(ws, uniqueId, 'NotImplemented', `Action ${action} not implemented`);
        return;
    }

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
    connectionMetadata.clear();
  }
}

// Connection monitoring functions
export function getConnectionStats() {
  const now = new Date();
  const stats = {
    totalConnections: connections.size,
    connections: Array.from(connectionMetadata.entries()).map(([id, metadata]) => ({
      chargePointId: id,
      connectedAt: metadata.connectedAt,
      lastHeartbeat: metadata.lastHeartbeat,
      connectionDuration: now.getTime() - metadata.connectedAt.getTime(),
      timeSinceLastHeartbeat: now.getTime() - metadata.lastHeartbeat.getTime(),
    })),
  };
  return stats;
}

// Clean up stale connections (for server restart scenarios)
export function cleanupStaleConnections() {
  const now = new Date();
  const timeoutMs = 5 * 60 * 1000; // 5 minutes

  for (const [chargePointId, metadata] of connectionMetadata.entries()) {
    const timeSinceHeartbeat = now.getTime() - metadata.lastHeartbeat.getTime();
    if (timeSinceHeartbeat > timeoutMs) {
      console.log(`Cleaning up stale connection for ${chargePointId}`);
      connections.delete(chargePointId);
      connectionMetadata.delete(chargePointId);
    }
  }
}
