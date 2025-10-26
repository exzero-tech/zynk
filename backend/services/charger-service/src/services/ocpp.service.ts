import { PrismaClient } from '@prisma/client';
import type { BootNotificationRequest, StatusNotificationRequest, StatusUpdateData, OCPPTransactionData, OCPPTransactionUpdateData } from '../models/ocpp.types.js';

// Types for better type safety (using existing types where possible)

// Status mapping function (pure function)
const mapOCPPStatusToDB = (ocppStatus: string): string => {
  const statusMapping: Record<string, string> = {
    'Available': 'AVAILABLE',
    'Preparing': 'OCCUPIED',
    'Charging': 'OCCUPIED',
    'SuspendedEVSE': 'OFFLINE',
    'SuspendedEV': 'OCCUPIED',
    'Finishing': 'OCCUPIED',
    'Reserved': 'OCCUPIED',
    'Unavailable': 'OFFLINE',
    'Faulted': 'MAINTENANCE',
  };

  return statusMapping[ocppStatus] || 'OFFLINE';
};

// Pure function to create system user if needed
export const ensureSystemUser = async (prisma: PrismaClient) => {
  const systemEmail = 'system@zynk.platform';

  let systemUser = await prisma.user.findFirst({
    where: { email: systemEmail }
  });

  if (!systemUser) {
    systemUser = await prisma.user.create({
      data: {
        email: systemEmail,
        password: 'system', // Not used for authentication
        role: 'ADMIN',
        name: 'System',
        isVerified: true
      }
    });
  }

  return systemUser;
};

// Pure function to create charger data from boot notification
export const createChargerFromBootData = (chargePointId: string, bootData: BootNotificationRequest, systemUserId: number) => ({
  hostId: systemUserId,
  name: `${bootData.chargePointVendor || 'Unknown'} ${bootData.chargePointModel || 'Charger'}`,
  type: 'LEVEL2' as const,
  connectorType: 'TYPE2' as const,
  powerOutput: 7200,
  chargingSpeed: '7.2 kW',
  pricePerHour: 0,
  isByoc: false,
  ocppChargePointId: chargePointId,
  ocppVersion: '1.6',
  ocppStatus: 'OFFLINE' as const,
  status: 'OFFLINE' as const,
  vendor: bootData.chargePointVendor || null,
  description: `Firmware: ${bootData.firmwareVersion || 'Unknown'}, Serial: ${bootData.chargePointSerialNumber || 'Unknown'}`,
  // Note: location field is Unsupported in Prisma (PostGIS geography), will be set via raw SQL after creation
  address: `Charge Point ${chargePointId}`
});

// Pure function to log OCPP messages
export const logOCPPMessage = async (
  prisma: PrismaClient,
  chargePointId: string,
  messageType: string,
  action: string,
  payload: any,
  direction: 'INBOUND' | 'OUTBOUND' = 'INBOUND'
) => {
  return await prisma.ocppMessage.create({
    data: {
      chargePointId,
      messageType,
      action,
      uniqueId: `${action.toLowerCase()}-${Date.now()}`,
      payload,
      direction
    }
  });
};

// Functional approach: Register or update charge point
export const registerChargePoint = async (
  prisma: PrismaClient,
  chargePointId: string,
  bootData: BootNotificationRequest
) => {
  try {
    // Check if charger already exists
    const existingCharger = await prisma.charger.findFirst({
      where: { ocppChargePointId: chargePointId }
    });

    let charger;
    if (existingCharger) {
      // Update existing charger status
      charger = await prisma.charger.update({
        where: { id: existingCharger.id },
        data: { status: 'AVAILABLE' }
      });
    } else {
      // Ensure system user exists
      const systemUser = await ensureSystemUser(prisma);

      // Create new charger using raw SQL (PostGIS geography requires raw SQL)
      const chargerData = createChargerFromBootData(chargePointId, bootData, systemUser.id);
      
      const result = await prisma.$queryRaw<Array<{id: number}>>`
        INSERT INTO chargers (
          "hostId", name, type, "connectorType", "powerOutput", "chargingSpeed", 
          "pricePerHour", "isByoc", "ocppChargePointId", "ocppVersion", "ocppStatus",
          location, address, status, description, vendor, "createdAt", "updatedAt"
        ) VALUES (
          ${chargerData.hostId}, ${chargerData.name}, ${chargerData.type}::"ChargerType", 
          ${chargerData.connectorType}::"ConnectorType", ${chargerData.powerOutput}, ${chargerData.chargingSpeed},
          ${chargerData.pricePerHour}, ${chargerData.isByoc}, ${chargerData.ocppChargePointId}, 
          ${chargerData.ocppVersion}, ${chargerData.ocppStatus}::"OcppStatus",
          ST_GeographyFromText('POINT(79.8612 6.9271)'), ${chargerData.address}, 
          ${chargerData.status}::"ChargerStatus", ${chargerData.description}, ${chargerData.vendor},
          CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
        )
        RETURNING id
      `;

      if (!result || result.length === 0) {
        throw new Error('Failed to create charger');
      }

      // Fetch the created charger
      charger = await prisma.charger.findUnique({
        where: { id: result[0].id }
      });

      if (!charger) {
        throw new Error('Charger created but not found');
      }
    }

    // Log the OCPP message
    await logOCPPMessage(prisma, chargePointId, 'BootNotification', 'BootNotification', bootData);

    return charger;
  } catch (error) {
    console.error('Error registering charge point:', error);
    throw error;
  }
};

// Functional approach: Update charger status
export const updateChargerStatus = async (
  prisma: PrismaClient,
  chargePointId: string,
  statusData: StatusUpdateData
) => {
  try {
    const dbStatus = mapOCPPStatusToDB(statusData.status);

    await prisma.charger.updateMany({
      where: { ocppChargePointId: chargePointId },
      data: { status: dbStatus as any }
    });

    // Log the OCPP message
    await logOCPPMessage(
      prisma,
      chargePointId,
      'StatusNotification',
      'StatusNotification',
      statusData
    );

    return { success: true };
  } catch (error) {
    console.error('Error updating charger status:', error);
    throw error;
  }
};

// Functional approach: Update charger connection status
export const updateChargerConnectionStatus = async (
  prisma: PrismaClient,
  chargePointId: string,
  isOnline: boolean
) => {
  try {
    const status = isOnline ? 'AVAILABLE' : 'OFFLINE';

    await prisma.charger.updateMany({
      where: { ocppChargePointId: chargePointId },
      data: { status: status as any }
    });

    console.log(`Updated charger ${chargePointId} connection status: ${isOnline ? 'online' : 'offline'}`);
    return { success: true };
  } catch (error) {
    console.error('Error updating charger connection status:', error);
    throw error;
  }
};

// Functional approach: Create OCPP transaction
export const createOcppTransaction = async (
  prisma: PrismaClient,
  transactionData: OCPPTransactionData
) => {
  try {
    const data: any = {
      transactionId: transactionData.transactionId,
      chargePointId: transactionData.chargePointId,
      connectorId: transactionData.connectorId,
      idTag: transactionData.idTag,
      startTime: new Date(),
      startMeterValue: transactionData.startMeterValue,
      status: 'ACTIVE' as const
    };

    // Only include chargingSessionId if provided
    if (transactionData.chargingSessionId !== undefined) {
      data.chargingSessionId = transactionData.chargingSessionId;
    }

    const transaction = await prisma.ocppTransaction.create({
      data
    });

    console.log(`Created OCPP transaction: ${transaction.transactionId}`);
    return transaction;
  } catch (error) {
    console.error('Error creating OCPP transaction:', error);
    throw error;
  }
};

// Functional approach: Update OCPP transaction
export const updateOcppTransaction = async (
  prisma: PrismaClient,
  transactionId: string,
  updateData: OCPPTransactionUpdateData
) => {
  try {
    const data: any = {
      updatedAt: new Date()
    };

    // Only include defined fields
    if (updateData.endTime !== undefined) data.endTime = updateData.endTime;
    if (updateData.endMeterValue !== undefined) data.endMeterValue = updateData.endMeterValue;
    if (updateData.energyConsumed !== undefined) data.energyConsumed = updateData.energyConsumed;
    if (updateData.status !== undefined) data.status = updateData.status;

    const transaction = await prisma.ocppTransaction.update({
      where: { transactionId },
      data
    });

    console.log(`Updated OCPP transaction: ${transactionId}`);
    return transaction;
  } catch (error) {
    console.error('Error updating OCPP transaction:', error);
    throw error;
  }
};

// Functional approach: Link OCPP transaction to charging session
export const linkOcppToSession = async (
  prisma: PrismaClient,
  transactionId: string,
  sessionId: number
) => {
  try {
    await prisma.ocppTransaction.update({
      where: { transactionId },
      data: {
        chargingSessionId: sessionId,
        updatedAt: new Date()
      }
    });

    // Also update the session with OCPP transaction ID
    await prisma.chargingSession.update({
      where: { id: sessionId },
      data: {
        ocppTransactionId: transactionId,
        updatedAt: new Date()
      }
    });

    console.log(`Linked OCPP transaction ${transactionId} to session ${sessionId}`);
    return { success: true };
  } catch (error) {
    console.error('Error linking OCPP transaction to session:', error);
    throw error;
  }
};

// Functional approach: Calculate energy consumed
export const calculateEnergyConsumed = (startMeterValue: number, endMeterValue: number): number => {
  if (endMeterValue < startMeterValue) {
    console.warn(`End meter value (${endMeterValue}) is less than start (${startMeterValue})`);
    return 0;
  }
  return endMeterValue - startMeterValue;
};

// Create a default prisma instance for convenience (can be overridden with dependency injection)
const defaultPrisma = new PrismaClient();

// Convenience functions that use the default prisma instance
export const registerChargePointDefault = (chargePointId: string, bootData: BootNotificationRequest) =>
  registerChargePoint(defaultPrisma, chargePointId, bootData);

export const updateChargerStatusDefault = (chargePointId: string, statusData: StatusUpdateData) =>
  updateChargerStatus(defaultPrisma, chargePointId, statusData);

export const updateChargerConnectionStatusDefault = (chargePointId: string, isOnline: boolean) =>
  updateChargerConnectionStatus(defaultPrisma, chargePointId, isOnline);

export const logOCPPMessageDefault = (
  chargePointId: string,
  messageType: string,
  action: string,
  payload: any,
  direction: 'INBOUND' | 'OUTBOUND' = 'INBOUND'
) => logOCPPMessage(defaultPrisma, chargePointId, messageType, action, payload, direction);

export const createOcppTransactionDefault = (transactionData: OCPPTransactionData) =>
  createOcppTransaction(defaultPrisma, transactionData);

export const updateOcppTransactionDefault = (
  transactionId: string,
  updateData: OCPPTransactionUpdateData
) => updateOcppTransaction(defaultPrisma, transactionId, updateData);

export const linkOcppToSessionDefault = (transactionId: string, sessionId: number) =>
  linkOcppToSession(defaultPrisma, transactionId, sessionId);