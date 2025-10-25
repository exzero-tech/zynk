import { PrismaClient } from '@prisma/client';
import type { BootNotificationRequest, StatusNotificationRequest } from '../models/ocpp.types.js';

// Types for better type safety (using existing types where possible)
interface StatusUpdateData {
  connectorId: number;
  status: string;
  errorCode?: string;
}

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
  ocppChargePointId: chargePointId,
  ocppVersion: '1.6',
  status: 'OFFLINE' as const,
  vendor: bootData.chargePointVendor || null,
  description: `Firmware: ${bootData.firmwareVersion || 'Unknown'}, Serial: ${bootData.chargePointSerialNumber || 'Unknown'}`,
  location: { type: 'Point', coordinates: [79.8612, 6.9271] }, // Default Colombo location
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

      // Create new charger
      const chargerData = createChargerFromBootData(chargePointId, bootData, systemUser.id);
      charger = await prisma.charger.create({
        data: chargerData
      });
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

// Create a default prisma instance for convenience (can be overridden with dependency injection)
const defaultPrisma = new PrismaClient();

// Convenience functions that use the default prisma instance
export const registerChargePointDefault = (chargePointId: string, bootData: BootNotificationRequest) =>
  registerChargePoint(defaultPrisma, chargePointId, bootData);

export const updateChargerStatusDefault = (chargePointId: string, statusData: StatusUpdateData) =>
  updateChargerStatus(defaultPrisma, chargePointId, statusData);

export const updateChargerConnectionStatusDefault = (chargePointId: string, isOnline: boolean) =>
  updateChargerConnectionStatus(defaultPrisma, chargePointId, isOnline);