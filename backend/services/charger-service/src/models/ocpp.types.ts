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

// Remote command interfaces
export interface RemoteCommandRequest {
  chargePointId: string;
  action: string;
  payload: any;
  timeoutMs?: number;
}

export interface RemoteCommandResponse {
  success: boolean;
  transactionId?: string;
  errorCode?: string;
  errorDescription?: string;
}

// Remote command payload interfaces
export interface RemoteStartTransactionRequest {
  connectorId: number;
  idTag: string;
  reservationId?: number;
}

export interface RemoteStartTransactionResponse {
  status: 'Accepted' | 'Rejected';
  transactionId?: number;
}

export interface RemoteStopTransactionRequest {
  transactionId: number;
}

export interface RemoteStopTransactionResponse {
  status: 'Accepted' | 'Rejected';
}

// Heartbeat Payload
export interface HeartbeatRequest {
  // Empty payload for Heartbeat
}

export interface HeartbeatResponse {
  currentTime: string;
}

// Authorize Payload
export interface AuthorizeRequest {
  idTag: string;
}

export interface AuthorizeResponse {
  idTagInfo: {
    status: 'Accepted' | 'Blocked' | 'Expired' | 'Invalid' | 'ConcurrentTx';
    expiryDate?: string;
    parentIdTag?: string;
  };
}

// StartTransaction Payload
export interface StartTransactionRequest {
  connectorId: number;
  idTag: string;
  meterStart: number;
  reservationId?: number;
  timestamp: string;
}

export interface StartTransactionResponse {
  transactionId: string;
  idTagInfo: {
    status: 'Accepted' | 'Blocked' | 'Expired' | 'Invalid' | 'ConcurrentTx';
    expiryDate?: string;
    parentIdTag?: string;
  };
}

// StopTransaction Payload
export interface StopTransactionRequest {
  transactionId: string;
  idTag: string;
  timestamp: string;
  meterStop: number;
  reason?: 'EmergencyStop' | 'EVDisconnected' | 'HardReset' | 'Local' | 'Other' | 'PowerLoss' | 'Reboot' | 'Remote' | 'SoftReset' | 'UnlockCommand' | 'DeAuthorized';
  transactionData?: any[];
}

export interface StopTransactionResponse {
  idTagInfo?: {
    status: 'Accepted' | 'Blocked' | 'Expired' | 'Invalid' | 'ConcurrentTx';
    expiryDate?: string;
    parentIdTag?: string;
  };
}

// MeterValues Payload
export interface MeterValuesRequest {
  connectorId: number;
  transactionId?: number;
  meterValue: Array<{
    timestamp: string;
    sampledValue: Array<{
      value: string;
      context?: 'Interruption.Begin' | 'Interruption.End' | 'Other' | 'Sample.Clock' | 'Sample.Periodic' | 'Transaction.Begin' | 'Transaction.End';
      format?: 'Raw' | 'SignedData';
      measurand?: string;
      phase?: 'L1' | 'L2' | 'L3' | 'N' | 'L1-N' | 'L2-N' | 'L3-N' | 'L1-L2' | 'L2-L3' | 'L3-L1';
      location?: 'Cable' | 'EV' | 'Inlet' | 'Outlet' | 'Body';
      unit?: string;
    }>;
  }>;
}

export interface MeterValuesResponse {
  // Empty payload for MeterValues
}

// Service layer interfaces
export interface StatusUpdateData {
  connectorId: number;
  status: string;
  errorCode?: string;
}

export interface OCPPTransactionData {
  transactionId: string;
  chargePointId: string;
  connectorId: number;
  idTag: string;
  startMeterValue: number;
  chargingSessionId?: number;
}

export interface OCPPTransactionUpdateData {
  endTime?: Date;
  endMeterValue?: number;
  energyConsumed?: number;
  status?: 'ACTIVE' | 'COMPLETED' | 'STOPPED';
}