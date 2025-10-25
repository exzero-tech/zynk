import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export class OCPPService {
  /**
   * Register or update a charge point in the database
   */
  async registerChargePoint(chargePointId: string, bootData: any) {
    try {
      const charger = await prisma.charger.upsert({
        where: { ocppChargePointId: chargePointId },
        update: {
          ocppVersion: '1.6J',
          ocppStatus: 'AVAILABLE',
          updatedAt: new Date(),
        },
        create: {
          hostId: 1, // TODO: Get from authentication
          name: `OCPP Charger ${chargePointId}`,
          type: 'LEVEL2', // Default
          connectorType: 'TYPE2', // Default
          powerOutput: 7200, // Default 7.2kW
          chargingSpeed: '7.2 kW',
          pricePerHour: 250.00,
          ocppChargePointId: chargePointId,
          ocppVersion: '1.6J',
          ocppStatus: 'AVAILABLE',
          location: {
            type: 'Point',
            coordinates: [79.8612, 6.9271], // Default Colombo coordinates
          },
          address: `OCPP Location for ${chargePointId}`,
          status: 'AVAILABLE',
        },
      });

      // Log the OCPP message
      await prisma.ocppMessage.create({
        data: {
          chargePointId: chargePointId,
          messageType: 'BootNotification',
          action: 'BootNotification',
          uniqueId: `boot-${Date.now()}`,
          payload: bootData,
          direction: 'INBOUND',
        },
      });

      return charger;
    } catch (error) {
      console.error('Error registering charge point:', error);
      throw error;
    }
  }

  /**
   * Update charger status based on OCPP StatusNotification
   */
  async updateChargerStatus(chargePointId: string, connectorId: number, status: string, errorCode?: string) {
    try {
      // Map OCPP status to our database status
      const statusMapping: { [key: string]: any } = {
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

      const dbStatus = statusMapping[status] || 'OFFLINE';

      await prisma.charger.updateMany({
        where: { ocppChargePointId: chargePointId },
        data: {
          ocppStatus: status.toUpperCase() as any,
          status: dbStatus,
          updatedAt: new Date(),
        },
      });

      // Log the OCPP message
      await prisma.ocppMessage.create({
        data: {
          chargePointId: chargePointId,
          messageType: 'StatusNotification',
          action: 'StatusNotification',
          uniqueId: `status-${Date.now()}`,
          payload: { connectorId, status, errorCode },
          direction: 'INBOUND',
        },
      });

      return { success: true };
    } catch (error) {
      console.error('Error updating charger status:', error);
      throw error;
    }
  }

  /**
   * Get charger by OCPP charge point ID
   */
  async getChargerByChargePointId(chargePointId: string) {
    return await prisma.charger.findFirst({
      where: { ocpp_charge_point_id: chargePointId },
    });
  }
}

export const ocppService = new OCPPService();