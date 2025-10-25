// OCPP 1.6J Message Types and Interfaces

export type OCPPMessageType = 2 | 3 | 4; // CALL | CALLRESULT | CALLERROR

export interface OCPPMessage {
  messageTypeId: OCPPMessageType;
  uniqueId: string;
  action?: string;
  payload?: any;
  errorCode?: string;
  errorDescription?: string;
}

export interface OCPPCallMessage extends OCPPMessage {
  messageTypeId: 2;
  action: string;
  payload: any;
}

export interface OCPPCallResultMessage extends OCPPMessage {
  messageTypeId: 3;
  payload: any;
}

export interface OCPPCallErrorMessage extends OCPPMessage {
  messageTypeId: 4;
  errorCode: string;
  errorDescription: string;
  errorDetails?: any;
}

// BootNotification Payload
export interface BootNotificationRequest {
  chargePointVendor: string;
  chargePointModel: string;
  chargePointSerialNumber?: string;
  chargeBoxSerialNumber?: string;
  firmwareVersion?: string;
  iccid?: string;
  imsi?: string;
  meterType?: string;
  meterSerialNumber?: string;
}

export interface BootNotificationResponse {
  status: 'Accepted' | 'Pending' | 'Rejected';
  currentTime: string;
  interval: number;
}

// StatusNotification Payload
export interface StatusNotificationRequest {
  connectorId: number;
  errorCode: string;
  info?: string;
  status: 'Available' | 'Preparing' | 'Charging' | 'SuspendedEVSE' | 'SuspendedEV' | 'Finishing' | 'Reserved' | 'Unavailable' | 'Faulted';
  timestamp?: string;
  vendorId?: string;
  vendorErrorCode?: string;
}

export interface StatusNotificationResponse {
  // Empty payload for StatusNotification
}

// Connection state for tracking charge points
export interface ChargePointConnection {
  chargePointId: string;
  websocket: any; // WebSocket instance
  connectedAt: Date;
  lastHeartbeat?: Date;
  status?: string;
}